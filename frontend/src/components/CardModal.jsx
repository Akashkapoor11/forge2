import { useEffect, useState } from "react";
import Avatar, { initials } from "./Avatar";
import { isOverdue } from "./Ticket";

function toDateInputValue(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const off = d.getTimezoneOffset();
  return new Date(ts - off * 60000).toISOString().slice(0, 10);
}

export default function CardModal({
  card,
  list,
  members,
  tags,
  onClose,
  onSave,
  onDelete,
  onAddComment,
}) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [tagIds, setTagIds] = useState(card.tagIds || []);
  const [memberId, setMemberId] = useState(card.memberId || null);
  const [dueDate, setDueDate] = useState(toDateInputValue(card.dueDate));
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description || "");
    setTagIds(card.tagIds || []);
    setMemberId(card.memberId || null);
    setDueDate(toDateInputValue(card.dueDate));
  }, [card]);

  const persist = (patch) => onSave(card.id, patch);

  const toggleTag = (tagId) => {
    const next = tagIds.includes(tagId) ? tagIds.filter((t) => t !== tagId) : [...tagIds, tagId];
    setTagIds(next);
    persist({ tagIds: next });
  };

  const selectMember = (id) => {
    const next = memberId === id ? null : id;
    setMemberId(next);
    persist({ memberId: next });
  };

  const commitDueDate = (value) => {
    setDueDate(value);
    persist({ dueDate: value ? new Date(value + "T00:00:00").getTime() : null });
  };

  const overdue = isOverdue({ ...card, dueDate: card.dueDate }, list);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ position: "relative" }}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <span className="field-label" style={{ marginTop: 0 }}>
          {list?.name} · {overdue ? "overdue" : "on track"}
        </span>
        <input
          className="text-input"
          style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, padding: "8px 10px" }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => persist({ title })}
        />

        <span className="field-label">Description</span>
        <textarea
          className="textarea-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => persist({ description })}
          placeholder="Add more detail…"
        />

        <span className="field-label">Tags</span>
        <div className="pill-picker">
          {tags.map((t) => {
            const selected = tagIds.includes(t.id);
            return (
              <button
                key={t.id}
                className={`pill-option ${selected ? "selected" : ""}`}
                style={selected ? { background: t.color } : {}}
                onClick={() => toggleTag(t.id)}
              >
                {t.name}
              </button>
            );
          })}
        </div>

        <span className="field-label">Assignee</span>
        <div className="member-row">
          {members.map((m) => {
            const selected = memberId === m.id;
            return (
              <button
                key={m.id}
                className={`member-option ${selected ? "selected" : ""}`}
                onClick={() => selectMember(m.id)}
              >
                <Avatar member={m} size={18} />
                {m.name}
              </button>
            );
          })}
        </div>

        <span className="field-label">Due date</span>
        <input
          type="date"
          className="text-input"
          value={dueDate}
          onChange={(e) => commitDueDate(e.target.value)}
        />

        <span className="field-label">Comments</span>
        <div className="comments-list">
          {(card.comments || []).length === 0 && (
            <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>No comments yet.</span>
          )}
          {(card.comments || []).map((c) => {
            const author = members.find((m) => m.id === c.memberId);
            return (
              <div className="comment-row" key={c.id}>
                <Avatar member={author || { name: "?", color: "#555" }} size={20} />
                <div className="comment-bubble">
                  {c.text}
                  <div className="comment-meta">
                    {author?.name || "Unknown"} · {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="comment-composer">
          <input
            id="comment-input"
            className="text-input"
            placeholder="Write a comment… (Enter to send)"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && commentText.trim()) {
                onAddComment(card.id, commentText.trim(), memberId || members[0]?.id);
                setCommentText("");
              }
            }}
          />
          <button
            id="send-comment-btn"
            className="send-comment-btn"
            disabled={!commentText.trim()}
            onClick={() => {
              if (commentText.trim()) {
                onAddComment(card.id, commentText.trim(), memberId || members[0]?.id);
                setCommentText("");
              }
            }}
            aria-label="Send comment"
          >
            ↵
          </button>
        </div>

        <div className="modal-actions">
          <button
            className="btn-danger-ghost"
            onClick={() => {
              if (confirm("Delete this card?")) {
                onDelete(card.id);
                onClose();
              }
            }}
          >
            Delete card
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
