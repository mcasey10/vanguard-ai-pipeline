# PD Phase — Product Design

This directory contains artifacts from the Product Design phase of the Vanguard AI Pipeline project.

**Timeline:** April 13 – June 17, 2026  
**Role:** Product Designer (AI-assisted)  
**Tools:** Claude.ai (Projects), Figma MCP, Claude Code

## Artifacts

| File | Description |
|------|-------------|
| `FIGMA_DESIGN_SYSTEM.md` | Design system reference extracted from Vanguard's live portal DevTools — tokens, typography, spacing, color |
| `CLAUDE.md` | Dev handoff context used by Claude Code during the Dev phase |
| `dev_handoff_prompt.md` | Prompt used to initiate Dev phase with full design context |
| `pd_decisions_log.html` | All PD phase decisions with rationale |

## Figma artifacts

| Frame | Description | Node |
|-------|-------------|------|
| FS-ENTRY-1 | Fund Selection entry screen (mode toggle) | — |
| FS-AUTO-1 | Fund Selection automated mode | — |
| FS-MANUAL-1 | Fund Selection manual mode (fund list) | — |
| FS-MANUAL-2 | Fund Selection manual mode (lot details expanded) | — |
| SC-1 | Scenario Analysis | — |
| OC-1 | Order Confirmation | 628:26277 |
| ES-1-rev | Execution Summary (post-handoff revision) | 833:2953 |
| L1 nav / L2 nav | Navigation shell frames | — |

Figma file: `jz82GrOp8RE2QGh81V0qbs`

## Key design decisions

- **Dual-mode toggle:** Automated (AI optimization) vs Manual (direct lot selection) — both modes share the same fund list and lot detail panels
- **Cost basis method selector:** Shown per fund row in Manual mode — drives tax calculation logic
- **Scenario Analysis:** Compares multiple optimization priority configurations side by side before order placement
- **Gain/loss color convention:** Positive gains = `#007A00` (green), negative losses = `#C8102E` (red) — applied consistently across SC-1, OC-1, ES-1-rev, and FS transaction history
- **33-component Figma library:** Extracted from Vanguard portal DevTools; tokens imported as Figma variables

## Post-handoff revision

ES-1-rev (Execution Summary) was revised after Dev testing revealed the original ES-1 frame was missing transaction-level context. A Transaction Summary section was added at the top of the screen showing the funds sold, amounts, and gain/loss per fund. The revised frame is ES-1-rev and is the reference frame for all Dev implementation.

## Notion workspace

PD decisions log and design system: https://www.notion.so/Vanguard-Sell-Rebalance-PRD-33edcac9574a808da907cc9decefb512
