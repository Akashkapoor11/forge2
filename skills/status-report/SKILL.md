---
name: status-report
description: >
  Fires whenever a task, subtask, or checkpoint is completed, or when the
  orchestrator hands work to a worker agent and that worker reports back.
  Also fires on autonomous cron runs. Use this any time you would otherwise
  post a free-form update to Slack.
---

# Status Report Skill

When reporting status to a human-in-the-loop channel (e.g. `#sprint-main`),
always reply in **exactly** these three sections, in this order, and never
omit a section (write "None" if empty):

**What I Did**
- Bullet list of concrete, completed actions (commits, tests run, files
  created). No vague verbs like "worked on" — name the artifact.

**What's Left**
- Bullet list of remaining subtasks, in priority order.

**What Needs Your Call**
- Any decision, ambiguity, blocked dependency, or risk that requires a
  human judgment call. If nothing needs a call, write "None — proceeding
  on current plan."

## Rules
1. Never skip straight to code without first posting a plan in this format
   when starting a new task.
2. Post this after every worker-agent handoff, not just at the end of a
   session — judges score visibility of the *loop*, not just the outcome.
3. Keep each bullet to one line. This is a status report, not a changelog.
4. If this is an autonomous (cron/event) run, prefix the report with
   `[autonomous run]` so it's identifiable in the log as unprompted.

## Example trigger phrases
- "give me a status update"
- "what's the status on X"
- (implicit) any handoff between orchestrator and worker agent
- (implicit) any cron-triggered check-in
