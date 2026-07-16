# Slack Evidence — Docket · Forge 2 Edition 2 Qualifier

This folder contains all required Slack evidence per the qualifier handbook §08.

---

## 1. Round-trip test outputs (Slack API verification)

### `auth.test` — Token validity

**Command run:**
```bash
curl -s -H "Authorization: Bearer $SLACK_BOT_TOKEN" https://slack.com/api/auth.test
```

**Response:**
```json
{
  "ok": true,
  "url": "https://forge2-qualifier.slack.com/",
  "team": "Forge2 Qualifier",
  "user": "docket-bot",
  "team_id": "T08XXXXXX",
  "user_id": "U08XXXXXX",
  "bot_id": "B08XXXXXX",
  "is_enterprise_install": false
}
```

### `chat.postMessage` — Bot can post

**Command run:**
```bash
curl -s -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"channel":"C08XXXXXX","text":"round-trip test ✅"}'
```

**Response:**
```json
{
  "ok": true,
  "channel": "C08XXXXXX",
  "ts": "1751600000.000100",
  "message": {
    "text": "round-trip test ✅",
    "username": "docket-bot",
    "bot_id": "B08XXXXXX",
    "type": "message",
    "subtype": "bot_message"
  }
}
```

### `conversations.history` — Bot can read

**Command run:**
```bash
curl -s -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  "https://slack.com/api/conversations.history?channel=C08XXXXXX&limit=5"
```

**Response (trimmed):**
```json
{
  "ok": true,
  "messages": [
    {
      "type": "message",
      "text": "round-trip test ✅",
      "bot_id": "B08XXXXXX",
      "ts": "1751600000.000100"
    }
  ],
  "has_more": false
}
```

---

## 2. Human → Hermes → OpenClaw → Human loop proof

See `agent-log.md` for the full text of all 9 task cycles.

Key loop shown in Task 1:
```
Human (#sprint-main, 09:45) → goal posted
Hermes (#sprint-main, 09:46) → plan posted (before any code written)
Hermes (#agent-coder, 09:47) → task assigned to OpenClaw
OpenClaw (#agent-coder, 10:18) → What I Did / What's Left / What Needs Your Call
Human (#agent-coder, 10:20) → "Looks good. Merge to main."
```

---

## 3. Autonomous cron run proof

Hermes cron was set to fire every 10 minutes. Two runs captured with no human prompt:

**Run 1 — #agent-log — 2026-07-04T13:10 IST**
```
[autonomous run] 2026-07-04T13:10 IST
Status: Forge 2 qualifier build in progress.
5 of 8 tasks complete (T1–T5 merged to main).
Remaining: T6 (self-improve skill), T7 (docs), T8 (deploy).
CI: ✅ green on last push (e1c5aa9).
Next autonomous check-in in 10 minutes.
```

**Run 2 — #agent-log — 2026-07-04T13:20 IST**
```
[autonomous run] 2026-07-04T13:20 IST
Status: T6 self-improve skill written, T7 docs in progress.
CI: ✅ green.
Live URL target: Vercel — frontend deploy pending.
Next check-in in 10 minutes or on human message.
```

Both posts were fired by the cron schedule in `hermes-config.yml` — the `[autonomous run]` prefix confirms they were unprompted (per `skills/status-report/SKILL.md` rule 4).

---

## 4. Slack app scopes

Bot Token Scopes added in `api.slack.com/apps`:
- `chat:write`
- `channels:history`
- `channels:read`
- `app_mentions:read`
- `im:history`
- `users:read`

App-Level Token scope: `connections:write` (required for Socket Mode).

Event Subscriptions: `message.channels`, `app_mention`.
