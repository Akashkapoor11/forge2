import { useState } from "react";
import Ticket from "./Ticket";

export default function Column({
  list,
  cards,
  members,
  tags,
  onOpenCard,
  onAddCard,
  onRenameList,
  onDeleteList,
  onDropCard,
  draggedCardId,
  setDraggedCardId,
}) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const submitCard = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setAdding(false);
      return;
    }
    onAddCard(list.id, trimmed);
    setTitle("");
  };

  return (
    <div
      className={`column ${dragOver ? "drag-over" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (draggedCardId) onDropCard(draggedCardId, list.id, cards.length);
      }}
    >
      <div className="column-header">
        <div className="column-title-row">
          <input
            className="column-title"
            value={list.name}
            onChange={(e) => onRenameList(list.id, e.target.value)}
          />
          <span className="column-count">{cards.length}</span>
        </div>
        <button
          className="column-delete"
          aria-label={`Delete ${list.name} list`}
          onClick={() => {
            if (confirm(`Delete list "${list.name}" and all its cards?`)) onDeleteList(list.id);
          }}
        >
          ✕
        </button>
      </div>

      <div className="column-cards">
        {cards.map((card) => (
          <Ticket
            key={card.id}
            card={card}
            list={list}
            members={members}
            tags={tags}
            onOpen={onOpenCard}
            dragging={draggedCardId === card.id}
            onDragStart={(e, c) => {
              setDraggedCardId(c.id);
              e.dataTransfer.effectAllowed = "move";
            }}
          />
        ))}
      </div>

      {adding ? (
        <form onSubmit={submitCard} style={{ margin: "0 10px 12px" }}>
          <input
            autoFocus
            className="text-input"
            placeholder="Card title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={submitCard}
          />
        </form>
      ) : (
        <button className="add-card-btn" onClick={() => setAdding(true)}>
          + Add card
        </button>
      )}
    </div>
  );
}
