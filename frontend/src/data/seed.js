// Seed data shown on first load, before the user creates anything of their own.
// Dates are generated relative to "now" so the overdue-flag demo always works,
// no matter when a judge opens the live URL.

const DAY = 24 * 60 * 60 * 1000;
const today = Date.now();

export const seedTags = [
  { id: "tag-bug", name: "bug", color: "#C1443C" },
  { id: "tag-design", name: "design", color: "#4A54E1" },
  { id: "tag-infra", name: "infra", color: "#3E7C74" },
  { id: "tag-urgent", name: "urgent", color: "#E8A33D" },
];

export const seedMembers = [
  { id: "mem-1", name: "Priya Sharma", color: "#4A54E1" },
  { id: "mem-2", name: "Ayush Gupta", color: "#3E7C74" },
  { id: "mem-3", name: "Rohan Mehta", color: "#E8A33D" },
];

export const seedBoards = [{ id: "board-1", name: "Forge Sprint Launch", createdAt: today }];

export const seedLists = [
  { id: "list-1", boardId: "board-1", name: "To Do", order: 0 },
  { id: "list-2", boardId: "board-1", name: "Doing", order: 1 },
  { id: "list-3", boardId: "board-1", name: "Done", order: 2 },
];

export const seedCards = [
  {
    id: "card-1",
    boardId: "board-1",
    listId: "list-1",
    title: "Wire Hermes to Slack #sprint-main",
    description: "Socket-mode app, bot scopes, verify auth.test round trip.",
    tagIds: ["tag-infra"],
    memberId: "mem-2",
    dueDate: today + 1 * DAY,
    order: 0,
    comments: [],
  },
  {
    id: "card-2",
    boardId: "board-1",
    listId: "list-1",
    title: "Design card modal states",
    description: "Empty, editing, overdue — all three need a pass.",
    tagIds: ["tag-design"],
    memberId: "mem-1",
    dueDate: today + 3 * DAY,
    order: 1,
    comments: [],
  },
  {
    id: "card-3",
    boardId: "board-1",
    listId: "list-2",
    title: "Fix drag handle on mobile",
    description: "Touch events not firing drop on iOS Safari.",
    tagIds: ["tag-bug", "tag-urgent"],
    memberId: "mem-3",
    dueDate: today - 1 * DAY,
    order: 0,
    comments: [],
  },
  {
    id: "card-4",
    boardId: "board-1",
    listId: "list-3",
    title: "Set up CI quality gate",
    description: "Backend + frontend tests block merge to main.",
    tagIds: ["tag-infra"],
    memberId: "mem-2",
    dueDate: today - 4 * DAY,
    order: 0,
    comments: [],
  },
];
