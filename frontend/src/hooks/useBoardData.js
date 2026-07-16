import { useCallback, useEffect, useState } from "react";
import * as api from "../data/api";

export function useBoardData(boardId) {
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [members, setMembers] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!boardId) return;
    setLoading(true);
    const [l, c, m, t] = await Promise.all([
      api.getLists(boardId),
      api.getCards(boardId),
      api.getMembers(),
      api.getTags(),
    ]);
    setLists(l);
    setCards(c);
    setMembers(m);
    setTags(t);
    setLoading(false);
  }, [boardId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addList = async (name) => {
    await api.createList(boardId, name);
    refresh();
  };

  const renameList = async (listId, name) => {
    setLists((prev) => prev.map((l) => (l.id === listId ? { ...l, name } : l)));
    await api.renameList(listId, name);
  };

  const removeList = async (listId) => {
    await api.deleteList(listId);
    refresh();
  };

  const addCard = async (listId, title) => {
    await api.createCard(boardId, listId, title);
    refresh();
  };

  const saveCard = async (cardId, patch) => {
    await api.updateCard(cardId, patch);
    refresh();
  };

  const removeCard = async (cardId) => {
    await api.deleteCard(cardId);
    refresh();
  };

  const moveCard = async (cardId, toListId, toOrder) => {
    // Optimistic local update so drag-and-drop feels instant, then reconcile.
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, listId: toListId, order: toOrder } : c))
    );
    await api.moveCard(cardId, toListId, toOrder);
    refresh();
  };

  const addComment = async (cardId, text, memberId) => {
    await api.addComment(cardId, text, memberId);
    refresh();
  };

  const addMember = async (name, color) => {
    await api.createMember(name, color);
    refresh();
  };

  const addTag = async (name, color) => {
    await api.createTag(name, color);
    refresh();
  };

  return {
    lists,
    cards,
    members,
    tags,
    loading,
    addList,
    renameList,
    removeList,
    addCard,
    saveCard,
    removeCard,
    moveCard,
    addComment,
    addMember,
    addTag,
    refresh,
  };
}
