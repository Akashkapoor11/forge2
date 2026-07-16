---
name: self-improve
description: >
  Fires whenever a CI run fails, a test fails, or the coding agent's output
  is rejected by a quality gate. Converts the failure into a durable rule
  so the same class of mistake is caught earlier next time.
---

# Self-Improvement Skill

When a failure is detected (failing test, CI red, rejected PR, error trace):

1. **Classify** the failure in one line: is it a logic bug, a missing edge
   case, a schema mismatch, a flaky test, or an environment issue?
2. **Extract a rule.** Write one short, generalizable rule that would have
   prevented this class of failure (not a fix for this one instance).
3. **Append the rule** to `skills/self-improve/learned-rules.md` under the
   matching category, with a timestamp and the commit hash it came from.
4. **Apply it forward.** Before the next code-generation task of a related
   type, read `learned-rules.md` and follow any rule that applies.
5. **Report it** using the status-report skill: mention the rule learned
   under "What I Did", not buried in a log.

## Why this matters for judging
This directly targets the "Self-Improvement" criterion (agents that learn
from errors / improve across iterations) and also protects the
"surprise dataset" tie-breaker — a system that has accumulated a few
generalized rules by 17:00 is more likely to survive an unfamiliar input
shape than one that was only ever tuned to the original brief.

## Anti-pattern to avoid
Do not just re-run the same fix silently. The rule must be written down
and be visible in the repo — an invisible improvement scores the same as
no improvement.
