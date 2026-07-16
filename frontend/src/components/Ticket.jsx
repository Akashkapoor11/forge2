import Avatar from "./Avatar";

export function isOverdue(card, list) {
  if (!card.dueDate) return false;
  const isDoneColumn = /done/i.test(list?.name || "");
  return card.dueDate < Date.now() && !isDoneColumn;
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function Ticket({ card, list, members, tags, onOpen, onDragStart, dragging }) {
  const assignee = members.find((m) => m.id === card.memberId);
  const cardTags = (card.tagIds || []).map((id) => tags.find((t) => t.id === id)).filter(Boolean);
  const overdue = isOverdue(card, list);
  const shortId = card.id.split("-")[1]?.slice(-4) || "0000";

  return (
    <div
      className={`ticket ${dragging ? "dragging" : ""}`}
      draggable
      onDragStart={(e) => onDragStart(e, card)}
      onClick={() => onOpen(card)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(card)}
    >
      <div className="ticket-stub">
        <span>#{shortId}</span>
        <span>{formatDate(card.dueDate || Date.now())}</span>
      </div>
      <div className="ticket-perforation" aria-hidden="true" />
      <div className="ticket-body">
        <p className="ticket-title">{card.title}</p>
        {cardTags.length > 0 && (
          <div className="ticket-tags">
            {cardTags.map((t) => (
              <span key={t.id} className="tag-pill" style={{ background: t.color }}>
                {t.name}
              </span>
            ))}
          </div>
        )}
        <div className="ticket-footer">
          {card.dueDate ? (
            <span className={`due-chip ${overdue ? "overdue" : ""}`}>
              {overdue ? "⚠ overdue" : formatDate(card.dueDate)}
            </span>
          ) : (
            <span />
          )}
          <Avatar member={assignee} />
        </div>
      </div>
    </div>
  );
}
