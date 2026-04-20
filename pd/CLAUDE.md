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

### Visual design reference (secondary — rendered HTML document)
https://mcasey10.github.io/vanguard-ai-pipeline/pd/vanguard-design-system.html
This is the rendered HTML design system document. It contains:
- All color swatches with hex values and confidence badges (Confirmed/Inferred)
- Typography specimens at actual size and weight
- Rendered component examples (navigation, hero banner, buttons, forms, alerts, tables)
- CSS implementation details for complex components (hero banner SVG, icon SVG paths)

### Notion page 14 — supplementary specs and corrections
ID: 341dcac9574a8171a21bc681ca4190ae
Contains: corrected component specifications (Section 6), file architecture decisions,
screen generation progress, and the gap between DevTools extraction and visual reality.

### Notion page 13 — PD decisions log
ID: 340dcac9574a8141a170de6bc25d9750
Contains: all design decisions made during PD phase, Tier 1 question resolutions,
data visualization register (DV-1, DV-2, DV-3), portal shell framing decision.

## Figma files
| File | Key | Purpose |
|---|---|---|
| Vanguard Constellation — Design System (ACTIVE) | krtNgOD3jL5U6WmUMT32u6 | Component library — publish as shared library |
| Vanguard Constellation — Design System (OLD) | vo5E9DDnLPzG4gFs3K8JHs | Deprecated — do not use for new work |
| Vanguard Sell & Rebalance — Screens | H06IX7e8BwKLU5wQHYpnS5 | Product screens — references library |

**Always use krtNgOD3jL5U6WmUMT32u6 as the active Design System file.**

## Design tokens — quick reference
These are the most critical values. Verify against the HTML file for full detail.

### Colors
- Primary text: #040505 (near-black, NOT pure black)
- Secondary text: rgb(113,119,119) / #717777
- Link blue: rgb(20,91,255) / #1255FF
- Brand red: #C8102E (active tab indicators, error states)
- Positive/gain: #007A00
- Negative/loss: #C8102E
- Warning amber: #E07000
- Warning bg: #FFF8F0
- Info teal bg: #E8F5F0
- Chart equity/stocks: #2bbfb3
- Chart bonds: #c8902a

### Typography (Inter substituting for FF Mark)
- Page title: 30px/700
- Hero title: 26px/700
- Section heading: 16px/700
- Body default: 14px/400
- Nav items (all states): 14px/400 inactive, 14px/700 active
- Table column headers: 12px/600, sentence case
- Labels: 12px/400/#040505
- Helper text: 11px/400/#555 italic
- Timestamps/captions: 11px/400/#555

### Shape
- Button border-radius: 100px (pill) — ALL buttons
- Card/input border-radius: 4px
- Badge border-radius: 50% (circle)

### Buttons
- Primary: bg #040505, white text, 100px radius, 48px height, 11px/28px padding, weight 700
- Secondary: white bg, #040505 border 1.5px, same geometry
- Ghost/link: #1255CC, underline, no background

### Navigation
- L1 nav: active tab has BLACK 3px bottom border (#040505)
- L2 nav: active tab has RED 2px bottom border (#C8102E) — NOT black
- Header: two-row, ~100px total (Row 1: brand+icons 60px, Row 2: L1 nav 40px)
- Utility icons: monochrome black SVG glyphs, ~24px, stacked above 11px label — SVG paths already applied manually
- Messages badge: red dot only, NO count number

### Inputs
- All inputs: square corners (0px border-radius via 4px card, but inputs specifically 4px)
- Default border: 1px solid #767676
- Focus border: 2px solid #1255CC
- Error border: 2px solid #C8102E
- Height: 48px

### Content layout (at 1440px canvas)
- Left content margin: 24-32px (NOT 159px — that was a viewport-specific extraction artifact)
- Content max width: ~1296px

## Design System gap audit — items to address
These gaps were identified by comparing the current Design System file against
the reference screenshots. Address these in the next Claude Code session.

### Completed / already resolved
- `Nav/L2 Nav Bar` — deleted (was redundant). `Nav/L2 Secondary Navigation` with red underline is the canonical component.
- Utility icon SVGs — real SVG paths applied manually to Global Header. Placeholder ellipses removed.

### Components missing entirely
- `Dropdown/Select — Open state` — the Holdings page dropdown with grouped
  options (Cost basis, Unrealized gains/losses, etc.). Reference: dropdown-holdings-menu.png
- `Table/Lot Detail Row` — the expanded lot-level row shown in data-table-unrealized-gains.png
- `Modal/Dialog` — the account routing number dialog. Reference: dialog-modal.png
- `Pill/Time Range Selector` — verify against performance-graphs.png

### Known structural notes — do not flag as errors
- `Hero/Greeting Banner` contains a child frame "Banner background 1" (1440×1440, absolute
  positioned, layout: NONE). This is the manually imported swoosh SVG from the live Vanguard
  portal. Its large native dimensions are expected — the SVG coordinate system requires this
  height to preserve the curve shape. Do not resize, restructure, or delete this frame.
  The parent component height of 132px is correct. Any further swoosh refinement requires
  manual Figma pen tool editing and is out of scope for Claude Code sessions.
- `Nav/L2 Secondary Navigation` — single canonical component on page 4 — Navigation & Shell
  (node 6:2, key 1a562774…). HORIZONTAL auto-layout, 1440×48px fixed, 24px left/right padding,
  24px item spacing, active indicator (113×2, #C8102E) absolute-positioned at x=598 y=46,
  aligned to "Sell & Rebalance" tab. Do not move, duplicate, or restructure this component.

### Components that need visual correction
- `Table/Fund Row` — **known incorrect, must be rebuilt.** The current component
  does not match the portal. Correct spec: fund symbol 14px/700/#1255CC with underline;
  full fund name 11px/400/#555 uppercase below symbol; price column 14px/400;
  gain/loss values with green ↑ or red ↓ arrow prefix; % gain column; current balance;
  "Transact" ghost link; kebab dot button (3×15 ellipse). Reference: data-table-holdings.png.
  Do not attempt to patch the existing component — replace it.
- `Table/Column Header Row` — treat as a reusable structural template, not a
  content prescription. Do not hardcode specific column labels — use placeholder
  names (Column 1, Column 2, etc.) with correct typography (12px/600, sentence case).
  Column labels and count are set at the screen level. Sort indicators must reflect
  three states per column: unsorted (both arrows, muted), sorted ascending (up arrow
  #040505, down arrow muted), sorted descending (down arrow #040505, up arrow muted).
  Sort indicators must use filled SVG triangle vector nodes — NOT Unicode arrow
  characters or text glyphs. Up triangle: 6px wide × 4px tall. Down triangle: same
  dimensions, inverted. Active fill: #040505. Muted fill: #B0B0B0. The two triangles
  stack vertically with 2px gap between them.
  Reference: data-table-holdings.png.

### Prompt to use in Claude Code for the gap audit
```
Read pd/CLAUDE.md. Then read each reference screenshot in pd/reference-screenshots/
one at a time and compare what you see against the current components in the
Design System file (krtNgOD3jL5U6WmUMT32u6).

For each component that exists in the screenshots but is missing from the file,
or that visually differs significantly from the screenshot, document the gap.
Pay particular attention to Table/Fund Row — this component is a known rebuild
target and should be flagged as incorrect regardless of superficial similarity.

Do not make any changes yet. Output a gap report organized by page
(Navigation & Shell, Buttons & Controls, Form Inputs, Data & Alerts)
showing: component name, gap type (missing / incorrect / needs verification),
and the specific reference screenshot to use for correction.

Wait for my confirmation before making any changes.
```

### Remaining manual-only items (cannot be done via Claude Code API)
1. **Hero banner SVG** — curved swoosh approximation is acceptable for portfolio project scope.
   Further refinement requires manual Figma pen tool editing. Do not attempt programmatic fixes.
2. **Drop shadow on header** — verify it is applied: Effect → Drop Shadow, rgba(4,5,5,0.06), X:0 Y:0 Blur:4
3. **Font** — all text uses Inter (FF Mark substitute). Swap globally when FF Mark is licensed.

## Deprecated files
- `pd/FIGMA_DESIGN_SYSTEM_DEPRECATED.md` — superseded by Notion page 14 and the rendered
  HTML at the GitHub Pages URL above. Do not use as a design reference.

## Canonical sample dataset
Always read these files before generating any screen or writing any code
that involves portfolio data, fund names, lot counts, tax figures, or account
balances. Do not use inline values from prompts — the files are the single
source of truth.

- `pm/08-sample-dataset.json` — full lot-level dataset: 32 lots, 5 funds,
  3 accounts, $849,851.40 total portfolio value
- `pm/08-sample-dataset-verification.md` — verification tables, 15 coverage
  cases, special condition flags

Key values for quick reference (verify against file before use):
- Portfolio total: $849,851.40
- Target withdrawal used in screens: $50,000
- Tax assumption: 24% ST / 15% LT (default bracket)
- YTD realized: ST $1,245 / LT $8,750
- Wait & Save lot: T-VBIRX-07, 14 days to LT conversion, $55.80 tax difference
- Funds: VTSAX (Brokerage ...4782), VBTLX (Brokerage ...4782), VBIRX (IRA ...2973),
  VTIAX (Brokerage ...4782), VFIAX (Roth IRA ...8148)

## Screen generation rules
- All frames: 1440px wide
- Portal shell on every screen: Global Header (100px) + L2 Nav (48px) + white content area
- L2 active tab: "Sell & Rebalance" with RED #C8102E underline
- L1 active tab: Transact — set via "L1 Active Tab" component property on Header/Global Header
- No hero/greeting banner on transactional screens
- Horizontal arrangement with 80px gaps between frames

### Missing component protocol
If a screen requires a component that does not exist in the Design System library
(krtNgOD3jL5U6WmUMT32u6), do not invent a substitute or use raw shapes inline.
Stop and report: "Screen [name] requires [component name] which is not in the
library. Add it before proceeding?" Wait for explicit confirmation before continuing.
This applies to every screen generation task regardless of how the prompt is worded.

### Component instance rules
- Never detach a component instance to work around a library publishing gap
  or property limitation
- If a required component property is unavailable because the library has not
  been published, stop and report it — do not detach or approximate with raw shapes
- All header instances must use setProperties to set "L1 Active Tab": "Transact"
  — never manually reposition the indicator rectangle

### Auto-layout requirements
Every component added to the Design System library must have auto-layout applied
before being committed. No exceptions. A component without auto-layout is not
acceptable for library use.

**By component type:**
- Row-level components (buttons, input fields, nav tabs, table rows, chips):
  HORIZONTAL auto-layout
- Container components (cards, dropdowns, form groups, modals, alert banners):
  VERTICAL auto-layout
- Complex components with both axes (fund rows, dialog boxes): nested auto-layout
  — outer frame VERTICAL, inner rows HORIZONTAL

**Resizing behavior:**
- Full-width components (dropdowns, banners, table rows, nav bars):
  width = Fill container, height = Fixed at prescribed px value
- Form inputs (text, select, dollar amount): width = Fixed 320px base
  (overridden at instance level on screens), height = Fixed 48px for the
  input field itself, Hug for the label+input group
- Buttons: width = Hug contents, height = Fixed 48px
- Content that grows with text (alert bodies, modal text, tooltips):
  height = Hug contents

**Before adding any component to the library:**
1. Confirm auto-layout is applied at every frame level
2. Confirm resizing behavior is set correctly (not left as Fixed/Fixed by default)
3. Verify the component resizes correctly when width is changed before publishing


