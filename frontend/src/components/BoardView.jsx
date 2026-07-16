import { useState } from "react";
import Column from "./Column";
import CardModal from "./CardModal";
import { useBoardData } from "../hooks/useBoardData";
import { isOverdue } from "./Ticket";

export default function BoardView({ board }) {
  const data = useBoardData(board.id);
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [openCardId, setOpenCardId] = useState(null);
  const [addingList, setAddingList] = useState(false);
  const [listName, setListName] = useState("");

  if (data.loading) {
    return (
      <div className="board-view">
        <div className="empty-state" style={{ margin: "auto" }}>
          <span className="loading-spinner" aria-hidden="true" />
          Loading board…
        </div>
      </div>
    );
  }

  const cardsForList = (listId) =>
    data.cards.filter((c) => c.listId === listId).sort((a, b) => a.order - b.order);

  const openCard = data.cards.find((c) => c.id === openCardId);
  const openCardList = openCard ? data.lists.find((l) => l.id === openCard.listId) : null;

  // Board stats for header
  const overdueCount = data.cards.filter((c) => {
    const list = data.lists.find((l) => l.id === c.listId);
    return isOverdue(c, list);
  }).length;

  const submitList = (e) => {
    e.preventDefault();
    const trimmed = listName.trim();
    if (trimmed) data.addList(trimmed);
    setListName("");
    setAddingList(false);
  };

  return (
    <div className="board-view">
      <div className="board-header">
        <h1>{board.name}</h1>
        <div className="board-header-stats">
          <span className="stat-chip">
            {data.lists.length} lists
          </span>
          <span className="stat-chip">
            {data.cards.length} cards
          </span>
          {overdueCount > 0 && (
            <span className="stat-chip overdue" title="Cards past their due date (not in Done)">
              ⚠ {overdueCount} overdue
            </span>
          )}
        </div>
      </div>

      <div className="board-columns">
        {data.lists.length === 0 && (
          <div className="empty-state">
            <span>No lists yet.</span>
            <span style={{ fontSize: 11 }}>Add a list to get started →</span>
          </div>
        )}

        {data.lists.map((list) => (
          <Column
            key={list.id}
            list={list}
            cards={cardsForList(list.id)}
            members={data.members}
            tags={data.tags}
            onOpenCard={(card) => setOpenCardId(card.id)}
            onAddCard={data.addCard}
            onRenameList={data.renameList}
            onDeleteList={data.removeList}
            onDropCard={(cardId, toListId, toOrder) => {
              data.moveCard(cardId, toListId, toOrder);
              setDraggedCardId(null);
            }}
            draggedCardId={draggedCardId}
            setDraggedCardId={setDraggedCardId}
          />
        ))}

        <div className="add-list-panel">
          {addingList ? (
            <form onSubmit={submitList} className="add-list-form">
              <input
                autoFocus
                id="new-list-input"
                className="text-input"
                placeholder="List name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                onBlur={submitList}
              />
            </form>
          ) : (
            <button
              id="add-list-btn"
              className="new-board-btn"
              onClick={() => setAddingList(true)}
            >
              <span>+ Add list</span>
            </button>
          )}
        </div>
      </div>

      {openCard && (
        <CardModal
          card={openCard}
          list={openCardList}
          members={data.members}
          tags={data.tags}
          onClose={() => setOpenCardId(null)}
          onSave={data.saveCard}
          onDelete={data.removeCard}
          onAddComment={data.addComment}
        />
      )}
    </div>
  );
}
