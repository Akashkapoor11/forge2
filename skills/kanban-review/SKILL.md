---
name: kanban-review
description: >
  Fires when the orchestrator reviews a completed coding task before marking it
  done. Checks that the code is dataset-agnostic (no hardcoded IDs, no position
  assumptions) so it survives the surprise dataset tie-breaker.
---

# Kanban Review Skill

When OpenClaw reports a task complete, before marking it done and assigning the next task:

1. **List-name check** — confirm any "done/completed" detection uses a case-insensitive regex on the list *name*, not a hardcoded list ID or position index.
2. **Entity-count agnostic** — confirm the code makes no assumptions about how many boards, lists, or cards exist. Should work with 1 board + 2 lists or 10 boards + 50 lists.
3. **API shape consistency** — confirm every localStorage function matches the shape of its REST counterpart (same argument names, same return keys).
4. **Test coverage** — confirm the isOverdue / overdue-flag logic has at least the three canonical test cases (past+done=false, past+active=true, null=false).
5. **No leaked tokens** — scan the diff for any string that looks like a real API key (xoxb-, xapp-, sk-, gsk_) before approving the push.

If any check fails, send the task back to OpenClaw with the specific finding. Do **not** skip this review under time pressure — it is the single most important quality gate for the surprise dataset.

## When this skill fires
- (implicit) any time OpenClaw posts "What I Did" and the task touches the data layer, overdue logic, or API routes
- (explicit) "review this" / "check this before merging"
