// ── Data access layer ─────────────────────────────────────────────────────────
// API-first with automatic localStorage fallback.
//
// Set VITE_API_BASE_URL in .env to point at the real Laravel backend.
// If the env var is missing OR the API returns an error / is unreachable,
// every function transparently falls back to localStorage so the live
// demo at forge2-sooty.vercel.app always works even with no backend.
//
// Nothing outside this file needs to change when the backend is wired up.

import { seedBoards, seedLists, seedCards, seedMembers, seedTags } from "./seed";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const KEY = "forge2-kanban-v1";
const LATENCY_MS = 120; // small delay so loading states are visible

// ── localStorage helpers ──────────────────────────────────────────────────────
function load() {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  const initial = {
    boards: seedBoards,
    lists: seedLists,
    cards: seedCards,
    members: seedMembers,
    tags: seedTags,
  };
  localStorage.setItem(KEY, JSON.stringify(initial));
  return initial;
}

function save(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ── API helpers ───────────────────────────────────────────────────────────────
// Convert camelCase keys → snake_case before sending to Laravel
const KEY_MAP = {
  listId: "list_id",
  boardId: "board_id",
  memberId: "member_id",
  dueDate: "due_date",
  tagIds: "tag_ids",
  createdAt: "created_at",
};
function toSnake(obj) {
  if (!obj || typeof obj !== "object") return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [KEY_MAP[k] ?? k, v])
  );
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * apiFirst(fetchFn, fallbackFn)
 * Runs fetchFn() against the real API when BASE_URL is configured.
 * On any network error or non-2xx response, silently runs fallbackFn()
 * (localStorage) and logs a single console.warn so it's visible in DevTools.
 */
async function apiFirst(fetchFn, fallbackFn) {
  if (!BASE_URL) return fallbackFn();
  try {
    return await fetchFn();
  } catch (err) {
    console.warn("[api] Backend unreachable — falling back to localStorage:", err.message);
    return fallbackFn();
  }
}

// ── Boards ────────────────────────────────────────────────────────────────────
export async function getBoards() {
  return apiFirst(
    () => apiFetch("/boards"),
    () => delay(load().boards)
  );
}

export async function createBoard(name) {
  return apiFirst(
    () => apiFetch("/boards", { method: "POST", body: JSON.stringify({ name }) }),
    () => {
      const db = load();
      const board = { id: uid("board"), name, createdAt: Date.now() };
      db.boards.push(board);
      save(db);
      return delay(board);
    }
  );
}

export async function deleteBoard(boardId) {
  return apiFirst(
    () => apiFetch(`/boards/${boardId}`, { method: "DELETE" }),
    () => {
      const db = load();
      db.boards = db.boards.filter((b) => b.id !== boardId);
      db.lists = db.lists.filter((l) => l.boardId !== boardId);
      db.cards = db.cards.filter((c) => c.boardId !== boardId);
      save(db);
      return delay(true);
    }
  );
}

// ── Lists ─────────────────────────────────────────────────────────────────────
export async function getLists(boardId) {
  return apiFirst(
    () => apiFetch(`/boards/${boardId}/lists`),
    () => {
      const db = load();
      return delay(
        db.lists
          .filter((l) => l.boardId === boardId)
          .sort((a, b) => a.order - b.order)
      );
    }
  );
}

export async function createList(boardId, name) {
  return apiFirst(
    () =>
      apiFetch(`/boards/${boardId}/lists`, {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    () => {
      const db = load();
      const order = db.lists.filter((l) => l.boardId === boardId).length;
      const list = { id: uid("list"), boardId, name, order };
      db.lists.push(list);
      save(db);
      return delay(list);
    }
  );
}

export async function renameList(listId, name) {
  return apiFirst(
    () => apiFetch(`/lists/${listId}`, { method: "PATCH", body: JSON.stringify({ name }) }),
    () => {
      const db = load();
      const list = db.lists.find((l) => l.id === listId);
      if (list) list.name = name;
      save(db);
      return delay(list);
    }
  );
}

export async function deleteList(listId) {
  return apiFirst(
    () => apiFetch(`/lists/${listId}`, { method: "DELETE" }),
    () => {
      const db = load();
      db.lists = db.lists.filter((l) => l.id !== listId);
      db.cards = db.cards.filter((c) => c.listId !== listId);
      save(db);
      return delay(true);
    }
  );
}

// ── Cards ─────────────────────────────────────────────────────────────────────
export async function getCards(boardId) {
  return apiFirst(
    () => apiFetch(`/boards/${boardId}/cards`),
    () => {
      const db = load();
      return delay(
        db.cards
          .filter((c) => c.boardId === boardId)
          .sort((a, b) => a.order - b.order)
      );
    }
  );
}

export async function createCard(boardId, listId, title) {
  return apiFirst(
    () =>
      apiFetch(`/boards/${boardId}/cards`, {
        method: "POST",
        body: JSON.stringify(toSnake({ listId, title })),
      }),
    () => {
      const db = load();
      const order = db.cards.filter((c) => c.listId === listId).length;
      const card = {
        id: uid("card"),
        boardId,
        listId,
        title,
        description: "",
        tagIds: [],
        memberId: null,
        dueDate: null,
        order,
        comments: [],
      };
      db.cards.push(card);
      save(db);
      return delay(card);
    }
  );
}

export async function updateCard(cardId, patch) {
  return apiFirst(
    () =>
      apiFetch(`/cards/${cardId}`, {
        method: "PATCH",
        body: JSON.stringify(toSnake(patch)),
      }),
    () => {
      const db = load();
      const card = db.cards.find((c) => c.id === cardId);
      if (card) Object.assign(card, patch);
      save(db);
      return delay(card);
    }
  );
}

export async function moveCard(cardId, toListId, toOrder) {
  return apiFirst(
    () =>
      apiFetch(`/cards/${cardId}/move`, {
        method: "PATCH",
        body: JSON.stringify(toSnake({ listId: toListId, order: toOrder })),
      }),
    () => {
      const db = load();
      const card = db.cards.find((c) => c.id === cardId);
      if (!card) return delay(null);
      card.listId = toListId;
      card.order = toOrder;
      save(db);
      return delay(card);
    }
  );
}

export async function deleteCard(cardId) {
  return apiFirst(
    () => apiFetch(`/cards/${cardId}`, { method: "DELETE" }),
    () => {
      const db = load();
      db.cards = db.cards.filter((c) => c.id !== cardId);
      save(db);
      return delay(true);
    }
  );
}

export async function addComment(cardId, text, memberId) {
  return apiFirst(
    () =>
      apiFetch(`/cards/${cardId}/comments`, {
        method: "POST",
        body: JSON.stringify({ text, memberId }),
      }),
    () => {
      const db = load();
      const card = db.cards.find((c) => c.id === cardId);
      if (card) {
        card.comments = card.comments || [];
        card.comments.push({
          id: uid("comment"),
          text,
          memberId,
          createdAt: Date.now(),
        });
      }
      save(db);
      return delay(card);
    }
  );
}

// ── Members ───────────────────────────────────────────────────────────────────
export async function getMembers() {
  return apiFirst(
    () => apiFetch("/members"),
    () => delay(load().members)
  );
}

export async function createMember(name, color) {
  return apiFirst(
    () =>
      apiFetch("/members", {
        method: "POST",
        body: JSON.stringify({ name, color }),
      }),
    () => {
      const db = load();
      const member = { id: uid("mem"), name, color };
      db.members.push(member);
      save(db);
      return delay(member);
    }
  );
}

// ── Tags ──────────────────────────────────────────────────────────────────────
export async function getTags() {
  return apiFirst(
    () => apiFetch("/tags"),
    () => delay(load().tags)
  );
}

export async function createTag(name, color) {
  return apiFirst(
    () =>
      apiFetch("/tags", {
        method: "POST",
        body: JSON.stringify({ name, color }),
      }),
    () => {
      const db = load();
      const tag = { id: uid("tag"), name, color };
      db.tags.push(tag);
      save(db);
      return delay(tag);
    }
  );
}
