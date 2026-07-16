# Docket - Forge 2 

A tiny Trello-style Kanban board (Laravel REST API + React/Vite UI), built end-to-end by a two-agent team:

- **Hermes** (`openai/gpt-oss-120b` on Groq) — orchestrator / "brain" / Product Owner
- **OpenClaw** (`qwen2.5-coder:7b` on Ollama local) — coding agent / "hands"
- **Slack** — the only communication channel between agents and human

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for agent roles, Slack channel scheme, model routing rationale, memory details, and the CI/CD pipeline.

---

# Live URL: 
https://forge2-sooty.vercel.app

<img width="1905" height="967" alt="Image" src="https://github.com/user-attachments/assets/ec682eb6-6c35-4e69-af1f-5d734af4a46b" />

<img width="1902" height="1018" alt="Image" src="https://github.com/user-attachments/assets/81b6ea40-e76f-4f86-8e1f-24d37da9276a" />

<img width="1917" height="1026" alt="Image" src="https://github.com/user-attachments/assets/1093dddd-0d68-460b-a48e-ff5822724216" />

<img width="1919" height="1018" alt="Image" src="https://github.com/user-attachments/assets/3fc55869-1b0f-4984-915d-4447cc99be96" />

> Frontend deploys to Vercel automatically on every push to `main`. The app ships with a seeded localStorage database so you can demo it immediately — no backend setup required.

---

## What works

- [x] **Boards → Lists → Cards** with HTML5 drag-and-drop between lists
- [x] **Card details** — title + description, editable inline via modal
- [x] **Tags / labels** — coloured pills, create your own, toggle per card
- [x] **Member assignment** — add people to a board, assign one per card
- [x] **Due date** — set a due date; cards past due (and not in a "Done" list) get an ⚠ overdue flag
- [x] **Comments** — add card comments with author + timestamp; keyboard-friendly (Enter to submit)
- [x] **Rename lists** — click the list title to edit inline
- [x] **CI/CD** — backend (PHPUnit) + frontend (Vitest + Vite build) green on every push; quality-gate blocks merge to `main`

---

## Models used and why

| Agent | Model | Provider | Rationale |
|---|---|---|---|
| Hermes (planning) | `openai/gpt-oss-120b` | Groq (free) | Low-volume, high-reasoning. Called ~9 times. Stronger model → better task decomposition and no ambiguity in specs handed to OpenClaw. |
| OpenClaw (execution) | `qwen2.5-coder:7b` | Ollama (local, free) | High-volume (~40 iterations). Local = zero API cost, zero rate limits, unlimited throughput. Quality indistinguishable from a cloud model on well-scoped tasks. |

**Total API spend: ₹0.** All Groq calls are within the free tier; all OpenClaw calls are local.

---

## Run it locally

### Frontend (works standalone — no backend required)

```bash
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173`. Data persists to `localStorage` and ships pre-seeded with a demo board — demoable immediately with zero setup.

> To point at the real API: set `VITE_API_BASE_URL=http://localhost:8000/api` in `frontend/.env`, then swap each function body in `frontend/src/data/api.js` to its commented-out `fetch()` equivalent. Every route shape already matches.

### Backend (optional)

```bash
# 1. Start from a fresh Laravel install:
composer create-project laravel/laravel backend-install
cp backend/app backend-install/app -r
cp backend/database backend-install/database -r
cp backend/routes backend-install/routes -r
cp backend/tests backend-install/tests -r
cp backend/.env.example backend-install/.env
cd backend-install
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve   # http://localhost:8000
```

> The scaffold is hand-written (build environment can't reach packagist.org) and drops into a fresh `composer create-project laravel/laravel`.

### Tests

```bash
# Frontend (Vitest — overdue-flag logic)
cd frontend && npm test

# Backend (PHPUnit — full Kanban flow + overdue rule)
cd backend && php artisan test
```

---

## Repo map

| Path | Contents |
|---|---|
| `frontend/` | React (Vite) UI — see `src/data/api.js` header for backend-swap instructions |
| `backend/` | Laravel API scaffold — migrations, models, controllers, routes |
| `skills/` | Hermes `SKILL.md` files: `status-report`, `self-improve`, `kanban-review` |
| `skills/self-improve/learned-rules.md` | Rules accumulated from CI failures during the sprint |
| `.github/workflows/ci.yml` | CI: backend PHPUnit + frontend Vitest + build + quality-gate |
| `agent-log.md` | Unedited Hermes/OpenClaw Slack chat log — 9 full task cycles |
| `slack-export/` | Slack round-trip test outputs + autonomous-run screenshot proof |
| `evidence/` | Walkthrough screen recording |
| `ARCHITECTURE.md` | Agent roles, channel scheme, routing, memory, CI, surprise-dataset strategy |
| `openclaw.json` | OpenClaw gateway config (secrets stripped) |

---

## Design

Cards render as tear-off ticket stubs — a mono ID/date strip separated from the card body by a dashed perforation with notch cut-outs on either edge — on a dark control-room canvas. Typography: Space Grotesk (display), Inter (body), JetBrains Mono (IDs/dates/tags).

---

## Agent loop summary

```
Human (#sprint-main) → Hermes plans → Hermes assigns (#agent-coder)
→ OpenClaw codes + tests → reports "What I Did / What's Left / What Needs Your Call"
→ Human approves → Hermes picks next task
```

9 complete task cycles documented in `agent-log.md`. 3 human interventions. 2 autonomous cron runs in `#agent-log` with no human prompt. Memory recalled across sessions. Self-improve skill converted one CI failure into a durable rule in `learned-rules.md`.
