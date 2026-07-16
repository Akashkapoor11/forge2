# Evidence - Forge 2 

## Contents
<img width="1905" height="967" alt="Image" src="https://github.com/user-attachments/assets/ec682eb6-6c35-4e69-af1f-5d734af4a46b" />
<img width="1902" height="1018" alt="Image" src="https://github.com/user-attachments/assets/81b6ea40-e76f-4f86-8e1f-24d37da9276a" />
<img width="1917" height="1026" alt="Image" src="https://github.com/user-attachments/assets/1093dddd-0d68-460b-a48e-ff5822724216" />
<img width="1919" height="1018" alt="Image" src="https://github.com/user-attachments/assets/3fc55869-1b0f-4984-915d-4447cc99be96" />

| File | Description |
|---|---|
| `hermes-session-1.png` | Hermes startup — model switched to NVIDIA Nemotron 550B, first message & response |
| `hermes-session-2.png` | Hermes tool calls — git log, browser navigate to GitHub, 15+ browser clicks |
| `hermes-session-3.png` | Hermes planning — search_files, find, read kanban.py, read kanban_db.py, git remote |
| `hermes-session-4.png` | Final tool calls — browser navigate × 3, snapshots, rate limit hit after 47+ calls |
| `hermes-session.txt`   | Full terminal transcript — all tool calls with timestamps |

<img width="1554" height="952" alt="Image" src="https://github.com/user-attachments/assets/7d52cbb4-d2c7-48b5-adbf-ad086cd6366d" />
<img width="1919" height="957" alt="Image" src="https://github.com/user-attachments/assets/9cd3d6f0-cfc0-46dd-8233-6da69f419115" />
---

## Key Evidence Points

- **Real Hermes session ID:** `20260716_170413_21ea50`
- **Model used:** `nvidia/nemotron-3-ultra-550b-a55b:free` via OpenRouter (free tier)
- **Tool calls made:** 47+ (ls, find, git log, git branch, read_file, browser_navigate, browser_click, browser_snapshot)
- **Files read autonomously:** `kanban.py`, `kanban_db.py`
- **GitHub repos browsed:** `Akashkapoor11/forge2` — backend/, frontend/ structure reviewed
- **Context used:** 69.5K / 1M tokens
- **Session duration:** 13+ minutes active
