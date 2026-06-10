# PD Phase — Context for Claude Code

## What this phase produces
Figma Design System file + Figma Screens file for the Vanguard Sell & Rebalance tool.
All screens must match the Vanguard Constellation design system extracted from the live portal.

## Source of truth — read these before any PD task

### Reference screenshots (primary visual source — use these first)
Location: `pd/reference-screenshots/` in the local repo
These are actual screenshots from the live Vanguard portal. They are the
ground truth for all visual design decisions. When building or correcting
any Figma component, read the relevant screenshot(s) first.

| Filename | What it shows |
|---|---|
| global-header.png | Full portal header: V-mark logo, Personal investors, 6 utility icons, L1 nav, hero banner, L2 nav with Balances active |
| l1-nav-portfolio-dropdown.png | L1 nav with Portfolio dropdown open showing sub-menu items |
| l1-nav-transact-dropdown.png | L1 nav with Transact dropdown open showing sub-menu items |
| dropdown-holdings-menu.png | Holdings page Show dropdown open with grouped options (Summary info, Cost basis, Dividends & capital gains) |
| dropdown-date-input.png | Date input dropdown field in default/open state |
| data-table-holdings.png | Holdings grid: fund rows with symbol, name, price, gain/loss values, Transact + kebab menu open |
| data-table-unrealized-gains.png | Lot-level table: expanded VFIAX row showing individual lot detail with date, cost basis, gain/loss per lot |
| portfolio-analysis.png | Portfolio Watch: asset mix stacked bar chart, stock/bond donut charts, expense ratio bars |
| performance-graphs.png | Performance page: area chart with positive/negative fill, time range pill selector, balances line chart |
| segmented-controls-bar-chart-card-list.png | Segmented control component: Bar chart / Card / List toggle variants |
| order-status-page.png | Activity page: Order status with 4 filter dropdowns, empty table state |
| form-inputs-default.png | Message Center compose form: text input, select dropdowns, textarea in default state |
| form-inputs-validation.png | Same compose form with all fields in error state: red borders, error icon + message below each field |
| dialog-modal.png | Cash Plus Account routing numbers modal: title, label/value rows with dividers, Close pill button |
| alert-warning-banner.png | Warning alert banner: amber left border, triangle icon, bold title, body text, dismiss × button |
| kebab-menu.png | Three-dot kebab menu in three states: default dot, hover dot (filled), open with Withdraw/Deposit options |
| logoff-page.png | Post-logout confirmation: green checkmark, "You've successfully logged off", Log in pill button |
| accordion-collapsed.png | Accordion component in collapsed state: chevron right, label, border |
| accordion-expanded.png | Accordion component in expanded state: chevron down, content revealed |
| sell-mutual-funds.png | Sell mutual funds flow: fund selection list with checkboxes and account info |
| sell-VFIAX-fund.png | Sell flow for a specific fund (VFIAX): amount entry, lot detail, accounting method selector |
| buy-sell-landing-page.png | Buy/Sell transaction landing page: entry point, account selector, fund list |
| buy-sell-agreement-terms.png | Buy/Sell agreement terms screen: terms text, confirm checkbox, Submit button |
| buy-sell-agreement-prompt.png | Buy/Sell agreement prompt/modal: brief summary with Accept/Decline actions |
| sell-fund-transaction.png | Vanguard mutual fund sell transaction screen: inactive fund rows with Sell button, active rows with amount input field and Cancel button, cost basis method selector per fund, running total at bottom. Reference for Manual mode fund row inactive/active states. |
| Sell_specific_shares_of_fund.png | Lot selection screen for Specific ID cost basis: per-lot input fields for number of shares, LT and ST sections with totals, "Continue" and "Back" buttons |
| Fund_Row_-_sell_specific_shares_of_fund.png | Fund row in SpecID mode after lot selection: read-only total shares to sell displayed, summarizing the lot-level selection |
| choose-cost-basis-dialog.png | Cost basis method selection dialog: radio options for MinTax, HIFO, FIFO, Specific ID with descriptions, Continue/Cancel buttons |

### Visual design reference (secondary — rendered HTML document)
https://mcasey10.github.io/vanguard-ai-pipeline/pd/vanguard-design-system.html
This is the rendered HTML design system document. It contains:
- All color swatches with hex values and confidence badges (Confirmed/Inferred)
- Typography specimens at actual size and weight
- Rendered component examples (navigation, hero banner, buttons, forms, alerts, tables)
- CSS implementation details for complex components (hero banner SVG, icon SVG paths)

### PDB 05 — Design system (Constellation / c11n)
ID: 341dcac9574a8171a21bc681ca4190ae
Contains: corrected component specifications (Section 6), file architecture decisions,
screen generation progress, and the gap between DevTools extraction and visual reality.

### PDB 09 — PD decisions log
ID: 340dcac9574a8141a170de6bc25d9750
Contains: all design decisions made during PD phase, Tier 1 question resolutions,
data visualization register (DV-1, DV-2, DV-3), portal shell framing decision.

## Figma files
| File | Key | Purpose |
|---|---|---|
| Vanguard Constellation — Design System (ACTIVE) | krtNgOD3jL5U6WmUMT32u6 | Component library — publish as shared library |
| Vanguard Constellation — Design System (OLD) | vo5E9DDnLPzG4gFs3K8JHs | Deprecated — do not use for new work |
| Vanguard Sell & Rebalance — Screens | jz82GrOp8RE2QGh81V0qbs | Product screens — references library |

**Always use krtNgOD3jL5U6WmUMT32u6 as the active Design System file.**

## Design System components — canonical inventory
DS file: krtNgOD3jL5U6WmUMT32u6
Screens file: jz82GrOp8RE2QGh81V0qbs

Use ONLY the component names listed below when placing instances in screens.
Do not invent component names. Do not reference any component prefixed with NEW,
v2, or v3 — those were workshop builds and have been superseded or deleted.

### Page 4 — Navigation & Shell
- Header/Global Header (COMPONENT_SET, variant: L1 Active Tab)
- Nav/L2 Secondary Navigation
- Hero/Greeting Banner

### Page 5 — Buttons & Controls
- Button/Primary
- Button/Secondary
- Button/Ghost-Link
- Pill/Time Range Selector
- Heading/Page Title with Toggle (1440×56px, space-between: title left / mode toggle right)
- Kebab/Three-dot Menu (COMPONENT_SET, variants: State=Default|Hover|Open)
- Accordion/Row (COMPONENT_SET, variants: State=Collapsed|Expanded)
- Controls/Mode Toggle (COMPONENT_SET, variants: Active=Automated|Manual)
- Controls/View Toggle (COMPONENT_SET, variants: Active=Table|Cards)

### Page 6 — Form Inputs
- Input/Text — Default
- Input/Text — Focus
- Input/Text — Error
- Input/Select (COMPONENT_SET, variants: State=Closed|Open)
- Checkbox (COMPONENT_SET, variants: State=Unchecked|Checked)
- Input/Dollar Amount (COMPONENT_SET, variants: State=Default|Focused)
  Component property: Current value (TEXT, default "$0.00")
- Input/Share Amount (COMPONENT_SET, variants: State=Default|Focused)
  Component property: Current value (TEXT, default "0.000")
  Note: use Input/Share Amount for lot-level share quantity inputs, NOT Input/Dollar Amount

### Page 7 — Data & Alerts
- Alert/Portfolio Alert Panel
- Banner/Info Teal
- Alert/Warning Banner
- Modal/Dialog
- Chart/Stacked Bar
- Summary Banner
- Lot Detail Header (standalone — column header row for lot detail table)
- Lot Detail Totals (standalone — totals row for lot detail table)
- Lot Detail Row (COMPONENT_SET, 4 variants: Wait & Save=False|True × GL direction=Loss|Gain)
  Component properties (all TEXT):
    Shares owned · Total cost · Est gain/loss (per share) · Est proceeds · Date acquired
- Lot Details Table (COMPONENT_SET, 8 variants: Row count=2–9)
  Component properties (all BOOLEAN, default false):
    Row 3 visible · Row 4 visible · Row 5 visible · Row 6 visible ·
    Row 7 visible · Row 8 visible
  IMPORTANT: When placing with Row count > 2, you must explicitly set each
  additional row's visibility boolean to true. Row count=5 requires setting
  Row 3 visible=true, Row 4 visible=true, Row 5 visible=true.
- Details Row (COMPONENT_SET, variants: State=Collapsed|Expanded)
  Component properties:
    Details Text (TEXT, default "Fund row details message")
    Show details text (BOOLEAN, default true)
    Show LT details (BOOLEAN, default true)
    Show ST details (BOOLEAN, default true)
    Show wait and save (BOOLEAN, default true) — set false on all Automated mode fund row instances
    Wait and save amount (TEXT, default "$0.00") — set to lot-specific savings amount e.g. "$37.03"
- Fund Row (COMPONENT_SET, variants: Mode=Automated|Active|Inactive)
  Component properties (TEXT):
    Fund name · Symbol · Shares · Balance · Sell amount · Method ·
    EST ST Gains · EST LT Gains · EST Tax · Impact
  Component properties (BOOLEAN):
    Show details row (default true)
    Sell amount read-only (default false) — set true when SpecID is selected;
      hides input field, shows locked text value derived from lot selections
    Sell amount input (default true) — set false when Sell amount read-only=true

## Fund Row usage rules

Mode=Automated:
  All sell amounts are read-only locked text. No input fields. No Cancel button.
  Show details row=true when SpecID is the accounting method; false otherwise.
  Sell amount read-only=true always in Automated mode.

Mode=Active (Manual mode, fund selected for selling):
  Default: Sell amount input=true, Sell amount read-only=false (shows input field).
  When SpecID selected: Sell amount read-only=true, Sell amount input=false
    (input replaced by read-only total derived from lot-level share entries).
    Show details row=true to reveal lot detail panel.
  When any other method selected: Sell amount input=true, Show details row=false.

Mode=Inactive (Manual mode, fund not selected):
  No sell amount. No method selector. No tax figures. Sell button only.
  Show details row=false always.

## Fund Row display rules — intentional design decisions

### Details Row visibility for non-SpecID active rows
Show details row=true is CORRECT for all Mode=Active fund rows regardless of
cost basis method. The Details Row serves dual purpose: it shows the rationale
text (Automated mode) or Wait & Save badge (any mode) in its collapsed state.
It is NOT hidden for MinTax, HIFO, FIFO, or Average cost — only the Details
Table inside it is hidden. The rule "When any other method selected: Show
details row=false" applies only to the Details Table panel, not the trigger row.
Correct behavior summary:
  - Mode=Active, any method: Show details row=true, Details Row State=Collapsed
  - Mode=Active, SpecID: Show details row=true, Details Row State=Expanded
  - Mode=Inactive: Show details row=false always

### Inactive rows pre-populated from Automated mode (FS-MAN-1 state)
FS-MAN-1 represents the state immediately after the user switches from Automated
mode to Manual mode. In this state, inactive rows retain the Automated
recommendation amounts as read-only reference context — the sell amount,
method, and tax figures are pre-populated even though the row is Mode=Inactive.
This is intentional. These values are NOT user inputs; they are carry-over
context from the Automated recommendation displayed for reference.
DO NOT treat pre-populated values on inactive rows as a Fund Row rule violation
when reading FS-MAN-1. This state is unique to FS-MAN-1.
All other screens (FS-MAN-2, FS-MAN-LOT, and all new screens) follow the
standard rule: Mode=Inactive rows show only fund name, symbol, position, and
Sell button — no sell amount, no method, no tax figures.

### Expanded lot detail panel background color
The #F8F8F7 background color is applied to the expanded lot detail panel
(the Table Section inside a Details Row State=Expanded). This visually
separates the drill-down content from the parent fund row. Do not use white
or any other color for this panel.

### Wait & Save — suppressed in Automated mode
The Wait & Save badge and notice are suppressed entirely in Automated mode.
They appear only in Manual mode (Mode=Active fund rows).
Implementation: set Show wait and save=false on all Details Row instances
inside Automated mode fund rows. Set Wait and save amount to the lot-specific
dollar savings figure (e.g. "$37.03" for T-VTSAX-09).
Do not add Wait & Save indicators to any Automated mode screen.

### Hidden layers
Figma frames may contain hidden layers from earlier iterations. When reading
existing frames, treat hidden layers as non-authoritative — they may contain
stale data from previous states. Only visible layers represent the current
intended design. When generating new frames, do not copy hidden layers from
existing frames.

## Screen generation rules
- All frames: 1440px wide
- Portal shell on every screen: Global Header (100px) + L2 Secondary Navigation
  (48px, "Sell & Rebalance" tab active with red #C8102E underline) + white content area
- L1 active tab: "Transact" with black underline
- No hero/greeting banner on transactional screens
- Content margin: 32px left/right throughout
- Horizontal arrangement with 80px gaps between frames
- Summary Banner: full-width #E8F5F0 background (no left/right margin on background,
  but internal column content has padding)

## Screens file page names
- Stage 1 — Fund Selection
- Stage 2 — Scenario Analysis
- Stage 3 — Order Confirmation
- Stage 4 — Execution Summary

## Notion pages — quick reference
### PDB 05 — Design system (Constellation / c11n)
ID: 341dcac9574a8171a21bc681ca4190ae
Contains: full design token spec, component specs by section

### PDB 06 — Design system audit + gap report
ID: 366dcac9574a81bd8b39dcc1ded84922
Contains: gap report, correction history, DS correction prompts

### PDB 07 — Screen specifications + generation
ID: 366dcac9574a818c98d1f59c417ee758
Contains: Group A–E screen generation prompts and frame links

### PDB 08 — Interaction wiring
ID: 366dcac9574a81e49420c8743395a70d
Contains: interaction wiring specifications (not started)

### PDB 09 — PD decisions log
ID: 340dcac9574a8141a170de6bc25d9750
Contains: all PD decisions, process reflections, workflow findings

## Sample data — canonical values
Reference date: 2026-05-27
Investor: Margaret R. Ellison, age 73
Portfolio total: $849,851.40
Sale scenario: $25,000.03 from Taxable Brokerage ...4782

Active account: Taxable Brokerage ...4782 — $507,194.40
  VTSAX: 1,597 shares · $231,884.40 · NAV $145.20
  VBTLX: 5,600 shares · $51,408.00 · NAV $9.18
  VTIAX: 3,600 shares · $139,500.00 · NAV $38.75
  VBIRX: 8,100 shares · $84,402.00 · NAV $10.42

Traditional IRA ...2973 — $211,065.00 · RMD remaining $3,667.92
  VBTLX: 12,000 shares · $110,160.00
  VFITX: 9,300 shares · $100,905.00

Roth IRA ...8148 — $131,592.00
  VFIAX: 240 shares · $131,592.00 · NAV $548.30

YTD realized: ST $1,245 / LT $8,750
Tax rates: 24% ST / 15% LT

Primary sale scenario (Verification Table 8, PRD page 10):
  VTSAX: sell 103.306 sh from T-VTSAX-09 (SpecID) · proceeds $15,000.03 ·
    ST gain $1,515.85 · EST. TAX $363.80 · Impact −0.8% Equity (green)
    Wait & Save: lot converts LT 2026-11-20 (166 days) · saves $37.03
  VBTLX: sell 1,089.325 sh from T-VBTLX-02 (MinTax) · proceeds $10,000.00 ·
    LT loss −$1,056.65 · EST. TAX $0.00 · Impact −0.4% Bonds (red)
  EST. NET TAX: $110.21 (net after loss offsets gain) · effective rate 0.44%
