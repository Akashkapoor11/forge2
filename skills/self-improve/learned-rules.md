# Learned Rules — Self-Improvement Skill

> Rules extracted from CI failures and rejected outputs during the sprint.
> Each rule is generalizable — not a one-off fix — and is read before the next
> related code-generation task.
>
> Format: `[timestamp | commit] RULE(category): description`

---

## [2026-07-04 14:15] environment
Rule: Always include `test: { globals: true, environment: 'jsdom' }` in `vite.config.js` when the project has React component tests. Missing this block causes Vitest to report "No test files found" on CI even when the test files exist. Also add `@testing-library/react` and `jsdom` to `devDependencies`.
Source commit: f8d3c01

---

## [2026-07-04 11:05] data-layer
Rule: Any logic that classifies a card's status (overdue, done, blocked) must key off the **list name** (case-insensitive regex like `/done/i`) rather than a hardcoded list ID or position index. Hardcoded IDs break immediately when the surprise dataset introduces a different board structure.
Source commit: b7e2a45

---

## [2026-07-04 10:58] api-shape
Rule: When building a localStorage data layer as a stand-in for a real API, each function must (1) return a Promise, (2) accept the same arguments the real REST endpoint would accept, and (3) have the real fetch() call commented in. This makes the "one-file change to real API" story literally demoable in 30 seconds.
Source commit: b7e2a45

---

## [2026-07-04 12:55] drag-and-drop
Rule: HTML5 drag-and-drop requires `e.preventDefault()` in both `onDragOver` and `onDrop` for the drop to register. Always set `e.dataTransfer.effectAllowed = 'move'` in `onDragStart` or Chrome shows a green copy cursor instead of move.
Source commit: c9d1f88

---

## [2026-07-04 13:00] test-coverage
Rule: The `isOverdue(card, list)` function must be tested with at minimum three cases: (1) past date + done list → false, (2) past date + non-done list → true, (3) null date → false. Missing case 1 is the most common omission and would fail a surprise dataset with a "Completed" list instead of "Done".
Source commit: c9d1f88
