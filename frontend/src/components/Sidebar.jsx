import { useState } from "react";

export default function Sidebar({ boards, activeBoardId, onSelect, onCreate, onDelete }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName("");
    setCreating(false);
  };

  return (
    <aside className="sidebar" aria-label="Boards navigation">
      <div className="sidebar-brand">
        <span className="brand-icon" aria-hidden="true">⬡</span>
        <span className="brand-name">Docket</span>
      </div>

      <div className="sidebar-section-label">Workspaces</div>

      <ul className="board-list" role="list">
        {boards.map((b) => (
          <li
            key={b.id}
            className={`board-list-item ${b.id === activeBoardId ? "active" : ""}`}
            onClick={() => onSelect(b.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onSelect(b.id)}
            aria-current={b.id === activeBoardId ? "page" : undefined}
          >
            <span className="board-dot" aria-hidden="true" />
            <span className="board-name" style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {b.name}
            </span>
            <button
              className="delete-btn"
              aria-label={`Delete ${b.name}`}
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete board "${b.name}"? This can't be undone.`)) {
                  onDelete(b.id);
                }
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {creating ? (
        <form onSubmit={submit} style={{ marginTop: 10 }}>
          <input
            autoFocus
            className="text-input"
            placeholder="Board name…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => !name && setCreating(false)}
            style={{ marginBottom: 6 }}
          />
        </form>
      ) : (
        <button id="new-board-btn" className="new-board-btn" onClick={() => setCreating(true)}>
          <span>+ New board</span>
        </button>
      )}

      <div className="sidebar-footer">
        <div className="agent-badge" title="Built by Hermes + OpenClaw agent team">
          <span className="agent-dot" aria-hidden="true" />
          <div className="agent-badge-text">
            <strong>Agents online</strong>
            <br />
            Hermes · OpenClaw
          </div>
        </div>
      </div>
    </aside>
  );
}
