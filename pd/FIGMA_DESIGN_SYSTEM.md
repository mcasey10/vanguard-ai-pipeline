> ⚠️ DEPRECATED — This file references the old Design System file (vo5E9DDnLPzG4gFs3K8JHs).
> The active Design System file is krtNgOD3jL5U6WmUMT32u6.
> For all design system context, read pd/CLAUDE.md instead.
# FIGMA_DESIGN_SYSTEM.md
# Vanguard Constellation Design System Rules

> Generated from Figma file **"Vanguard Constellation — Design System"**
> File key: `vo5E9DDnLPzG4gFs3K8JHs`
> Source: Notion page 14 — Design system (Constellation / c11n)
> Tokens extracted via DevTools shadow DOM inspection of the live Vanguard portal.
> Generated: 2026-04-13

---

## Overview

The Vanguard portal is built on **Constellation** (internal codename `c11n`), a proprietary design system delivered as Stencil.js web components with shadow DOM encapsulation. All component tags are prefixed `c11n-web-v1-` or `c11n-web-b8-`. Navigation is a separate micro-frontend (`VG-VGN-NAV`) from `n4v.web.vanguard.com`. Page widgets use the `GYD-*` prefix. This document is the canonical source of truth for implementing Constellation tokens in AI-generated screens for the Sell & Rebalance tool (PD Step 3).

---

## 1. Design System Structure

### Token Definitions

All tokens are extracted from computed styles of rendered web components. They live in:

- **CSS custom properties** on `:host` and `:root` of shadow DOM components
- **Class-based color schemes** (`c11n-color-scheme--dark`)
- **Inline computed styles** on rendered HTML elements

No separate token file (e.g., `tokens.json`) exists in the public codebase — tokens are consumed directly as CSS variables or class utilities.

**Token naming convention:**
```
c11n-{type}-{scale}        # e.g. c11n-text-sm, c11n-badge__counter
--{property}-{modifier}    # e.g. --active-segment-bg, --trackcolor1
```

---

## 2. Color Tokens

### 2.1 Core Colors

| Figma Style Name | Hex / RGB | Usage |
|---|---|---|
| `Core/ink-800` | `rgb(4, 5, 5)` / `#040505` | Primary text, borders, icons (398 elements) |
| `Core/white` | `rgb(255, 255, 255)` / `#ffffff` | Header/card backgrounds, on-dark text |
| `Core/ink-300` | `rgb(113, 119, 119)` / `#717777` | Secondary text, labels, "Personal investors" subtitle |
| `Core/link-blue` | `rgb(20, 91, 255)` / `#145bff` | Primary hyperlinks, skip-nav |
| `Core/error-red` | `rgb(194, 0, 41)` / `#c20029` | Messages badge background |
| `Core/badge-border` | `rgb(245, 246, 246)` / `#f5f6f6` | Badge ring/border |
| `Core/divider` | `rgb(232, 233, 233)` / `#e8e9e9` | Header internal divider at y:72 |
| `Core/footer-dark-bg` | `rgb(4, 5, 5)` / `#040505` | Dark footer (`c11n-color-scheme--dark`) |

### 2.2 CSS Variable Tokens

| Figma Style Name | Value | Usage |
|---|---|---|
| `CSS Vars/active-segment-bg` | `#00bda3` | Active segment / selected state |
| `CSS Vars/trackcolor1` | `#007873` | Slider active track (teal) |
| `CSS Vars/trackcolor2` | `#def5f0` | Slider inactive track (light teal) |
| `CSS Vars/border-color` | `#def5f0` | Component border |
| `CSS Vars/background-color` | `#ffffff` | Component background default |
| `CSS Vars/modal-bg-color` | `#f6f8f1` | Modal/overlay background (off-white green) |
| `CSS Vars/chip-bg-color` | `#bbcf9c` | Chip/tag default background (light olive) |
| `CSS Vars/chip-alt-bg-color` | `#556b33` | Chip/tag alt background (dark olive) |
| `CSS Vars/chip-alt-fg-color` | `#ffffff` | Chip/tag alt foreground |
| `CSS Vars/progress-color` | `#ba3d21` | Progress indicator / error state |
| `CSS Vars/default-label-color` | `#040505` | Form label default |
| `CSS Vars/thumbbg` | `#ffffff` | Slider thumb background |
| `CSS Vars/thumbhoverbg` | `#ffffff` | Slider thumb hover |

### 2.3 Color Scheme Classes

| Figma Style Name | Background | Text | Applied via |
|---|---|---|---|
| `Color Scheme/light-background` | `#ffffff` | `#040505` | Default (all content areas) |
| `Color Scheme/light-text` | — | `#040505` | Default text |
| `Color Scheme/dark-background` | `#040505` | `#ffffff` | `.c11n-color-scheme--dark` |
| `Color Scheme/dark-text` | — | `#ffffff` | `.c11n-color-scheme--dark` links/text |

### 2.4 Form / Extended Tokens (Section 12)

| Figma Style Name | Value | Usage |
|---|---|---|
| `Form/ink-600` | `rgb(63, 68, 68)` / `#3f4444` | Disabled state, muted labels (between ink-800 and ink-300) |
| `Form/disabled-border` | `rgb(203, 206, 206)` / `#cbcece` | Border on disabled/inactive elements |
| `Form/warning-amber` | `rgb(255, 173, 0)` / `#ffad00` | Warning/caution — Wait & Save interrupt |

---

## 3. Typography

### 3.1 Font Family

```
Primary:   "FF Mark", Arial, sans-serif   — all body, UI, nav text
Secondary: Univers-Basic-Regular, -apple-system, BlinkMacSystemFont, "Segoe UI"  — legacy nav only
```

> **Figma note:** FF Mark is a licensed commercial font not available in Figma's system font library. All Figma text styles use **Inter** as a structural substitute. When implementing in production HTML/CSS, substitute Inter → FF Mark.

### 3.2 Type Scale

| Figma Style Name | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `Type Scale/xs` | 11px | 12px | 700 (Bold) | Badge counter, `Last login:` timestamp |
| `Type Scale/sm` | 14px | 20px | 400 (Regular) | `c11n-text-sm` — utility labels, nav labels, footer links |
| `Type Scale/sm-bold` | 14px | 20px | 700 (Bold) | Sub-headings, footer column headings, CTA button text |
| `Type Scale/base` | 17px | 25.5px | 400 (Regular) | Body text, default paragraph |
| `Type Scale/base-bold` | 17px | 24px | 700 (Bold) | Nav tabs (all states), interactive labels, button labels |
| `Type Scale/md` | 23px | 32px | 800 (Extra Bold) | Footer name display |
| `Type Scale/lg` | 28px | auto | 900 (Black) | Section headings ("Accounts", "Tax forms") |
| `Type Scale/xl` | 34px | auto | 900 (Black) | Page-level headings |

### 3.3 Font Weight Mapping

| Weight | Inter Style | Usage |
|---|---|---|
| 400 | Regular | Body, labels, default interactive |
| 700 | Bold | Nav tabs, bold labels, footer headings, CTA button text |
| 800 | Extra Bold | Name display, emphasized headings |
| 900 | Black | Section headings, page titles |

---

## 4. Component Library

All components are in the Figma file `vo5E9DDnLPzG4gFs3K8JHs` across two pages.

### Page: "6 — Navigation & Layout"

#### `Header/Global Header`
```
Tag:          HEADER inside VG-VGN-NAV shadow root
Class:        position-relative c11n-elevation-100 persistentSticky-AUBqeQrY
Height:       137px (desktop, 1614px viewport)
Width:        Full viewport (1440px canonical)
Background:   rgb(255, 255, 255)
Box shadow:   rgba(4,5,5,0.06) 0 0 4px 1px, rgba(4,5,5,0.18) 0 1px 1px 0
z-index:      3200
Position:     sticky
Internal:     Row 1 (y:0–72) = logo + utility icons
              Divider at y:72 = 1px rgb(232,233,233)
              Row 2 (y:72–137) = L1 navigation tabs
```

#### `Nav/Utility Icons Row`
```
Five labeled icon buttons (DIV.c11n-text-sm.labeled-button-container__label)
Font:         14px / 400 / rgb(4,5,5) / line-height 20px
y-position:   38px (centered in header top row)
Labels:       Search(x:993), Support(x:1065), Messages(x:1144),
              Documents(x:1235), Profile(x:1337), Log off(x:1405)
Messages badge: 18×18px, bg rgb(194,0,41), text white, 11px/700,
              border-radius 12px, border 2px solid rgb(245,246,246)
```

#### `Nav/Secondary L2 Navigation`
```
Tag:          A.c11n-nav-item (GYD-SECONDARY-NAV-WIDGET)
Font:         17px / 700 / rgb(4,5,5) / line-height 24px
Height:       48px per tab
Gap:          24px between all tabs
Background:   transparent (both states)
Active:       CSS pseudo-element underline (::after) — not border-bottom
Active class: c11n-nav-item active  (ariaCurrent="true")
Tabs:         Dashboard(91px), Balances(74px), Holdings(72px),
              Activity(65px), Performance(106px), Portfolio Watch(132px)
```

#### `Hero/Greeting Banner`
```
Tag:          GYD-GREETINGS-WIDGET (shadow root)
Text color:   rgb(255,255,255) — white on dark/SVG background
Background:   SVG image (not plain color — set in shadow root CSS)
Last login:   11px / 400 / white  (class: c11n-link__content)
H1:           visually hidden (height:1px) — a11y only
```

#### `Button/Primary — On Light`
```
Class:        c11n-button c11n-button--medium c11n-button--primary
Height:       48px
Border-radius: 32px (pill)
Background:   rgb(4, 5, 5)
Color:        rgb(255, 255, 255)
Padding:      9px 22px 11px (asymmetric — accommodates FF Mark descender)
Label:        SPAN.c11n-button__label  17px / 700
Usage:        "Remove restrictions", "OK", "Yes, exit", "Sell additional funds"
```

#### `Button/Primary — On Dark`
```
Background:   rgba(0,0,0,0) — transparent
Border:       2px solid rgb(255,255,255)
Color:        rgb(255,255,255)
Height/radius: same as on-light (48px / 32px pill)
Usage:        Pill outline on dark footer/banner
```

#### `Button/Secondary`
```
Class:        c11n-button c11n-button--medium c11n-button--secondary
Background:   rgba(0,0,0,0) — transparent
Border:       2px solid rgb(4,5,5)
Color:        rgb(4,5,5)
Height/radius: same (48px / 32px pill)
Usage:        "Cancel", "No, continue order", "Edit order", "Back"
```

#### `Nav/Back Link`
```
Component:    c11n-link with left-arrow icon
Font:         17px / Regular / rgb(4,5,5)
Pattern:      "← Back to Portfolio Watch"
```

#### `Dividers/All Variants`
```
Header internal:  1px rgb(232,233,233)    at y:72 in header
Content area HR:  0.667px solid rgb(4,5,5)  section dividers
Footer top:       1px rgb(4,5,5)            separates content from dark footer
```

#### `Footer/Dark Region`
```
Class:            c11n-color-scheme--dark
Background:       rgb(4, 5, 5)
Text/links:       rgb(255,255,255)
Link decoration:  underline 1px
Font:             14px / 17px
Content margin:   159px left (consistent with all content areas)
```

---

### Page: "12 — Transaction Form Components"

#### `Form/Dollar Amount Input`
```
Tag:          INPUT[type=text].amountInput.touched.c11n-input__input
Dimensions:   599 × 48px
Border:       0.667px solid rgb(4,5,5)
Border-radius: 0px — SQUARE (no rounding on any Vanguard input)
Background:   rgb(255,255,255)
Font:         17px / 400
Placeholder:  "$"
Label above:  17px / 400 / rgb(113,119,119)
Key:          All Vanguard text inputs use square borders. Sub-pixel border on Retina.
```

#### `Form/Account Selector Dropdown`
```
Tag:          SINGLE-SELECT-DROPDOWN.account-selector-dropdown
Inner:        DIV.c11n-select__container > SELECT
Chevron:      C11N-WEB-V1-ICON.c11n-select__icon — 14px wide
Dimensions:   851 × 48px
Border:       0.667px solid rgb(4,5,5)
Border-radius: 0px
Label:        LABEL.account-selector-label — 17px / rgb(113,119,119)
```

#### `Form/Radio Button Group`
```
Tags:         C11N-RADIO-GROUP > C11N-RADIO.c11n-radio
Input:        INPUT[type=radio].c11n-radio__input — 13×13px, transparent bg
Label:        SPAN.c11n-radio__label-content — 17px / 400 / rgb(4,5,5)
Layout:       2-column grid, 298px × 2 within 596px container
Options:      Minimum tax (MinTax) 121px, SpecID 48px, HIFO 69px, FIFO 43px
Hidden legend: LEGEND.c11n-radio-group__legend--hidden (a11y)
```

#### `Form/Segmented Control`
```
Tag:          C11N-SEGMENTED-CONTROL
Input:        INPUT[type=radio].c11n-segmented-control__segment-input
Label:        DIV.toggle-label — 17px / 400
Options:      "shares" / "dollars"
Active bg:    #00bda3 (--active-segment-bg)
Height:       64px (4rem, --segment-height)
Font size:    14px (0.875rem, --segment-font-size)
Usage:        "Sell in" toggle; any binary/ternary selector
```

#### `Form/Checkbox`
```
Tag:          C11N-CHECKBOX
Input:        INPUT[type=checkbox].c11n-checkbox__input — 13×13px
Label:        SPAN.c11n-checkbox__label-content — 17px / 400
Example:      "Sell all shares"
```

#### `Form/Field Label`
```
Tag:          LABEL
Font:         17px / 400 / rgb(113,119,119)
Note:         Labels use SECONDARY text color — visually subordinate to field values
Examples:     "Account", "Amount"
```

#### `Form/Error State`
```
Container:    LABEL.input-error-group
Inputs wrap:  DIV.input-error-group__inputs
Hint:         SPAN.c11n-hint-error__container > SPAN.c11n-hint-error__hint
Error color:  rgb(186, 61, 33) (#ba3d21 — --progress-color)
Pattern:      Input border turns error-red; hint text appears below
```

#### `Button/Icon Button (Small)`
```
Dimensions:   32×32px
Border-radius: 32px (circle)
Color:        rgb(113,119,119)
Usage:        Close/dismiss actions
```

#### `Button/Tooltip Trigger`
```
Dimensions:   24×24px
Border-radius: 50% (circle)
Padding:      5px
Usage:        Field label tooltips
```

---

## 5. Spacing & Layout

```
Content left margin:    159px (consistent across all pages)
Header height:          137px desktop / 64px mobile
Nav preload height:     137px desktop / 64px mobile
Tab gap (L2 nav):       24px between all tabs
Header divider y-pos:   72px (within 137px header)
```

---

## 6. Frameworks & Libraries

The Vanguard portal uses:
- **Stencil.js** web components with shadow DOM encapsulation
- **CSS custom properties** for theming
- Component tags: `c11n-web-v1-*`, `c11n-web-b8-*`
- Navigation micro-frontend: `VG-VGN-NAV` from `n4v.web.vanguard.com`
- Dashboard widgets: `GYD-*` prefix

> The Sell & Rebalance AI tool is a **standalone web app** that mimics Constellation visually but does NOT import the actual `c11n` library. Implement all styles as standard CSS/Tailwind using the token values above.

---

## 7. Icon System

- Icons rendered as `C11N-WEB-V1-ICON` web components
- Shadow DOM encapsulated — not directly styleable
- Utility icon bar uses `DIV.c11n-text-sm.labeled-button-container__label` (text labels)
- For AI tool implementation: use inline SVG or icon font that matches Constellation icon shapes

---

## 8. Styling Approach

- **No CSS Modules / Styled Components** — raw CSS custom properties in shadow DOM
- Global theme via `c11n-color-scheme--dark` class on container elements
- Typography via utility classes (`c11n-text-sm`, `c11n-text-base`, etc.)
- Responsive breakpoints: desktop 1614px canonical, mobile 64px nav height
- **Sub-pixel borders:** `0.667px` on inputs (renders as 1px physical on Retina)

---

## 9. Asset Management

- Background images delivered as SVG via shadow DOM CSS (not inspectable from computed styles)
- Logo: standard Vanguard wordmark at x:159 in header
- Badge counts: live data rendered in `SPAN.c11n-badge__counter`

---

## 10. Implementation Rules for AI Screen Generation (PD Step 3)

When generating Figma Make screens or HTML mockups for the Sell & Rebalance tool:

1. **Font:** Use FF Mark (or Inter as placeholder). Never use system-ui or Roboto.
2. **Inputs:** Always `border-radius: 0` — square corners. No rounded inputs.
3. **Buttons:** Always `border-radius: 32px` pill shape. Height 48px. Asymmetric padding `9px 22px 11px`.
4. **Colors:** Use ink-800 (`#040505`) for primary text — not pure black (`#000000`).
5. **Labels:** Form field labels use ink-300 (`#717777`) — visually subordinate.
6. **Active nav:** L2 nav active state is a CSS `::after` underline, not a border.
7. **Error color:** Use `#ba3d21` (progress-color), not error-red (`#c20029`). Error-red is badges only.
8. **Warning:** Use warning-amber `#ffad00` for Wait & Save interrupt / caution states.
9. **Dark sections:** Apply `c11n-color-scheme--dark` pattern — solid `#040505` bg, white text with `underline 1px` on links.
10. **Content margin:** Left-align all content at `159px` from viewport edge on desktop.

---

## 11. Figma File Reference

| Resource | Value |
|---|---|
| File name | Vanguard Constellation — Design System |
| File key | `vo5E9DDnLPzG4gFs3K8JHs` |
| File URL | https://www.figma.com/design/vo5E9DDnLPzG4gFs3K8JHs |
| Color styles | 28 styles across Core, CSS Vars, Color Scheme, Form groups |
| Text styles | 8 styles (xs, sm, sm-bold, base, base-bold, md, lg, xl) |
| Components (Sec 6) | 10 frames on page "6 — Navigation & Layout" |
| Components (Sec 12) | 9 frames on page "12 — Transaction Form Components" |
| Source | Notion page 14 — `341dcac9574a8171a21bc681ca4190ae` |
