# Dev Phase — Context for Claude Code

## What this phase produces

A working React/TypeScript prototype of the Vanguard Sell & Rebalance tool,
deployed to Vercel, validated against the canonical 32-lot sample dataset and
all 15 coverage cases.

## Read these before any Dev task

### Source of truth — Notion pages

| Page                             | ID                               | What it contains                         |
| -------------------------------- | -------------------------------- | ---------------------------------------- |
| PRD 05 — Functional requirements | 33edcac9574a81c4b19ffcf6facc40b8 | All REQ-numbered requirements            |
| PRD 10 — Sample dataset          | 33fdcac9574a81d181c0f25bb665d8ad | 32-lot canonical data, 15 coverage cases |
| PDB 04 — Screen inventory        | 364dcac9574a81aca521c64f205958f3 | All screens and states                   |
| PDB 09 — PD decisions log        | 340dcac9574a8141a170de6bc25d9750 | All design decisions — authoritative     |

### Reference implementations

- Lovable logic prototype: https://github.com/mcasey10/vanguard-lovable-prototype
- Figma prototype: https://www.figma.com/proto/jz82GrOp8RE2QGh81V0qbs
- Figma Screens file: jz82GrOp8RE2QGh81V0qbs (all 19 frames on "Stage 1 — Fund Selection" page)
- Canonical workflow: pm/sell_rebalance_workflow.html

### Sample dataset

Location: pm/08-sample-dataset.json in this repo
ALWAYS read from this file for any calculation involving lot data.
NEVER recall cost basis, shares, gain/loss, or NAV figures from memory.
All 15 coverage cases are documented in PRD 10.

---

## CRITICAL CONSTRAINTS — read before writing any logic

### 1. Account withdrawal priority order

TAXABLE_BROKERAGE first → TRADITIONAL_IRA second → ROTH_IRA last.

This is an EXPLICIT BUSINESS RULE, not a tax optimization inference.
Do NOT derive this from gains/losses, tax efficiency, or any other heuristic.
The priority is fixed regardless of relative tax outcomes across accounts.
The Lovable prototype failed this constraint when not explicitly instructed.

### 2. IRA tax treatment — capital gains logic does NOT apply

- Traditional IRA distributions are taxed as ORDINARY INCOME.
  Do NOT apply ST/LT capital gains rates. Do NOT apply harvestable loss logic.
  Do NOT apply Wait & Save logic. FIFO and average cost only (no SpecID).
- Roth IRA qualified distributions are TAX-FREE.
  No capital gains tax applies. SpecID IS available (per Vanguard policy).
- Taxable brokerage: full ST/LT capital gains logic applies.
  SpecID is available.

### 3. EST. NET TAX vs. EST. TAX — these are different values

- EST. TAX (per-fund, in fund rows): GROSS tax before netting. Shows what
  each fund contributes before any loss offsets.
  Example: VTSAX ST gain $1,515.85 → EST. TAX = $363.80
- EST. NET TAX (Summary Banner): portfolio-level NETTING.
  Sum all realized gains, subtract all realized losses, apply rate.
  Example: VTSAX ST gain $1,515.85 − VBTLX LT loss $1,056.65 =
  net $459.20 × 24% = EST. NET TAX $110.21
- NEVER display per-fund EST. TAX as the user's total tax liability.
- Effective rate = EST. NET TAX ÷ total sale amount (0.44% in primary scenario).

### 4. SpecID is Manual mode only

- SpecID is NOT a selectable option in Automated mode.
- In Automated mode, the engine selects lots via its own MinTax algorithm.
- When SpecID is selected in Manual mode:
  - The sell amount input field becomes READ-ONLY
  - Displays the total derived from lot-level share quantity entries
  - The lot detail panel is revealed automatically

### 5. Wait & Save — suppressed in Automated mode

- The Wait & Save interrupt notice MUST NOT appear in Automated mode.
- Only surfaces in Manual mode when a user-entered sell amount would trigger
  sale of a lot within 30 calendar days of LT conversion.
- Wait & Save is lot-specific and comparative within the same fund only.
  It communicates the tax cost of selling THIS lot now vs. waiting.
  It is NOT a recommendation to sell a different lot instead.

### 6. State tax is out of scope for v1

Federal rates only. Do NOT implement state tax. REQ-G-007.

### 7. All tax figures must be labeled as estimated

"Estimated" or "EST." label required on every tax figure displayed to the user.
REQ-EC-001.

---

## Application architecture

### Four-stage progressive disclosure model

Stage 1: Fund Selection (Automated/Manual mode toggle)
Stage 2: Scenario Analysis (optional, read-only comparison — max 3 scenarios)
Stage 3: Order Confirmation (all read-only, affirmative submit required)
Stage 4: Execution Summary (post-submission, all read-only)

### Fund Selection — two modes

Automated mode:

- System selects funds and amounts using optimization engine
- All sell amounts locked (read-only)
- SpecID not available
- Wait & Save suppressed
- Inactive account sections: chevrons hidden, not expandable

Manual mode:

- User enters per-fund sell amounts
- Fund rows have two states: Inactive (Sell button) and Active (amount input)
- SpecID available
- Wait & Save active on near-LT lots
- Inactive accounts: chevrons visible, expandable to read-only fund data
- Accounting methods: MinTax, HIFO, FIFO, Average cost, SpecID

### Scenario Analysis — read-only

- All scenarios created and edited in Fund Selection only
- SC displays up to 3 saved scenarios side by side
- No input fields or selectors in SC — static text only
- Actions: Edit scenario (→ Fund Selection), Review order (→ OC), Delete, Duplicate
- Empty state: inline, no redirect

### localStorage persistence (REQ-PS-001 through REQ-PS-007)

On successful transaction:

- Update Portfolio State atomically (balances, lots, allocation weights, YTD gains)
- Append Transaction History Entry
  On session entry:
- Hydrate from localStorage if Portfolio State exists
- Show canonical dataset if not
  REQ-PS-004: "Reset portfolio" control clears localStorage and restores canonical data.
  REQ-PS-007: localStorage is NOT an authoritative record. All figures labeled estimated.
  Persistent notice: state resets if browser data is cleared.

---

## Optimization engine requirements (REQ-OE-001 through REQ-OE-010)

Engine inputs:

- Target sale amount
- Active account designation (default: Taxable Brokerage)
- All funds and lots within the active account
- Overall portfolio target allocation (55% stocks / 35% bonds / 10% reserves)
- Cost basis per lot, holding period per lot
- Active capital gains rate assumptions (default: 24% ST / 15% LT)
- YTD realized gains (ST $1,245 / LT $8,750 pre-sale)
- RMD requirements per account

Dual objectives (REQ-OE-002):

1. Minimize capital gains tax impact
2. Move portfolio allocation toward target
   When objectives conflict: TAX-FIRST by default (PM Decision 6).

Lot selection rules (REQ-OE-003, REQ-OE-004):

- Prefer LT lots over ST lots, all else equal
- Prioritize lots with unrealized losses that offset current-year gains

Wait & Save detection (REQ-OE-006):

- Detect any lot within 30 days of LT conversion
- Account for this in recommendation — either exclude or flag in rationale

Plain-language rationale (REQ-OE-007):

- Single sentence, no jargon, references primary optimization dimension
- Example: "This recommendation minimizes your near-term tax cost while keeping
  your portfolio within 2% of your target allocation."

---

## Canonical sample data — key figures

Investor: Margaret R. Ellison, age 73
Portfolio total: $849,851.40
Reference date: 2026-05-27 (ST/LT boundary: 2025-05-27)

Accounts:

- Taxable Brokerage ...4782: $507,194.40 (VTSAX, VTIAX, VBIRX, VBTLX)
- Traditional IRA ...2973: $211,065.00 (VBTLX, VFITX) — RMD remaining $3,667.92
- Roth IRA ...8148: $131,592.00 (VFIAX)

Target allocation: Stocks 55% / Bonds 35% / Reserves 10%
Current allocation: Stocks 59.2% (+4.2% OW) / Bonds 30.9% (-4.1% UW) / Reserves 9.9%

Tax rates: 24% ST / 15% LT
YTD realized (pre-sale): ST $1,245 / LT $8,750

Special condition lots:

- T-VTIAX-07: Wait & Save — 400 sh, acquired 2025-06-10, ST, 14 days to LT,
  tax savings by waiting = $55.80
- T-VBIRX-02, T-VBIRX-03: Harvestable LT losses (-$575, -$540)
- T-VBTLX-01, T-VBTLX-02, T-VBTLX-03: Harvestable LT losses (-$3,030, -$4,540, -$705)

Primary sale scenario (Verification Table 8):

- VTSAX: 103.306 sh T-VTSAX-09 SpecID (ST) → $15,000.03 · ST gain +$1,515.85
  EST. TAX $363.80 · Wait & Save (converts 2026-11-20, saves $37.03 by waiting)
- VBTLX: 1,089.325 sh T-VBTLX-02 MinTax (LT loss) → $10,000.00 · LT loss -$1,056.65
  EST. TAX $0.00
- EST. NET TAX: $110.21 (= $459.20 × 24%) · Effective rate: 0.44%
- Impact: VTSAX -0.8% Equity (GREEN — moves toward target)
  VBTLX -0.4% Bonds (RED — worsens underweight)

---

## Canonical button terminology

| Action                                  | Label                            |
| --------------------------------------- | -------------------------------- |
| Navigate to Order Confirmation          | "Review order"                   |
| Save and navigate to Scenario Analysis  | "Go to Scenario Analysis"        |
| Restore automated recommendation values | "Reset to system recommendation" |
| Edit a scenario from Scenario Analysis  | "Edit scenario →"                |

---

## Figma Screens file

File key: jz82GrOp8RE2QGh81V0qbs
All 19 frames on "Stage 1 — Fund Selection" page

Key node IDs:
FS-ENTRY-1: 248:541 FS-AUTO-1: 249:272
FS-MAN-1: 250:369 FS-MAN-2: 382:1501
FS-MAN-LOT: 382:1866 FS-INT-SAVEDISCARD: 425:1885
FS-DEGRADE: 446:2153 FS-TXHIST: 547:2428
NF-1 (reset): 572:3190 SC-1 (2-scenario): 628:24446
SC-1A (1-auto): 628:24765 SC-1M (1-manual): 628:25084
SC-1B (3-scenario):628:25404 NF-2 (delete): 628:25899
OC-1: 628:26277 ES-1: 628:26531
Cost Basis Dialog: 660:4200 Target Alloc Modal: 667:3618

---

## GitHub branch strategy

main — stable, manually merged
dev/scaffold — Lovable evaluation output, app shell
dev/data-model — Step 2: data model + API layer
dev/optimization-engine — Step 3: optimization engine (all 15 cases)
dev/testing — Step 4: test suite
dev/deployment — Step 5: Vercel config, GitHub Actions

Claude Code auto-branches (claude/...) are acceptable for Step 6 (PR automation).
All prior steps use the named branches above.

## Jira project

Site: michaelcasey-jira-site.atlassian.net
cloudId: 89da3bf5-61e1-4506-98ff-7cf28f3fa5f9
Project key: VSR
Transition IDs: 21=To Do · 31=In Progress · 41=Testing · 51=Done

## Key active story

VSR-75 — FS-01: Fund Selection entry (In Progress)
Figma: https://www.figma.com/design/jz82GrOp8RE2QGh81V0qbs?node-id=248-541

---

## Process learnings from PD phase (do not repeat these mistakes)

1. NEVER infer account withdrawal priority from tax efficiency — it must be
   explicit. The Lovable prototype got this wrong without explicit instruction.

2. NEVER trust recalled lot-level figures. Always read from pm/08-sample-dataset.json.
   Calculation errors in long threads come from memory drift, not the source file.

3. When CC stops and reports a missing component, stop and report — do NOT invent
   a substitute. Invented components create cleanup work that costs more than the
   original ask.

4. SpecID requires two simultaneous changes: sell amount field → read-only,
   lot detail panel → revealed. Both must happen atomically on method selection.

5. EST. NET TAX and EST. TAX are different values displayed in different places.
   A common error is using the per-fund gross figure as the banner net figure.
   Verify against Verification Table 8 in PRD 10 after any tax calculation change.

---

## Figma MCP reading discipline — CRITICAL

A prior related project (different design version, same business problem)
documented a silent failure mode: reading an entire Figma page in one call
can exceed the MCP response token limit (~25,000 tokens). When this happens,
the tool may not raise it as a blocking error — it can return a truncated
response and continue, producing UI that silently diverges from the design
without any clear failure signal.

To prevent this:

1. NEVER call get_design_context or get_screenshot against an entire page.
   Always target a specific node ID (e.g. node-id=248-541), one frame at a time.

2. Use get_metadata FIRST on any node before pulling full design context.
   This returns the layer tree structure cheaply. If a frame's metadata shows
   deep nesting or a large number of children, treat that as a signal to read
   sub-sections (individual component instances) separately rather than
   the whole frame in one call.

3. ANY of the following must be treated as a BLOCKING issue, not a warning
   to work around:
   - A truncation notice of any kind in a tool response
   - A token limit warning, even one phrased as informational
   - A response that appears incomplete relative to what get_metadata showed

   On any of these: STOP. Do not continue building from partial data. Do not
   invent or infer the missing structure. Report the specific node ID and the
   nature of the truncation, and ask for guidance before proceeding.

4. If a frame cannot be read in full via either Figma MCP connection
   (mcp**figma** or mcp**figma-desktop**), report this explicitly rather
   than falling back to a text-described approximation of the screen.

5. Prefer mcp**figma-desktop** first (Figma Desktop is running locally).
   Fall back to mcp**figma** (cloud) only if the desktop connection errors
   or is unavailable. Note which connection was actually used for each frame
   in your session report.

6. The Screens file (jz82GrOp8RE2QGh81V0qbs) references component instances
   from the Design System library file (key: krtNgOD3jL5U6WmUMT32u6). When
   a frame uses a DS library component (buttons, inputs, Fund Row, Details
   Row, modals, etc.), do NOT infer that component's internal structure or
   variant behavior just from how the instance appears inside the screen
   frame. Read the component's actual node in the DS file directly via
   get_metadata / get_design_context against krtNgOD3jL5U6WmUMT32u6, and use
   get_variable_defs and get_code_connect_map where useful for mapping DS
   components to code. This applies to every frame in the screen inventory —
   treat it as a standard step in Step 1 context-gathering for any screen,
   not a one-off check for a single frame.

---

## Ask, don't invent — CRITICAL

This project has complete design and business logic specifications: 19 Figma
frames with confirmed node IDs (listed below), a full PRD (Notion, functional
requirements REQ-numbered), and a PD decisions log (PDB 09) that resolves
prior design ambiguity. There should be no need to guess.

If any of the following is true for a given task, STOP and ask rather than
proceeding with an assumption:

- A Figma frame's visual content doesn't clearly match its corresponding
  Jira story description or PRD requirement
- A component's behavior (e.g. what happens on a particular interaction)
  is not specified in the Figma frame, the linked Jira story, or PDB 09
- Two source documents (Figma vs. PRD vs. Jira) appear to conflict
- A node referenced in this file cannot be found at the expected ID

Do not fill these gaps with a plausible-sounding default. Report what's
unclear and what you checked, and wait for a response.

---

## Figma frame → Jira story cross-reference

For implementation order and requirements context, each frame's Jira story
contains the full acceptance criteria. Read the story before implementing
the frame.

| Frame                   | Node ID   | Jira Story |
| ----------------------- | --------- | ---------- |
| FS-ENTRY-1              | 248:541   | VSR-75     |
| FS-AUTO-1               | 249:272   | VSR-18     |
| FS-MAN-1                | 250:369   | VSR-21     |
| FS-MAN-2                | 382:1501  | VSR-24     |
| FS-MAN-LOT              | 382:1866  | VSR-22     |
| FS-INT-SAVEDISCARD      | 425:1885  | VSR-77     |
| FS-DEGRADE              | 446:2153  | VSR-75     |
| FS-TXHIST               | 547:2428  | VSR-73     |
| NF-1                    | 572:3190  | VSR-21     |
| SC-1                    | 628:24446 | VSR-27     |
| SC-1A                   | 628:24765 | VSR-27     |
| SC-1B                   | 628:25404 | VSR-27     |
| SC-1M                   | 628:25084 | VSR-27     |
| OC-1                    | 628:26277 | VSR-28     |
| ES-1                    | 628:26531 | VSR-78     |
| NF-2                    | 628:25899 | VSR-26     |
| Cost Basis Dialog       | 660:4200  | VSR-22     |
| Target Allocation Modal | 667:3618  | VSR-75     |
