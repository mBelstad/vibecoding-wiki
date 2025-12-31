# Vibecoding Quickstart (for late vibe-coders)

> Mål: Få ting gjort raskt uten å lage mer rot.

## 1) Daglig rutine (10 min)
1. Oppdater `docs/Context-Pack.md` (kort!):
   - Hva funker / hva er ødelagt / ukas mål / do-not-repeat / verify-kommandoer
2. Alt du “oppdager” → backlog (ikke nye markdown-filer)
3. Hvis du prøver noe nytt: legg en **1-sides experiment note** i `docs/30-Experiments/`

---

## 2) Når du starter en oppgave (standard loop)
1) **Opus Thinking** → plan + verify + rollback  
2) **Agent** → implementasjon i små steg  
3) **QA** → minimum tests / smoke  
4) **Du** → review + merge  
5) Oppdater Context-Pack + backlog

---

## 3) Når du åpner en NY chat (alltid bruk dette)
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

## 4) Når åpner du ny chat?
Åpne ny chat når:
- du bytter feature/modul
- debugging er kaotisk (start Debugger)
- du skal rydde/duplikatjakt (Refactor Sheriff)
- du skal hardene/release (SRE/QA)

---

## 5) Project Rules (lim inn i Cursor Rules)
```text
- Minimal diffs. No unrelated refactors.
- No new dependencies without ADR approval.
- No secrets in repo.
- Every change must include: verify + rollback.
- Debugging: hypotheses + discriminating tests; no conclusions from 1 datapoint.
- Prototype code stays in /prototype. Production in /app.
- Don’t create new markdown files unless asked; update existing docs instead.
```

---

## 6) Agent Definition of Done (bruk på hver oppgave)
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

Hard stop (agent må spørre):
- slette/rename store moduler
- auth/secrets/infra
- nye dependencies
- store rewrites

---

## 7) Tre prompts du trenger 90% av tiden

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

### C) Stuck? Debugger før du koder
```text
ROLE: Debugger (thinking-only). Do NOT implement.
Rank 3–5 hypotheses + discriminating tests.
Require 2 independent datapoints before concluding.
Input: symptom + logs + Context-Pack + suspect paths.
```

---

## 8) Mikro-maler
### Experiment (1 side)
```md
Goal → What we tried → Evidence → Result → Conclusion (confidence %) → Next step → Do-not-repeat
```

### ADR (kort)
```md
Context → Decision → Options → Consequences → Verification
```
