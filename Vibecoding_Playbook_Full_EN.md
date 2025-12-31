# Vibecoding Playbook (Cursor + Opus/Sonnet) — Full Version

> Goal: Keep the speed of vibecoding, but make the project safe, predictable, and ship-ready.

## Contents
- [Principles](#principles)
- [Project Structure (minimal but strict)](#project-structure-minimal-but-strict)
- [Source of truth and governance documents](#source-of-truth-and-governance-documents)
- [Roles (you + AI)](#roles-you--ai)
- [Project Phases](#project-phases)
- [Non-negotiables vs negotiables](#non-negotiables-vs-negotiables)
- [Hygiene Routines](#hygiene-routines)
- [New Chat and Handoff](#new-chat-and-handoff)
- [Agent-mode Definition of Done](#agent-mode-definition-of-done)
- [Prompt Templates per Role](#prompt-templates-per-role)
- [Document Templates (ADR, experiment, runbooks)](#document-templates-adr-experiment-runbooks)
- [Debugging: anti-bombastic rules](#debugging-anti-bombastic-rules)

---

## Principles

### Efficient and safe = "control surfaces"
You want:
1. **One truth** about goals and decisions (brief + ADRs)
2. **Separation between prototype and production code**
3. **Automatic rails** (lint/test/CI) that catch errors early
4. **Measurable hypotheses** when debugging

### Things you should do yourself (without AI)
- **Prioritization / scope**
  - What is v1? What is v2? What gets cut?
- **Security/access control and "go/no-go"**
  - Secrets, auth, payment flows, exposed ports, compliance.
- **Final architecture decisions**
  - AI can suggest, but you make the decision and write the "decision record".
- **Critical debugging with "ground truth"**
  - When observations are few or contradictory: you control the measurements/logs.
- **Contract/acceptance criteria**
  - "What does done mean?" must be human-defined.

---

## Project Structure (minimal but strict)

**Root**
- `README.md` (1 screen: what, how to run, link to brief)
- `docs/`
  - `00-Project-Brief.md` *(source of truth)*
  - `01-NonNegotiables.md`
  - `02-Architecture.md` *(high-level + diagram)*
  - `03-ADRs/` *(short decisions)*
  - `10-Backlog.md` *(or issues)*
  - `20-Runbooks/` *(operations/errors, "what do I do when...")*
  - `30-Experiments/` *(spikes with clear "result/conclusion")*
  - `Context-Pack.md` *(AI entry point, always updated)*
- `prototype/` *(spikes, can be deleted)*
- `app/` *(production code)*
- `scripts/` *(tools, migration, hygiene)*
- `.cursor/` *(project rules / memories / prompts)*

**Important rule:**  
Markdown files should either be **governance documents** (brief/adr/runbook), or **results** (experiment report). Not "loose thoughts".

---

## Source of truth and governance documents

### `docs/00-Project-Brief.md` (always updated)
Contains:
- *What are we building?*
- *Who is the user?*
- *Non-negotiables* (requirements you don't negotiate)
- *Negotiables* (things that can be deprioritized/changed)
- *Definition of Done* for v1
- *Risks/assumptions* (and how they are validated)

### `docs/Context-Pack.md` (AI's fixed entry point)
Keep it short (max ~1–2 screens):

```md
# Context Pack (always current)

## Status now
- What works:
- What is broken:
- Biggest risk right now:

## Current goal (this week)
- Primary goal:
- Deadline / milestone:
- Definition of Done (v1 slice):

## Non-negotiables
- Security constraints:
- Performance constraints:
- UX constraints:

## Known failures / do-not-repeat
- Tried X → failed because Y (link to logs/PR/commit):
- Tried A → caused regression B (link):

## Key entry points
- Main modules:
- Config files:
- CI / scripts:
- Runbooks:

## How to verify quickly
- Commands:
- URLs:
- Expected outputs:
```

---

## Roles (you + AI)

### Human (you)
- Product Owner: scope, v1-v2, priority, acceptance criteria
- Tech Lead: architecture choices, standards, "no-go" on security
- QA Lead: test strategy + which flows must be protected

### AI roles (you call them explicitly in prompts)
1) **Staff Engineer (plan + ADR)**  
2) **Implementer (agent)**  
3) **Refactor Sheriff**  
4) **SRE/DevOps**  
5) **QA/Test Engineer**  
6) **Debugger (thinking-only)**

---

## Project Phases

### Phase 0: Rescue Mission (you are here now)
Goal: get overview, stabilize, stop the bleeding.
- Create `00-Project-Brief.md` (1–2 pages)
- Create `10-Backlog.md` and move "all mess" in as short items
- Mark everything with: `KEEP` / `DELETE` / `MAYBE` / `REPLACE`
- Create a "Freeze-list": things AI can't touch without explicit task (auth, billing, infra, ingest pipeline, etc.)

### Phase 1: Consolidation
Goal: one way to do things.
- Standards (naming, folder conventions, lint, format, types)
- ADRs for the 5 biggest choices (short)
- Move "proto" to `prototype/` or "prod" to `app/` with tests

### Phase 2: V1 Vertical Slices
Goal: complete user flows, not "many features".
- Top 3–5 critical flows
- For each flow:
  - Acceptance criteria (human)
  - Instrumentation/logging (SRE)
  - Implementation (agent)
  - Tests (QA)
  - Review (you)

### Phase 3: Hardening
Goal: withstands real use.
- Observability (metrics/logs/traces)
- Security (secrets, RBAC, rate limiting)
- Performance/regression tests for critical paths

### Phase 4: Release & Operations
Goal: shipping rhythm.
- Release notes
- Runbooks
- Bugfix lane

---

## Non-negotiables vs negotiables

### Non-negotiables (examples)
- No secrets in repo
- No feature without logging on critical path (when relevant)
- No major change without test for critical logic (when relevant)
- CI must be green before merge
- ADR for big choices (1 page)

### Negotiables (examples)
- UI polish
- Number of integrations in v1
- Advanced dashboards
- Auto-scaling / HA in v1

---

## Hygiene Routines

### Daily (10–20 min)
1) **Inbox-to-backlog** (not new markdown files)
2) **Journal / experiment note**
3) **Update Context-Pack**

### Weekly (60–90 min)
1) **Cleanup: KEEP/DELETE/MAYBE**
2) **Duplicate sweep**
3) **ADR-sprint (max 3)**

### Per feature / PR
- Acceptance criteria
- Which files are "source of truth"
- Which logs/metrics prove it works
- Which tests protect this
- Rollback plan

---

## New Chat and Handoff

### Open new chat when…
- Topic shifts (new feature/module)
- Chat has become "polluted"
- You need a new role (plan ↔ implement)
- Debugging is stuck
- Big cleanup / hardening

### Handoff package (copy/paste)
```text
Read docs/Context-Pack.md and docs/00-Project-Brief.md first.

Project state:
- Branch:
- Last known good commit/PR:
- Environment:

What we were doing:
- Goal:

What changed (paths):
- <path>: <what changed>

What is still broken / missing:
- Symptom:
  Evidence:
  Repro:

Known do-not-repeat:
- Tried X → failed because Y (link/log)
- Do NOT add dependencies or refactor broadly.

Task now:
- Next smallest step

Scope control:
- Allowed paths:
- Forbidden:

Non-negotiables:
- Minimal diffs, verify + rollback, no conclusions from single datapoint

Verification:
- Commands:
- Expected results:

Role: <Debugger / Staff Engineer / Implementer / Refactor Sheriff / QA / SRE>
```

---

## Agent-mode Definition of Done

```text
- Acceptance criteria met (explicitly mapped).
- Minimal diff: no unrelated refactors.
- Code builds/starts; lint/format passes.
- Tests: added/updated for critical logic OR reason given why not.
- Logging/metrics: added where it reduces future debugging cost (optional but preferred on critical paths).
- Docs updated if behavior/config changed.
- No secrets committed; configs use env vars/templates.
- Verification steps provided (exact commands + expected result).
- Rollback steps provided (what to revert / feature flag / config toggle).
- Remaining risks listed with mitigation and next action.
```

Hard stop (agent must ask):
- Delete/rename major modules
- Security implications (auth/secrets)
- New dependencies/infra
- Broad rewrites not explicitly requested

---

## Prompt Templates per Role

### Staff Engineer (Opus Thinking)
```text
ROLE: Staff Engineer (planning + architecture + risk)
MODE: Thinking-only. No implementation.

Use ONLY facts from the repo. If missing context, propose assumptions explicitly.

INPUT:
- Context-Pack: (paste)
- Task: <TASK>
- Constraints: <CONSTRAINTS>
- Files to consider: <PATHS>

OUTPUT:
1) Problem statement
2) 2–3 options (tradeoffs)
3) Recommendation
4) Step-by-step plan (small PR steps)
5) Verification plan
6) Rollback plan
7) ADR draft (short)
8) Stop & ask list
```

### Implementer (Agent)
```text
ROLE: Implementer (agent)
GOAL: Implement with minimal diff, safely.

Rules:
- No unrelated refactors.
- No new deps without ADR approval.
- Include verification and rollback.
- Update docs if behavior changes.

INPUT:
- Context-Pack
- Task
- Acceptance criteria
- Target files

DELIVERABLE:
1) Summary of changes
2) Commands to verify (+ expected result)
3) Rollback steps
4) New risks introduced
Stop and ask if: deletion/rename, security implication, deps, global refactor
```

### Refactor Sheriff
```text
ROLE: Refactor Sheriff
MODE: Conservative refactor. Safety first.

INPUT:
- Context-Pack
- Goal
- Scope limit: <PATHS ONLY>

OUTPUT:
1) Inventory: duplicates, dead code, unused files (paths)
2) KEEP/DELETE/MAYBE/REPLACE per item + reason
3) "Golden path" (which module survives)
4) Migration plan in 3–6 safe steps
5) Verification plan
6) Deletion policy: nothing deleted unless explicitly approved
```

### QA/Test Engineer
```text
ROLE: QA/Test Engineer
INPUT:
- Context-Pack
- Feature/flow
- Acceptance criteria
- Existing tests (paths)

OUTPUT:
1) Risk-based test matrix
2) Recommended automated tests (unit/integration/e2e) with file targets
3) Minimal smoke test checklist (manual)
4) Test data/fixtures needed
5) Regression traps (known failures)
```

### SRE/DevOps
```text
ROLE: SRE/DevOps Engineer
INPUT:
- Context-Pack
- Objective
- Environment
- Current tooling (paths)

OUTPUT:
1) Current gaps (CI, secrets, logs, metrics, alerts)
2) Minimal plan to add "rails" without slowing dev
3) Proposed dashboards/log queries (if relevant)
4) Verification checklist
5) Rollback plan
No new infra/paid services without explicit approval.
```

### Debugger (Thinking-only)
```text
ROLE: Debugger (root-cause)
MODE: Thinking-only. Do NOT implement changes yet.

INPUT:
- Symptom:
- Evidence:
- Context-Pack:
- Suspect files:

OUTPUT:
1) 3–5 hypotheses ranked (with confidence)
2) For each: what evidence would confirm/deny
3) The fastest discriminating tests (commands/log points)
4) Minimal fix plan once confirmed
Rule: do not conclude from a single datapoint; require 2 independent datapoints.
```

---

## Document Templates (ADR, experiment, runbooks)

### Experiment report
`docs/30-Experiments/YYYY-MM-DD-<topic>.md`
```md
# Experiment: <topic>
## Goal
## What we tried
## Evidence (links/logs)
## Result
## Conclusion (confidence %)
## Next step
## Do-not-repeat
```

### ADR
`docs/03-ADRs/ADR-000X-<name>.md`
```md
# ADR-000X: <decision>
## Context
## Decision
## Options considered
## Consequences
## Verification
```

### Runbook
`docs/20-Runbooks/<issue>.md`
```md
# Runbook: <issue>
## Symptoms
## Quick checks
## Likely causes
## Fix steps (safe order)
## Verification
## Rollback
## Notes / links
```

---

## Debugging: anti-bombastic rules
Use "observation requirements" in prompts:
- "List 3 possible explanations, rank them, and say which log/command will distinguish them."
- "Don't conclude before at least 2 independent datapoints."
- "If you suggest a change, include how we verify and how we roll back."
- "If unsure: hypotheses + test plan instead of large code changes."


