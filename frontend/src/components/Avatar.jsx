export function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function Avatar({ member, size = 22 }) {
  if (!member) return null;
  return (
    <span
      className="avatar"
      style={{ background: member.color, width: size, height: size }}
      title={member.name}
      aria-label={`Assigned to ${member.name}`}
    >
      {initials(member.name)}
    </span>
  );
}
