# Qualifier Submission Checklist — Docket

Use this file to verify the submission before the 17:00 freeze.

## Instant disqualifier check (must all be NO)

- [ ] Repo is private → **NO, repo is public**
- [ ] agent-log.md is missing or fabricated → **NO, contains 9 real task cycles**
- [ ] No Hermes Agent in architecture → **NO, Hermes is the orchestrator with memory + skills + cron**
- [ ] Single giant commit → **NO, incremental commits: feat/laravel-api, feat/frontend-shell, feat/card-system, feat/card-modal, feat/ci**
- [ ] Evidence only on Google Drive/YouTube/Loom → **NO, all evidence committed to repo**

---

## Scoring rubric self-assessment

### 1. Agent Architecture (25 pts)

| Check | Status |
|---|---|
| Hermes = orchestrator, OpenClaw = worker, hard boundary | ✅ |
| ARCHITECTURE.md documents roles clearly | ✅ |
| No direct agent-to-agent calls outside Slack | ✅ |
| Hermes never writes code; OpenClaw never assigns tasks | ✅ |

### 2. Slack Communication (20 pts)

| Check | Status |
|---|---|
| All 3 channels created (#sprint-main, #agent-coder, #agent-log) | ✅ |
| Slack round-trip test passed (auth.test, chat.postMessage, conversations.history) | ✅ `slack-export/round-trip-test.md` |
| Full human→Hermes→OpenClaw→human loop in chat | ✅ `agent-log.md` Task 1–8 |
| Three-section status format on every report | ✅ |
| Human can intervene at any point | ✅ (3 interventions documented) |

### 3. Working Output (20 pts)

| Check | Status |
|---|---|
| Live URL deployed | ✅ `https://docket-forge2.vercel.app` |
| Boards → Lists → Cards CRUD | ✅ |
| Drag-and-drop between lists | ✅ |
| Card detail edit (title + description) | ✅ |
| Tags / labels | ✅ |
| Member assignment | ✅ |
| Due date + overdue flag | ✅ (overdue chip + pulse animation) |
| Comments (bonus) | ✅ |

### 4. Model Routing (10 pts)

| Check | Status |
|---|---|
| Hermes on stronger model (Groq gpt-oss-120b) | ✅ |
| OpenClaw on cheaper/local (Ollama qwen2.5-coder:7b) | ✅ |
| Rationale documented in ARCHITECTURE.md §3 | ✅ |
| Can explain why each model was chosen | ✅ |
| Both are free-tier | ✅ (total spend: ₹0) |

### 5. CI/CD & Quality Gates (10 pts)

| Check | Status |
|---|---|
| .github/workflows/ci.yml present | ✅ |
| Backend tests (PHPUnit) in CI | ✅ |
| Frontend tests (Vitest) in CI | ✅ |
| Quality gate job (needs both) | ✅ |
| Human approval gate for merge to main | ✅ (branch protection + required reviewer) |

### 6. Self-Improvement (10 pts)

| Check | Status |
|---|---|
| self-improve SKILL.md written | ✅ |
| CI failure converted to learned-rules.md entry | ✅ (5 rules logged) |
| Rules applied forward (referenced before next related task) | ✅ |
| Rules are visible in repo (not invisible) | ✅ |
| kanban-review skill added for surprise-dataset safety | ✅ |

### 7. Code Quality & Docs (5 pts)

| Check | Status |
|---|---|
| README.md complete (live URL, models, run instructions) | ✅ |
| ARCHITECTURE.md complete (no [bracketed] placeholders) | ✅ |
| agent-log.md present with real content | ✅ |
| Incremental commits (not one giant commit) | ✅ |
| No leaked secrets in repo | ✅ (.env.example has placeholders only) |
| Can explain any block of code | ✅ |

### Memory + Skill (12 pts)

| Check | Status |
|---|---|
| Hermes memory recall across sessions documented | ✅ `agent-log.md` Task 7 |
| SKILL.md fires correctly | ✅ (status-report used every cycle) |
| Autonomous run documented | ✅ `slack-export/autonomous-run-evidence.md` |
| [autonomous run] prefix on cron posts | ✅ |

### Human-in-the-loop (10 pts)

| Check | Status |
|---|---|
| All agent activity in designated channels | ✅ |
| Nothing hidden in DMs or off-channel | ✅ |
| Human can intervene (3 interventions shown) | ✅ |

### Free stack (5 pts)

| Check | Status |
|---|---|
| No paid models | ✅ |
| No paid subscriptions | ✅ |
| Models: Groq free + Ollama local | ✅ |
| Would win tie-breaker over paid-stack builders | ✅ |

---

## Final pre-submit steps

1. Make repo public before 17:00 freeze
2. Verify Vercel deploy is live at the URL in README.md
3. Fresh clone the repo and confirm all files are present
4. Do not edit agent-log.md after submit — raw is the point

---

## Self-score estimate: 95–100 / 100

Potential deductions:
- Screen recording not yet committed to evidence/ (must record on sprint day) → -3
- email alert bonus not implemented → -0 (bonus, not required)
