# evidence/

This folder contains the screen recording walkthrough required by the qualifier handbook (§08).

## evidence/walkthrough.mp4

A 60–90 second screen recording demonstrating:

1. **Agent loop** (0:00–0:25): Slack open — showing `#sprint-main` with Hermes' plan, `#agent-coder` with OpenClaw's three-section report, and `#agent-log` with autonomous run messages.
2. **Live app** (0:25–0:55): The Kanban board at the live URL — creating a card, moving it between lists by drag-and-drop, setting a due date, adding a comment, showing the overdue flag on a card past its due date and not in "Done".
3. **Self-improve rule** (0:55–1:10): Showing `skills/self-improve/learned-rules.md` with the CI failure rule and its source commit.
4. **CI green** (1:10–1:20): GitHub Actions run showing all three jobs (backend-tests, frontend-tests, quality-gate) passing.

> **Note for Sprint day:** Record this with Loom, OBS, or Windows Game Bar (Win+G → Record), then commit the mp4 here. Keep it under 90 seconds — judges have 5 finalist demos to watch in 90 minutes.

## File naming

- `walkthrough.mp4` — primary recording (commit this)
- `walkthrough_compressed.mp4` — if the original is >50 MB, compress with: `ffmpeg -i walkthrough.mp4 -vcodec libx264 -crf 28 walkthrough_compressed.mp4`
