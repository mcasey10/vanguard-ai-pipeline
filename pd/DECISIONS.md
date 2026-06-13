# Vanguard Sell & Rebalance — PD Phase Context
## For new Claude thread continuation

---

## PROJECT IDENTITY

- **Project:** Vanguard Sell & Rebalance — AI pipeline portfolio case study
- **Current phase:** PD (Product Design) — Step 8: Interaction wiring + micro-interactions
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
| Pipeline HTML | `pm/ai_pipeline.html` (renamed from v3) |
| Workflow HTML | `pm/sell_rebalance_workflow.html` |

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

### Stage 1 — Fund Selection (page "Stage 1 — Fund Selection")
| Frame | Description | Status |
|---|---|---|
| FS-ENTRY-1 | Tool entry / sale amount input | ✅ |
| FS-AUTO-1 | Automated mode — default view | ✅ |
| FS-MAN-1 | Manual mode — inactive carry-over from Auto | ✅ |
| FS-MAN-2 | Manual mode — amounts entered | ✅ |
| FS-MAN-LOT | Manual mode — VTSAX SpecID expanded | ✅ |
| FS-INT-SAVEDISCARD | Modal overlay — switch to Automated prompt | ✅ |
| FS-DEGRADE | Tax-only mode — no target allocation | ✅ |
| FS-TXHIST | Transaction history (returning users) | ✅ frame id 547:2428 |

### Stage 2 — Scenario Analysis (page "Stage 2 — Scenario Analysis")
| Frame | Description | Status |
|---|---|---|
| SC-1 | 2-scenario comparison | ✅ |
| SC-1B | 3-scenario comparison | ✅ |

### Stage 3 — Order Confirmation (page "Stage 3 — Order Confirmation")
| Frame | Status |
|---|---|
| OC-1 | ✅ |

### Stage 4 — Execution Summary (page "Stage 4 — Execution Summary")
| Frame | Status |
|---|---|
| ES-1 | ✅ ("Return to Portfolio/Balances" ghost link hidden — no portfolio page in scope) |

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

## PENDING ITEMS (not yet completed)

1. **Scenario context annotation CC prompt** — add amber annotation frames to FS-MAN-1/2/LOT showing dynamic "Editing Scenario 2" header label. Prompt written, stored in PDB 09.
2. **Jira Figma frame URLs** — add Figma deep links to VSR story descriptions. Deferred to pre-Dev phase.
3. **FS-TXHIST** — completed but lowest priority; may need minor refinement.
4. **ai_pipeline.html** — renamed from v3, artifact links added for PM steps 1-6 and PD steps 1-9. Push latest version to GitHub (replace pm/pm_pd_dev_ai_pipeline_v3.html with pm/ai_pipeline.html).

---

## PROCESS LEARNINGS (for retrospective)

1. **CC vs manual Figma split:** CC effective for initial screen generation and bulk text updates; manual Figma finishing required for structural work and complex nested component architecture
2. **Fund Row component family:** Required full manual construction after multiple CC regressions — 6 levels of nesting (Fund Row → Details Row → Table Section → LT/ST headers → Lot Details Table → Lot Detail Row) with conditional visibility at each level
3. **Hidden Figma layers:** CC inspection reports include hidden layer content — stale data from prior iterations appears as if visible. Human visual confirmation is authoritative.
4. **Library update cycle:** Manual close-and-reopen of Screens file required after DS library publish before "accept library updates" appears
5. **CC inspection "visible layers only":** Not fully honored by Figma MCP — always verify visually
6. **Scenario Analysis iteration:** Went through 5+ major architectural revisions before settling on read-only model — key learning is resolving the editing surface ambiguity before screen generation
7. **Calculation errors in long threads:** Context drift causes CC to lose track of canonical data — always ground calculations in PRD Verification Tables

