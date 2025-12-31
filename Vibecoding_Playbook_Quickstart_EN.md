# Vibecoding Quickstart (for late vibe-coders)

> Goal: Get things done quickly without creating more mess.

## 1) Daily routine (10 min)
1. Update `docs/Context-Pack.md` (short!):
   - What works / what's broken / this week's goal / do-not-repeat / verify commands
2. Everything you "discover" → backlog (not new markdown files)
3. If you try something new: add a **1-page experiment note** in `docs/30-Experiments/`

---

## 2) When you start a task (standard loop)
1) **Opus Thinking** → plan + verify + rollback  
2) **Agent** → implementation in small steps  
3) **QA** → minimum tests / smoke  
4) **You** → review + merge  
5) Update Context-Pack + backlog

---

## 3) When you open a NEW chat (always use this)
```text
Read Context-Pack + Brief first.

Previous chat summary:
- Goal:
- What changed (paths):
- Still broken (symptom + evidence + repro):
- Do-not-repeat:

Task now (next smallest step):
- ...

Scope:
- Allowed: <paths>
- Forbidden: auth/billing/secrets/infra/global refactor/deps

Verification:
- Commands:
- Expected result:

Role: <Debugger / Staff Engineer / Implementer>
```

---

## 4) When do you open a new chat?
Open new chat when:
- you switch feature/module
- debugging is chaotic (start Debugger)
- you're going to clean/duplicate hunt (Refactor Sheriff)
- you're going to harden/release (SRE/QA)

---

## 5) Project Rules (paste into Cursor Rules)
```text
- Minimal diffs. No unrelated refactors.
- No new dependencies without ADR approval.
- No secrets in repo.
- Every change must include: verify + rollback.
- Debugging: hypotheses + discriminating tests; no conclusions from 1 datapoint.
- Prototype code stays in /prototype. Production in /app.
- Don't create new markdown files unless asked; update existing docs instead.
```

---

## 6) Agent Definition of Done (use on each task)
```text
- Acceptance criteria met.
- Minimal diff.
- Builds/starts; lint/format ok.
- Tests added/updated OR reason why not.
- Verify steps + expected output.
- Rollback steps.
- No secrets.
- Docs updated if behavior/config changed.
```

Hard stop (agent must ask):
- delete/rename large modules
- auth/secrets/infra
- new dependencies
- large rewrites

---

## 7) Three prompts you need 90% of the time

### A) Plan (Opus Thinking)
```text
ROLE: Staff Engineer (thinking-only). No implementation.
Use only repo facts.
Output: options + recommendation + step plan + verify + rollback + ADR draft.
Input: Context-Pack + Task + Constraints + Paths.
```

### B) Implement (Agent)
```text
ROLE: Implementer (agent).
Minimal diff. No new deps. Include verify + rollback. Add tests for critical logic.
Input: Context-Pack + Task + Acceptance criteria + Target paths.
```

### C) Stuck? Debugger before you code
```text
ROLE: Debugger (thinking-only). Do NOT implement.
Rank 3–5 hypotheses + discriminating tests.
Require 2 independent datapoints before concluding.
Input: symptom + logs + Context-Pack + suspect paths.
```

---

## 8) Micro-templates
### Experiment (1 page)
```md
Goal → What we tried → Evidence → Result → Conclusion (confidence %) → Next step → Do-not-repeat
```

### ADR (short)
```md
Context → Decision → Options → Consequences → Verification
```

