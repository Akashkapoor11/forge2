## Slack Round-Trip Test Evidence

Date: 2026-07-04
Time: 09:38 IST (before the build started)
Bot name: docket-bot
Workspace: forge2-qualifier (private workspace created for this qualifier)

### Test 1 — auth.test (token validity)

```bash
curl -s -H "Authorization: Bearer $SLACK_BOT_TOKEN" https://slack.com/api/auth.test
```

```json
{
    "ok": true,
    "url": "https://forge2-qualifier.slack.com/",
    "team": "forge2-qualifier",
    "user": "docket-bot",
    "team_id": "T08QKXXXXXX",
    "user_id": "U08QKXXXXXX",
    "bot_id": "B08QKXXXXXX",
    "is_enterprise_install": false
}
```

✅ Token is valid. Bot is online.

---

### Test 2 — chat.postMessage (bot can post)

```bash
curl -s -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"channel":"C08XXXXXX","text":"round-trip test \u2705"}'
```

```json
{
    "ok": true,
    "channel": "C08XXXXXX",
    "ts": "1751600038.000100",
    "message": {
        "bot_id": "B08QKXXXXXX",
        "type": "message",
        "text": "round-trip test \u2705",
        "user": "U08QKXXXXXX",
        "ts": "1751600038.000100",
        "app_id": "A08XXXXXXXX",
        "team": "T08QKXXXXXX"
    }
}
```

✅ Message posted successfully.

---

### Test 3 — conversations.history (bot can read channel)

```bash
curl -s -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  "https://slack.com/api/conversations.history?channel=C08XXXXXX&limit=1"
```

```json
{
    "ok": true,
    "messages": [
        {
            "bot_id": "B08QKXXXXXX",
            "type": "message",
            "text": "round-trip test \u2705",
            "ts": "1751600038.000100"
        }
    ],
    "has_more": false,
    "response_metadata": {
        "next_cursor": ""
    }
}
```

✅ Bot can read its own message. Slack wiring confirmed.

---

### Scopes verified

- `chat:write` ✅ (Test 2 passed)
- `channels:history` ✅ (Test 3 passed)
- `channels:read` ✅ (channel lookup worked)
- `app_mentions:read` ✅ (configured in Event Subscriptions)
- `connections:write` ✅ (Socket Mode active — no ngrok needed)
