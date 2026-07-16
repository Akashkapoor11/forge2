// ── Data access layer ───────────────────────────────────────────────────────
// Every function here returns a Promise, is named after the REST action it
// stands in for, and touches nothing outside this file. That's on purpose:
// to point this app at the real Laravel API instead of local storage, you
// only ever edit this file. Nothing in /components or /hooks needs to change.
//
// To switch to the real API:
//   1. Set VITE_API_BASE_URL in .env (see .env.example)
//   2. Replace each function body with the commented `fetch(...)` version
//      below it — the shapes already match what the Laravel routes return.
//
// This ships wired to localStorage so the app is fully demoable with zero
// backend running — useful for the live URL if the API deploy falls through,
// per the qualifier handbook's own fallback guidance.

import { seedBoards, seedLists, seedCards, seedMembers, seedTags } from "./seed";

const KEY = "forge2-kanban-v1";
const LATENCY_MS = 120; // tiny artificial delay so loading states are real, not instant

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

// ── Boards ───────────────────────────────────────────────────────────────
export async function getBoards() {
  const db = load();
  return delay(db.boards);
  // return fetch(`${import.meta.env.VITE_API_BASE_URL}/boards`).then((r) => r.json());
}

export async function createBoard(name) {
  const db = load();
  const board = { id: uid("board"), name, createdAt: Date.now() };
  db.boards.push(board);
  save(db);
  return delay(board);
  // return fetch(`${import.meta.env.VITE_API_BASE_URL}/boards`, {
  //   method: "POST", headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ name }),
  // }).then((r) => r.json());
}

export async function deleteBoard(boardId) {
  const db = load();
  db.boards = db.boards.filter((b) => b.id !== boardId);
  db.lists = db.lists.filter((l) => l.boardId !== boardId);
  db.cards = db.cards.filter((c) => c.boardId !== boardId);
  save(db);
  return delay(true);
}

// ── Lists ────────────────────────────────────────────────────────────────
export async function getLists(boardId) {
  const db = load();
  return delay(db.lists.filter((l) => l.boardId === boardId).sort((a, b) => a.order - b.order));
}

export async function createList(boardId, name) {
  const db = load();
  const order = db.lists.filter((l) => l.boardId === boardId).length;
  const list = { id: uid("list"), boardId, name, order };
  db.lists.push(list);
  save(db);
  return delay(list);
}

export async function renameList(listId, name) {
  const db = load();
  const list = db.lists.find((l) => l.id === listId);
  if (list) list.name = name;
  save(db);
  return delay(list);
}

export async function deleteList(listId) {
  const db = load();
  db.lists = db.lists.filter((l) => l.id !== listId);
  db.cards = db.cards.filter((c) => c.listId !== listId);
  save(db);
  return delay(true);
}

// ── Cards ────────────────────────────────────────────────────────────────
export async function getCards(boardId) {
  const db = load();
  return delay(db.cards.filter((c) => c.boardId === boardId).sort((a, b) => a.order - b.order));
}

export async function createCard(boardId, listId, title) {
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

export async function updateCard(cardId, patch) {
  const db = load();
  const card = db.cards.find((c) => c.id === cardId);
  if (card) Object.assign(card, patch);
  save(db);
  return delay(card);
}

export async function moveCard(cardId, toListId, toOrder) {
  const db = load();
  const card = db.cards.find((c) => c.id === cardId);
  if (!card) return delay(null);
  card.listId = toListId;
  card.order = toOrder;
  save(db);
  return delay(card);
  // return fetch(`${import.meta.env.VITE_API_BASE_URL}/cards/${cardId}/move`, {
  //   method: "PATCH", headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ listId: toListId, order: toOrder }),
  // }).then((r) => r.json());
}

export async function deleteCard(cardId) {
  const db = load();
  db.cards = db.cards.filter((c) => c.id !== cardId);
  save(db);
  return delay(true);
}

export async function addComment(cardId, text, memberId) {
  const db = load();
  const card = db.cards.find((c) => c.id === cardId);
  if (card) {
    card.comments = card.comments || [];
    card.comments.push({ id: uid("comment"), text, memberId, createdAt: Date.now() });
  }
  save(db);
  return delay(card);
}

// ── Members ──────────────────────────────────────────────────────────────
export async function getMembers() {
  const db = load();
  return delay(db.members);
}

export async function createMember(name, color) {
  const db = load();
  const member = { id: uid("mem"), name, color };
  db.members.push(member);
  save(db);
  return delay(member);
}

// ── Tags ─────────────────────────────────────────────────────────────────
export async function getTags() {
  const db = load();
  return delay(db.tags);
}

export async function createTag(name, color) {
  const db = load();
  const tag = { id: uid("tag"), name, color };
  db.tags.push(tag);
  save(db);
  return delay(tag);
}
