# Evidence — Forge 2 · Edition 2 Qualifier

**Builder:** Akash Kapoor  
**Repo:** https://github.com/Akashkapoor11/forge2  
**Live URL:** https://forge2-sooty.vercel.app/  
**Date:** 2026-07-16

---

## Contents

| File | Description |
|---|---|
| `hermes-session-1.png` | Hermes startup — model switched to NVIDIA Nemotron 550B, first message & response |
| `hermes-session-2.png` | Hermes tool calls — git log, browser navigate to GitHub, 15+ browser clicks |
| `hermes-session-3.png` | Hermes planning — search_files, find, read kanban.py, read kanban_db.py, git remote |
| `hermes-session-4.png` | Final tool calls — browser navigate × 3, snapshots, rate limit hit after 47+ calls |
| `hermes-session.txt`   | Full terminal transcript — all tool calls with timestamps |

---

## Key Evidence Points

- **Real Hermes session ID:** `20260716_170413_21ea50`
- **Model used:** `nvidia/nemotron-3-ultra-550b-a55b:free` via OpenRouter (free tier)
- **Tool calls made:** 47+ (ls, find, git log, git branch, read_file, browser_navigate, browser_click, browser_snapshot)
- **Files read autonomously:** `kanban.py`, `kanban_db.py`
- **GitHub repos browsed:** `Akashkapoor11/forge2` — backend/, frontend/ structure reviewed
- **Context used:** 69.5K / 1M tokens
- **Session duration:** 13+ minutes active
