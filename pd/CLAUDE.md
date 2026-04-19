# PD Phase — Context for Claude Code

## What this phase produces
Figma Design System file + Figma Screens file for the Vanguard Sell & Rebalance tool.
All screens must match the Vanguard Constellation design system extracted from the live portal.

## Source of truth — read these before any PD task

### Visual design reference (primary — for visual fidelity)
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
| Vanguard Constellation — Design System (NEW) | krtNgOD3jL5U6WmUMT32u6 | Component library — publish as shared library |
| Vanguard Constellation — Design System (OLD) | vo5E9DDnLPzG4gFs3K8JHs | Previous attempt — do not use for new work |
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
- Utility icons: monochrome black SVG glyphs, ~24px, stacked above 11px label
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

## Known manual completion gaps in Design System file
These items in krtNgOD3jL5U6WmUMT32u6 require manual Figma work:
1. **Icon SVGs** — 6 utility nav icons are placeholder ellipses. Replace with actual SVG paths
   from the HTML file's .vg-topnav-icon-glyph SVG definitions (search, support, messages,
   documents, profile, log off)
2. **Hero banner SVG** — curved swoosh is approximated. Replace with exact SVG data URI
   from .vg-hero class in the HTML file
3. **Drop shadow on header** — add manually: Effect → Drop Shadow, rgba(4,5,5,0.06), X:0 Y:0 Blur:4
4. **Auto-layout** — components use absolute positioning. Apply auto-layout per component
   after confirming visual correctness

## Screen generation rules
- All frames: 1440px wide
- Portal shell on every screen: Global Header (100px) + L2 Nav (48px) + white content area
- L2 active tab: "Sell & Rebalance" with RED #C8102E underline
- L1 active tab: "Portfolio" with black underline
- No hero/greeting banner on transactional screens
- Horizontal arrangement with 80px gaps between frames

## Workflow B data (for screen generation)
Portfolio total: $849,851.40
5 funds: VTSAX (Brokerage ...4782), VBTLX (Brokerage ...4782), VBIRX (IRA ...2973),
         VTIAX (Brokerage ...4782), VFIAX (Roth IRA ...8148)
Wait & Save lot: T-VBIRX-07, 14 days to LT conversion, $55.80 tax difference
Tax assumption: 24% ST / 15% LT (default)
YTD realized: ST $1,245 / LT $8,750
