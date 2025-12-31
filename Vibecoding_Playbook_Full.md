# Vibecoding Playbook (Cursor + Opus/Sonnet) — Fullversjon

> Mål: Behold farten fra vibecoding, men gjør prosjektet trygt, forutsigbart og ship-ready.

## Innhold
- [Prinsipper](#prinsipper)
- [Prosjektstruktur (minimal men hard)](#prosjektstruktur-minimal-men-hard)
- [Source of truth og styringsdokumenter](#source-of-truth-og-styringsdokumenter)
- [Roller (deg + AI)](#roller-deg--ai)
- [Faser i prosjektet](#faser-i-prosjektet)
- [Non-negotiables vs negotiables](#non-negotiables-vs-negotiables)
- [Hygiene-rutiner](#hygiene-rutiner)
- [Ny chat og handoff](#ny-chat-og-handoff)
- [Agent-mode Definition of Done](#agent-mode-definition-of-done)
- [Prompt-maler per rolle](#prompt-maler-per-rolle)
- [Dokumentmaler (ADR, experiment, runbooks)](#dokumentmaler-adr-experiment-runbooks)
- [Debugging: anti-bombastiske regler](#debugging-anti-bombastiske-regler)

---

## Prinsipper

### Effektivt og trygt = “kontrollflater”
Du vil ha:
1. **Én sannhet** om mål og beslutninger (brief + ADRs)
2. **Skille mellom prototype og produktkode**
3. **Automatiske rails** (lint/test/CI) som fanger feil tidlig
4. **Målbare hypoteser** når du feilsøker

### Ting du bør gjøre selv (uten AI)
- **Prioritering / scope**
  - Hva er v1? Hva er v2? Hva kuttes?
- **Sikkerhet/tilgangsstyring og “go/no-go”**
  - Secrets, auth, betalingsløp, eksponerte porter, compliance.
- **Endelig arkitekturavgjørelser**
  - AI kan foreslå, men du tar beslutningen og skriver “decision record”.
- **Kritisk debugging med “ground truth”**
  - Når observasjonene er få eller motstridende: du styrer målingene/loggene.
- **Kontrakt/akseptkriterier**
  - “Hva betyr ferdig?” må være menneskelig definert.

---

## Prosjektstruktur (minimal men hard)

**Root**
- `README.md` (1 skjerm: hva, hvordan kjøre, link til brief)
- `docs/`
  - `00-Project-Brief.md` *(source of truth)*
  - `01-NonNegotiables.md`
  - `02-Architecture.md` *(høy-nivå + diagram)*
  - `03-ADRs/` *(korte beslutninger)*
  - `10-Backlog.md` *(eller issues)*
  - `20-Runbooks/` *(drift/feil, “hva gjør jeg når…”)`
  - `30-Experiments/` *(spikes med tydelig “resultat/konklusjon”)`
  - `Context-Pack.md` *(AI inngang, alltid oppdatert)*
- `prototype/` *(spikes, kan slettes)*
- `app/` *(produksjonskode)*
- `scripts/` *(verktøy, migrering, hygiene)*
- `.cursor/` *(project rules / memories / prompts)*

**Viktig regel:**  
Markdown-filer skal enten være **styringsdokument** (brief/adr/runbook), eller **resultat** (experiment report). Ikke “løse tanker”.

---

## Source of truth og styringsdokumenter

### `docs/00-Project-Brief.md` (alltid oppdatert)
Inneholder:
- *Hva bygger vi?*
- *Hvem er brukeren?*
- *Non-negotiables* (krav du ikke forhandler om)
- *Negotiables* (ting som kan nedprioriteres/endres)
- *Definition of Done* for v1
- *Risikoer/antagelser* (og hvordan de valideres)

### `docs/Context-Pack.md` (AI sin faste inngang)
Hold den kort (maks ~1–2 skjermer):

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

## Roller (deg + AI)

### Menneske (deg)
- Product Owner: scope, v1-v2, prioritet, akseptkriterier
- Tech Lead: arkitekturvalg, standarder, “no-go” på sikkerhet
- QA Lead: teststrategi + hvilke flows som må beskyttes

### AI-roller (du kaller dem eksplisitt i prompts)
1) **Staff Engineer (plan + ADR)**  
2) **Implementer (agent)**  
3) **Refactor Sheriff**  
4) **SRE/DevOps**  
5) **QA/Test Engineer**  
6) **Debugger (thinking-only)**  

---

## Faser i prosjektet

### Fase 0: Redningsaksjon (du er her nå)
Mål: få oversikt, stabilisere, stoppe blødningen.
- Lag `00-Project-Brief.md` (1–2 sider)
- Lag `10-Backlog.md` og flytt “alt rot” inn som korte items
- Marker alt med: `KEEP` / `DELETE` / `MAYBE` / `REPLACE`
- Lag en “Freeze-list”: ting AI ikke får røre uten eksplisitt oppgave (auth, billing, infra, ingest pipeline, osv.)

### Fase 1: Konsolidering
Mål: én måte å gjøre ting på.
- Standarder (naming, folder conventions, lint, format, types)
- ADRs for de 5 største valgene (kort)
- Flytt “proto” til `prototype/` eller “prod” til `app/` med tester

### Fase 2: V1 Vertical Slices
Mål: ferdige brukerflyter, ikke “mange features”.
- Topp 3–5 kritiske flows
- For hver flow:
  - Akseptkriterier (menneske)
  - Instrumentering/logging (SRE)
  - Implementasjon (agent)
  - Tester (QA)
  - Review (deg)

### Fase 3: Hardening
Mål: tåler ekte bruk.
- Observability (metrics/logs/traces)
- Sikkerhet (secrets, RBAC, rate limiting)
- Performance/regresjonstester for kritiske paths

### Fase 4: Release & Drift
Mål: shipping-rytme.
- Release notes
- Runbooks
- Bugfix lane

---

## Non-negotiables vs negotiables

### Non-negotiables (eksempler)
- Ingen secrets i repo
- Ingen feature uten logging på kritisk path (når relevant)
- Ingen større endring uten test for kritisk logikk (når relevant)
- CI må være grønn før merge
- ADR for store valg (1 side)

### Negotiables (eksempler)
- UI polish
- Antall integrasjoner i v1
- Avanserte dashboards
- Auto-scaling / HA i v1

---

## Hygiene-rutiner

### Daglig (10–20 min)
1) **Inbox-to-backlog** (ikke nye markdown-filer)
2) **Journal / experiment note**
3) **Oppdater Context-Pack**

### Ukentlig (60–90 min)
1) **Rydding: KEEP/DELETE/MAYBE**
2) **Duplicate sweep**
3) **ADR-sprint (maks 3)**

### Per feature / PR
- Akseptkriterier
- Hvilke filer er “source of truth”
- Hvilke logger/metrics beviser at det funker
- Hvilke tester beskytter dette
- Rollback-plan

---

## Ny chat og handoff

### Åpne ny chat når…
- Tema skifter (ny feature/modul)
- Chatten er blitt “forurenset”
- Du trenger en ny rolle (plan ↔ implement)
- Debugging er stuck
- Stor rydding / hardening

### Handoff-pakke (copy/paste)
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

## Prompt-maler per rolle

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
3) “Golden path” (which module survives)
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
2) Minimal plan to add “rails” without slowing dev
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

## Dokumentmaler (ADR, experiment, runbooks)

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

## Debugging: anti-bombastiske regler
Bruk “observasjonskrav” i prompts:
- “List 3 mulige forklaringer, ranger dem, og si hvilken logg/kommando vil skille dem.”
- “Ikke konkluder før minst 2 uavhengige datapunkter.”
- “Hvis du foreslår endring, inkluder hvordan vi verifiserer og hvordan vi ruller tilbake.”
- “Hvis usikker: hypoteser + testplan i stedet for store kodeendringer.”
