# Vanguard Sell & Rebalance — PD Phase Context
## For new Claude thread continuation

---

## PROJECT IDENTITY

- **Project:** Vanguard Sell & Rebalance — AI pipeline portfolio case study
- **Current phase:** PD (Product Design) — Step 8 COMPLETE. PD phase complete. Ready for Dev phase.
- **Primary goal:** Demonstrate a structured AI-assisted PM→PD→Dev pipeline
- **Notion workspace:** https://www.notion.so/Vanguard-Sell-Rebalance-Design-Process-365dcac9574a8187a8ced7d4e9408c3b

---

## KEY FILE REFERENCES

| File | Key / URL |
|---|---|
| DS file | `krtNgOD3jL5U6WmUMT32u6` |
| Screens file | `jz82GrOp8RE2QGh81V0qbs` |
| GitHub repo | `mcasey10/vanguard-ai-pipeline` |
| pd/CLAUDE.md | Committed, 287 lines, commit `8e59463` |
| Pipeline HTML | `ai_pipeline.html` (repo root — committed June 2026) |
| Workflow HTML | `pm/sell_rebalance_workflow.html` |
| Framer prototype | https://spiky-manager-267229.framer.app/ |
| ProtoPie prototype | https://cloud.protopie.io/p/8951614ea03c1c2b09b7c4b9 |
| Figma prototype | https://www.figma.com/proto/jz82GrOp8RE2QGh81V0qbs/Vanguard-Sell---Rebalance-%E2%80%94-Screens |

---

## NOTION PAGE IDs

| Page | ID |
|---|---|
| Design Process root | `365dcac9574a8187a8ced7d4e9408c3b` |
| PRD root | `33edcac9574a808da907cc9decefb512` |
| PDB root | `364dcac9574a81888568c04e9fcf423d` |
| PDB 01 — User flow | `364dcac9574a8190a725fffdc4bc5e2a` |
| PDB 04 — Screen inventory | `364dcac9574a81aca521c64f205958f3` |
| PDB 09 — PD decisions log | `340dcac9574a8141a170de6bc25d9750` |
| PRD 05 — Functional requirements | `33edcac9574a81c4b19ffcf6facc40b8` |
| PRD 10 — Sample dataset | `33fdcac9574a81d181c0f25bb665d8ad` |

---

## JIRA

- cloudId: `89da3bf5-61e1-4506-98ff-7cf28f3fa5f9`
- Project key: VSR
- Site: `michaelcasey-jira-site.atlassian.net`

---

## COMPLETED SCREENS — ALL STAGES

**NOTE: All frames now consolidated onto a single page (Stage 1 — Fund Selection) in the
Screens file. Stages 2–4 pages are empty. This was required to enable Figma prototype
cross-stage wiring via CC + Figma MCP.**

### Stage 1 page — all frames (confirmed node IDs post-consolidation)

| Frame | Description | Node ID | Status |
|---|---|---|---|
| FS-ENTRY-1 | Tool entry / sale amount input | 248:541 | ✅ |
| FS-AUTO-1 | Automated mode — default view | 249:272 | ✅ |
| FS-MAN-1 | Manual mode — inactive, no amounts | 250:369 | ✅ |
| FS-MAN-2 | Manual mode — amounts entered | 382:1501 | ✅ |
| FS-MAN-LOT | Manual mode — VTSAX SpecID expanded | 382:1866 | ✅ |
| FS-INT-SAVEDISCARD | Full-screen mode switch interrupt | 425:1885 | ✅ |
| FS-DEGRADE | Tax-only mode — no target allocation | 446:2153 | ✅ |
| FS-TXHIST | Transaction history (returning users) | 547:2428 | ✅ |
| NF-1 | Reset confirmation dialog | 572:3190 | ✅ |
| SC-1 | 2-scenario comparison | 628:24446 | ✅ |
| SC-1A | 1-scenario (Automated context) | 628:24765 | ✅ |
| SC-1B | 3-scenario comparison | 628:25404 | ✅ |
| SC-1M | 1-scenario (Manual context) | 628:25084 | ✅ |
| OC-1 | Order Confirmation | 628:26277 | ✅ |
| ES-1 | Execution Summary | 628:26531 | ✅ |
| NF-2 | Delete scenario confirmation | 628:25899 | ✅ |
| SaveDiscard modal | Auto-layout modal (Framer export only) | 595:7263 | ✅ (not wired in Figma prototype) |
| Cost Basis Dialog | Cost basis method selection overlay | 660:4200 (approx — Continue: 660:4241, Cancel: 660:4243, ×: 660:4203) | ✅ |
| Target Allocation Modal | Set target allocation overlay | 667:3618 | ✅ |

---

## PROTOTYPE WIRING STATUS (Track A — Figma)

**50 of 53 connections applied via CC + Figma MCP. Zero failures across all sessions.**

- Phase 1 (happy path): 8/8 ✅
- Phase 2 (branch paths): 20/20 ✅
- Phase 3 (interrupts/overlays): 9/9 ✅
- Cost Basis Dialog wiring: 5/5 ✅
- Target Allocation Modal wiring: 8/8 ✅
- Phase 4 (variant swaps): 0/8 — blocked by Figma Plugin API remote component restriction

Phase 4 variant swaps require manual application in Figma desktop UI (prototype mode →
select instance → add On click → Change to interaction). These are polish interactions
(input focus states, kebab open states) and are not required for the prototype to tell
its story.

**Key wiring decisions:**
- OC-1 Cancel → FS-AUTO-1 (safe common ancestor)
- FS-MAN-2 mode toggle → FS-INT-SAVEDISCARD (full frame navigate, not overlay)
- FS-INT-SAVEDISCARD "Save as scenario" (425:1999) → SC-1
- FS-INT-SAVEDISCARD "Discard and switch" (430:2185) → FS-AUTO-1
- SC-1B Scenario 3 kebab → NF-2 overlay → SC-1 (delete) / SC-1B (cancel)
- NF-2 title: "Delete scenario?" (generic, no scenario number)

---

## CANONICAL SAMPLE DATA

**Investor:** Margaret R. Ellison, age 73
**Portfolio total:** $849,851.40
**Tax rates:** 24% ST / 15% LT
**YTD realized (pre-sale):** ST $1,245 / LT $8,750
**Target allocation:** Stocks 55% / Bonds 35% / Reserves 10%
**RMD remaining:** $3,667.92 (Trad IRA ...2973)
**Reference date:** 2026-05-27

**Taxable Brokerage ...4782 — $507,194.40:**
- VTSAX: 1,597 sh · $231,884.40 · NAV $145.20 (7 LT lots + 2 ST lots)
- VTIAX: 3,600 sh · $139,500.00 · NAV $38.75 (T-VTIAX-07: ST Wait & Save, 14 days)
- VBIRX: 8,100 sh · $84,402.00 · NAV $10.42 (harvestable losses)
- VBTLX: 5,600 sh · $51,408.00 · NAV $9.18 (harvestable losses)

**Primary sale scenario (FS-MAN-LOT, OC-1, ES-1):**
- VTSAX: 103.306 sh T-VTSAX-09 SpecID (ST) → $15,000.03 · ST gain +$1,515.85 · EST.TAX $363.80
- VBTLX: 1,089.325 sh T-VBTLX-02 MinTax (LT loss) → $10,000.00 · LT loss -$1,056.65 · EST.TAX $0.00
- **EST. NET TAX: $110.21** · 0.44% effective rate
- Auto mode / FS-MAN-2 use round amounts: VTSAX $15,000.00, VBTLX $10,000.00

---

## CANONICAL BUTTON TERMINOLOGY

| Action | Label |
|---|---|
| Navigate to Order Confirmation | **"Review order"** |
| Save and navigate to Scenario Analysis | **"Go to Scenario Analysis"** |
| Restore automated recommendation values | **"Reset to system recommendation"** |
| Edit a scenario from SC-1 | **"Edit scenario →"** |

---

## KEY DESIGN DECISIONS (canonical — supersedes any earlier contradictions)

### Scenario Analysis (SC-1)
- **Read-only comparison view** — all scenarios created/edited in Fund Selection only
- Up to 3 scenarios; auto-labeled (Scenario 1/2/3); no user-editable names
- Fund table shows only active funds (sell amount > $0); all values static text
- Action buttons: "Edit scenario →" (secondary, 180px left) + "Review order" (primary, 180px right), space-between
- Tradeoff summary: system-generated plain-language sentence at bottom of each column
- Add scenario column: dashed placeholder, hidden when 3 scenarios exist
- Kebab menu: Delete scenario (red) + Duplicate scenario

### Wait & Save
- Suppressed entirely in Automated mode
- Lot-specific and comparative within a fund only

### SpecID cost basis
- Manual mode only; sell amount becomes read-only when selected

### EST. NET TAX
- Portfolio-level netting label in Summary Banner
- Per-fund EST. TAX remains gross (pre-netting)

### Impact color convention
- Green = sale moves toward 55% stock / 35% bond target
- Red = moves away; Black = no target (degraded mode)

### Reset to system recommendation
- Appears in Manual mode footer only, after deviation from automated values
- Lightweight confirmation dialog (separate from FS-INT-SAVEDISCARD mode-switch prompt)

---

## DS LIBRARY — KEY COMPONENT PROPERTIES

**Current count: 33 components across 4 pages (vs. 24 at PDB 06 baseline)**

**Details Row** (State=Collapsed|Expanded):
- `Show wait and save` (BOOLEAN, default true) — set false on Automated mode instances
- `Wait and save amount` (TEXT, default "$0.00") — set to "$37.03" for VTSAX

**Fund Row** (Mode=Automated|Active|Inactive):
- SpecID: Manual mode only; Sell amount read-only=true, Show details row=true
- Automated mode: Show wait and save=false on all Details Row instances

**Alert/Degraded Mode** — amber banner, "Set target allocation →" ghost link
**Modal/Target Allocation** — 3-segment editor (Stocks/Bonds/Reserves inputs + stacked bar)
**Summary Banner** — includes "Target allocation" ghost link in IMPACT column

---

## PENDING ITEMS FOR DEV PHASE

1. **Jira Figma frame URLs** — add Figma deep links to VSR story descriptions
2. **Phase 4 variant swaps** — 8 interactions (input focus, kebab open states) need
   manual application in Figma prototype mode — optional polish, not blocking Dev
3. **FS-TXHIST** — minor refinement may be needed before Dev handoff
4. **Cost Basis Dialog node ID** — confirm node ID after frame was built post-consolidation
5. **Cost Basis Dialog + Target Allocation Modal wiring** — ✅ COMPLETE. 13 connections
   applied, zero failures. All overlays use Go-back dismiss (no hardcoded return destinations).

---

## PROCESS LEARNINGS (accumulated — PD phase complete)

### Screen generation (Steps 2–7)
1. **CC vs manual Figma split:** CC effective for initial screen generation and bulk text
   updates; manual Figma finishing required for structural work and complex nested
   component architecture
2. **Fund Row component family:** Required full manual construction after multiple CC
   regressions — 6 levels of nesting with conditional visibility at each level
3. **Hidden Figma layers:** CC inspection reports include hidden layer content — human
   visual confirmation is authoritative
4. **Library update cycle:** Manual close-and-reopen of Screens file required after DS
   library publish before "accept library updates" appears
5. **Scenario Analysis iteration:** Went through 5+ major architectural revisions before
   settling on read-only model — resolve editing surface ambiguity before screen generation
6. **Calculation errors in long threads:** Always ground calculations in PRD Verification
   Tables, not thread memory

### Prototype wiring (Step 8)
7. **Figma cross-page prototype wiring:** Figma Plugin API enforces same-page-only
   NAVIGATE connections. All frames must be consolidated onto one page before CC wiring.
8. **Frame node IDs change on page move:** After cut/paste between pages, re-read the
   full frame inventory before applying connections — prior node IDs are stale.
9. **Cut/paste vs copy/paste:** Use cut (Cmd+X) not copy when moving frames between
   Figma pages to preserve DS library component references.
10. **Figma MCP multi-page reads unreliable:** Use per-page reads with explicit page IDs.
11. **Framer import requires auto-layout:** Components using absolute positioning in Figma
    import incorrectly into Framer — require manual reconstruction or pre-export rebuild
    with auto-layout in Figma.
12. **Framer AI ≠ prototype wiring AI:** Framer AI generates marketing websites from
    prompts — it does not automate interaction wiring. All prototype wiring in Framer
    is manual.
13. **ProtoPie free plan limitation:** 2-scene limit is per prototype in Studio (not
    cloud uploads as documented). AI features require Basic plan. Full evaluation
    requires paid subscription.
14. **ProtoPie auto-imports Figma prototype connections:** Existing Figma prototype
    connections transfer automatically on import — a viable workflow is complete Figma
    wiring first, then import to ProtoPie for conditional logic layer.
15. **Framer hotspot visualization gap:** No equivalent to Figma's "Show hotspots"
    feature — viewers must hunt for interactions by cursor movement.
16. **Framer viewport height quirk:** Viewport height locks to first page dimensions
    unless presenting full screen — shorter entry screens constrain taller content screens.
