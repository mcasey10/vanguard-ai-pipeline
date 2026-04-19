# Functional Requirements

---

## Section 1: Global Requirements

---

### 1.1 Portfolio Data

**REQ-G-001:** At session initiation, the system must load the user's complete portfolio holdings across all eligible accounts, including: fund name, fund type (equity/bond/other), current balance (shares and dollar value), target allocation weight per fund, and current actual allocation weight.
Priority: Must
Source: Step A2, Step B1

**REQ-G-002:** The system must load cost basis data for all holdings, including: all open lots per fund, acquisition date per lot, cost basis per share per lot, current fair market value per lot, holding period classification (short-term or long-term) per lot, and unrealized gain or loss per lot.
Priority: Must
Source: Step B2, Optimization Engine

**REQ-G-003:** The system must identify and apply all available accounting methods for each fund: FIFO, average cost, and specific lot identification. The accounting method available for a given fund must reflect what is permissible under current IRS rules and Vanguard's account-type constraints.
Priority: Must
Source: PM Decision 5, Step B3
⚠️ REVIEW: Accounting method availability varies by account type (taxable vs. IRA) and by prior elections. Displaying or applying an unavailable method is a compliance risk.

**REQ-G-004:** Portfolio data loaded at session initiation must reflect end-of-prior-business-day valuations at minimum. If intraday pricing is available, the system should display the data freshness timestamp and update balances accordingly.
Priority: Should
Source: Non-functional requirements context, Step A2

**REQ-G-005:** The system must identify the user's target allocation (equity/bond split and fund-level weights) as stored in Vanguard's portfolio settings. If no target allocation is on record, the system must degrade gracefully to tax-only optimization mode, surface a prominent notice that portfolio balancing is inactive, and provide inline access to a simplified allocation editor. The editor must default to a 50/50 equity/bond split and must be editable directly without routing the user through the full Vanguard allocation wizard.
Priority: Must
Source: PM Decision 7
⚠️ REVIEW: Displaying or implying a rebalancing recommendation when no target allocation exists may constitute financial advice. The tax-only fallback mode and the inline allocation editor must be reviewed by compliance before implementation.

**REQ-G-006:** All portfolio data loaded at session initiation must persist in memory for the full session, including across workflow switches between Workflow A and Workflow B, and into the Scenario Comparison view.
Priority: Must
Source: Amendment 2 (back-navigation), Step B1

---

### 1.2 Tax Assumption Display and Bracket Selection

**REQ-G-007:** The system must display the active capital gains rate assumptions at all stages of both workflows where tax impact is shown. Default assumptions are: short-term capital gains rate 24%, long-term capital gains rate 15%.
Priority: Must
Source: PM Decision 5, Step A3

**REQ-G-008:** The system must present default assumptions with the income range they correspond to, stated in plain language (e.g., "Based on income between $X and $Y").
Priority: Must
Source: PM Decision 5

**REQ-G-009:** The system must provide access to a complete rate table showing all capital gains brackets by income range. The table must be collapsed by default and expandable on demand.
Priority: Must
Source: PM Decision 5

**REQ-G-010:** The user must be able to select any income bracket from the rate table without entering exact income. Selection must update all tax impact calculations immediately across the active workflow and any saved scenarios.
Priority: Must
Source: PM Decision 5, Step A3

**REQ-G-011:** When the user has selected a non-default bracket, the system must persist that selection for the duration of the session and apply it consistently across all tax impact calculations, scenario comparisons, and the pre-execution summary.
Priority: Must
Source: PM Decision 5

**REQ-G-012:** The tax assumption display must include a single-line advisory notice in all views where tax impact figures are shown: *"For complex tax situations, we recommend reviewing this output with a tax professional before executing."*
Priority: Must
Source: PM Decision 5, Step A3
⚠️ REVIEW: The exact wording of this notice requires legal and compliance approval. It must not constitute a disclaimer of fiduciary responsibility in a way that conflicts with Vanguard's regulatory obligations.

---

### 1.3 YTD Realized Gains Summary

**REQ-G-013:** The system must retrieve and display the user's year-to-date realized capital gains for the current tax year, separated into short-term and long-term categories.
Priority: Must
Source: PM Decision 5, Step A3

**REQ-G-014:** The YTD realized gains summary must be displayed in conjunction with the projected incremental tax impact of the planned sale, so the user can see the cumulative effect of the planned transaction on their annual gain/loss position.
Priority: Must
Source: PM Decision 5, Step A3

**REQ-G-015:** If YTD realized gains data is unavailable or cannot be retrieved, the system must surface a notice indicating this and proceed without the summary rather than blocking the workflow.
Priority: Must
Source: Step A3

---

### 1.4 RMD Detection and Notice Display

**REQ-G-016:** The system must identify any accounts held by the user that are subject to Required Minimum Distribution rules for the current tax year.
Priority: Must
Source: PM Decision 5, Step A3
⚠️ REVIEW: RMD identification logic must account for account type, account holder age, and applicable IRS rules for the current year. Incorrect RMD identification or failure to surface an RMD requirement is a compliance risk.

**REQ-G-017:** For any account subject to an RMD, the system must display: the total RMD required for the current year, the amount already distributed year-to-date, and the remaining RMD balance required before year-end.
Priority: Must
Source: PM Decision 5, Step A3
⚠️ REVIEW: RMD calculations and remaining balance figures must be sourced from authoritative account data and not estimated. Displaying an incorrect RMD balance could result in the user under-distributing and incurring IRS penalties.

**REQ-G-018:** The RMD notice must be displayed as an informational callout. It must not block workflow progression or be presented as a required action.
Priority: Must
Source: PM Decision 5, Step A3

---

### 1.5 Coach Mark System

**REQ-G-019:** The system must implement a coach mark layer providing contextual guidance at defined high-complexity or high-stakes steps. Coach marks must be visible and active during a user's first session with the tool.
Priority: Must
Source: PM Decision 4, Segment D annotations

**REQ-G-020:** After first-session completion, coach marks must be hidden by default in all subsequent sessions. A persistently accessible control (e.g., "Show tips" or help icon) must allow the user to re-activate coach marks on demand in any subsequent session.
Priority: Must
Source: PM Decision 4

**REQ-G-021:** Coach marks must be defined for the following steps at minimum: Step A3 (tax assumption screen, first-session users), Step B1 (fund data table column definitions), Step B2 (allocation drift indicators, harvestable loss indicators), Step B3 (real-time tax impact recalculation).
Priority: Must
Source: PM Decision 4, Segment D journey annotations

**REQ-G-022:** Coach marks must not obstruct primary workflow controls or data. They must be dismissible individually and collectively.
Priority: Must
Source: PM Decision 4

---

### 1.6 Session Persistence

**REQ-G-023:** The system must persist saved scenarios within a session across workflow switches, browser refreshes, and brief interruptions up to the session timeout threshold. Session timeout is aligned with the Vanguard portal standard of 5–10 minutes of inactivity and will be finalized when authentication is in scope.
Priority: Must
Source: PM Decision 8, Step B4, Scenario Comparison

**REQ-G-024:** Incomplete sessions — defined as sessions in which a withdrawal amount was entered but no transaction was executed — must be flagged for returning user entry (see REQ-G-026).
Priority: Should
Source: Step A1 design annotation

**REQ-G-025:** The Workflow A recommendation must be held in memory for the full session regardless of any Workflow B activity. No action in Workflow B may overwrite or invalidate the stored Workflow A recommendation.
Priority: Must
Source: Amendment 2, Step B1, Step B2

---

### 1.7 Returning User Deep-Link Entry

**REQ-G-026:** Users with a prior session on record must be offered a direct entry path that bypasses the tool entry screen and lands at the withdrawal amount entry step (Step A2), with prior session context surfaced.
Priority: Should
Source: Step A1 design annotation

**REQ-G-027:** The deep-link entry label must be contextually appropriate: *"Continue where you left off"* for incomplete prior sessions; *"Start a new withdrawal"* for users whose prior session was completed.
Priority: Should
Source: Step A1 design annotation

**REQ-G-028:** The full tool entry screen (Step A1) must remain accessible as a secondary path for returning users who wish to re-read the tool description or begin a session without prior context loaded.
Priority: Must
Source: Step A1 design annotation

**REQ-G-029:** The deep-link entry path must be suppressed for returning users whose prior session lasted fewer than 5 minutes and resulted in no saved scenario. Users meeting this threshold must be shown the full tool entry screen instead.
Priority: Should
Source: PM Decision 9

---

## Section 2: Workflow A — System-Guided Requirements

---

### Step A1 — Tool Entry

**REQ-A1-001:** The tool entry screen must display a single-sentence description of the tool's function in plain language, with no financial jargon.
Priority: Must
Source: Step A1, Segment D

**REQ-A1-002:** A visible link or control labeled "I'd rather enter amounts manually" (or equivalent) must be present on the entry screen and must navigate the user to Workflow B.
Priority: Must
Source: Step A1, PM Decision 2

**REQ-A1-003:** The entry screen must not require any input from the user before they can proceed.
Priority: Must
Source: Step A1, Segment C

---

### Step A2 — Withdrawal Amount Entry

**REQ-A2-001:** The system must accept a single dollar amount as the target withdrawal input. No other inputs may be required at this step.
Priority: Must
Source: PM Decision 2, Step A2

**REQ-A2-002:** Upon amount entry, the system must display the user's total current investable portfolio balance and the entered withdrawal amount expressed as a percentage of that balance.
Priority: Must
Source: Step A2

**REQ-A2-003:** If the entered withdrawal amount exceeds 10% of total portfolio value, the system must display a soft informational notice acknowledging the significance of the amount and confirming that the tool will account for it. This notice must not block progression.
Priority: Should
Source: Step A2

**REQ-A2-004:** The system must begin loading portfolio and cost basis data silently upon amount entry, in preparation for the recommendation calculation. A loading indicator must be displayed only if the calculation time exceeds a defined threshold (recommended: 3 seconds).
Priority: Must
Source: Step A2

**REQ-A2-005:** The system must default the withdrawal destination to the user's linked settlement account and display this assumption visibly. The user must be able to modify the destination before proceeding.
Priority: Must
Source: Step A2

**REQ-A2-006:** The Workflow B navigation control must remain visible and accessible at this step.
Priority: Must
Source: PM Decision 2

---

### Step A3 — Tax Assumption Display and Optional Refinement

**REQ-A3-001:** The tax assumption display (per REQ-G-007 through REQ-G-012), YTD realized gains summary (per REQ-G-013 through REQ-G-015), and RMD notice (per REQ-G-016 through REQ-G-018) must all be presented at this step before the recommendation is generated.
Priority: Must
Source: PM Decision 5, Step A3

**REQ-A3-002:** The projected incremental tax impact of the entered withdrawal amount at the active rate assumptions must be displayed at this step. This figure must update immediately if the user changes their bracket selection.
Priority: Must
Source: Step A3, PM Decision 5

**REQ-A3-003:** The step must be passable without any user action — the defaults must be complete enough to generate a recommendation without modification. The visual design must make clear that proceeding without adjustment is explicitly acceptable.
Priority: Must
Source: Step A3, Segment C

**REQ-A3-004:** First-session coach marks must be active at this step, specifically covering: what the default rate assumptions mean, how to change them, and what the YTD summary represents.
Priority: Must
Source: REQ-G-021, Segment D

---

### Step A4 — System Recommendation Generation

**REQ-A4-001:** The system must generate and display a recommendation specifying: which funds to sell, the dollar amount to sell from each fund, the accounting method applied, the resulting portfolio allocation post-sale compared to target, and the projected tax impact at the active rate assumption.
Priority: Must
Source: Step A4, Optimization Engine Section

**REQ-A4-002:** The default recommendation display must be a summary view. Lot-level detail and optimization scoring must be available via progressive disclosure but must not be shown by default. Progressive disclosure must reveal pre-computed detail immediately with no perceptible delay.
Priority: Must
Source: PM Decision 1, Step A4, Conflict Resolution 1

**REQ-A4-003:** The recommendation summary must include a single plain-language rationale sentence explaining the primary logic of the recommendation. This sentence must not contain financial jargon and must reference at least one of the two optimization dimensions (tax impact or allocation).
Priority: Must
Source: Step A4, Segment D, Segment C

**REQ-A4-004:** The progressive disclosure layer must show: how the recommendation scored on the tax optimization dimension, how it scored on the allocation dimension, and lot-level detail for any fund where specific identification was applied.
Priority: Must
Source: PM Decision 1, Step A4, Segment A

**REQ-A4-005:** The system must display a loading state during recommendation generation if computation time exceeds 3 seconds. The loading state must be accompanied by a brief reassuring message (e.g., "Reviewing your portfolio to find the best approach").
Priority: Should
Source: Step A4, Segment C

**REQ-A4-006:** When the tax-optimal recommendation produces meaningful allocation drift from the user's target, the system must surface a notice within the recommendation view informing the user of this tradeoff. The notice must include an action allowing the user to request an alternative recommendation that prioritizes portfolio balance over tax efficiency, without leaving Workflow A.
Priority: Must
Source: PM Decision 6

**REQ-A4-007:** The alternative balance-prioritized recommendation (requested per REQ-A4-006) must be generated and displayed within Workflow A without requiring the user to navigate to Workflow B or the Scenario Comparison view.
Priority: Must
Source: PM Decision 6

---

### Step A5 — Recommendation Review and Action Selection

**REQ-A5-001:** The system must present three clearly labeled action paths following the recommendation: execute, adjust manually (Workflow B), and save as scenario for comparison.
Priority: Must
Source: Step A5, PM Decision 2

**REQ-A5-002:** The execute action must be the visually primary action. The save-and-compare and adjust-manually paths must be present but must not compete with execute for visual prominence.
Priority: Must
Source: Step A5, Segment C

**REQ-A5-003:** Selecting "Adjust manually" must transfer the Workflow A recommendation to Workflow B as pre-populated starting amounts. The pre-populated values must be visually distinct from blank or user-entered values.
Priority: Must
Source: Step A5, Step B1

**REQ-A5-004:** Selecting "Save as Scenario and compare" must save the current recommendation as Scenario 1 and navigate to the Scenario Comparison view or prompt the user to generate an alternative scenario.
Priority: Must
Source: Step A5, Convergence

**REQ-A5-005:** The Workflow A recommendation must be stored in session memory from this point forward and must not be affected by any subsequent Workflow B activity.
Priority: Must
Source: Amendment 2, REQ-G-025

---

### Step A6 — Execution Confirmation

**REQ-A6-001:** The pre-execution confirmation screen must display: funds to be sold and amounts, estimated proceeds, projected tax impact at active rate assumption, destination account, estimated settlement timeline, and the tax professional advisory notice.
Priority: Must
Source: Step A6
⚠️ REVIEW: Estimated proceeds and tax impact figures presented at confirmation must be clearly labeled as estimates. Final tax liability is determined at filing. Presenting estimated figures as definitive is a compliance risk.

**REQ-A6-002:** The confirmation screen must require an affirmative user action before the transaction is submitted. Passive continuation (e.g., auto-advance after a timer) is not permitted.
Priority: Must
Source: Step A6
⚠️ REVIEW: Affirmative confirmation requirements may be subject to Vanguard's existing transaction authorization standards. The confirmation mechanism must be reviewed against those standards.

**REQ-A6-003:** The confirmation screen must not introduce any information that was not visible in prior steps. No new data, calculations, or notices may appear for the first time at confirmation.
Priority: Must
Source: Step A6, Segment C

**REQ-A6-004:** After transaction submission, the system must display a confirmation screen showing: a transaction reference number, a plain-language summary of what was executed (funds sold, amounts, destination), and the active tax rate assumption used in the recommendation.
Priority: Must
Source: Step A6

**REQ-A6-005:** Cancellation from the confirmation screen must return the user to Step A5 with the recommendation intact and all session state preserved.
Priority: Must
Source: Step A6

---

## Section 3: Workflow B — Manual Requirements

---

### Step B1 — Workflow B Entry

**REQ-B1-001:** The Workflow B fund list must display the following columns for each fund: current balance, target allocation weight, current actual allocation weight, allocation drift indicator (over/underweight), cost basis by all available accounting methods, unrealized short-term gain/loss, unrealized long-term gain/loss, and a manual sell amount entry field.
Priority: Must
Source: Step B1

**REQ-B1-002:** When entering Workflow B from Workflow A Step A5, each fund's sell amount field must be pre-populated with the Workflow A recommended amount. Pre-populated values must be visually distinct from blank or user-entered values.
Priority: Must
Source: Step B1, Step A5

**REQ-B1-003:** When entering Workflow B directly (without a prior Workflow A recommendation), all sell amount fields must be blank.
Priority: Must
Source: Step B1

**REQ-B1-004:** The tax assumption display, YTD realized gains summary, and RMD notices (per global requirements) must be persistently visible throughout Workflow B.
Priority: Must
Source: Step B1

**REQ-B1-005:** A control labeled "Return to system recommendation" must be persistently visible at Step B1. Activating it must return the user to Step A5 with the Workflow A recommendation restored in full, unaffected by any Workflow B activity.
Priority: Must
Source: Amendment 2, Step B1

**REQ-B1-006:** First-session coach marks must be active at Step B1 entry, covering at minimum: what each data column represents, how to read allocation drift indicators, and how the pre-populated values were determined.
Priority: Must
Source: REQ-G-021, Segment D

---

### Step B2 — Fund and Lot Review

**REQ-B2-001:** Each fund row in the Workflow B list must be expandable to display lot-level detail: acquisition date, cost basis per share, current value per share, holding period classification, and the gain or loss that would be realized if that lot were sold.
Priority: Must
Source: Step B2

**REQ-B2-002:** The system must apply visual indicators to funds and lots meeting the following conditions: overweight relative to target allocation (sell candidate for rebalancing), harvestable loss present (opportunity to offset gains), and lot within 30 days of long-term holding period conversion (Wait & Save trigger, see REQ-B-W below).
Priority: Must
Source: Step B2

**REQ-B2-003:** Lot-level gain/loss figures must be calculated and displayed in real time when a lot row is expanded or hovered over. Calculations must reflect the active accounting method and the active tax rate assumption.
Priority: Must
Source: Step B2

**REQ-B2-004:** The "Return to system recommendation" control must be persistently visible at Step B2 with identical behavior to Step B1 (REQ-B1-005).
Priority: Must
Source: Amendment 2, Step B2

**REQ-B2-005:** Coach marks must be active at Step B2 for first-session users, covering at minimum: what "harvestable loss" means, what the overweight indicator means, and what the Wait & Save indicator means.
Priority: Must
Source: REQ-G-021, Segment D

---

### Wait & Save Interrupt

**REQ-B-W-001:** The system must detect any lot within any fund that is within 30 calendar days of converting from short-term to long-term holding period status.
Priority: Must
Source: Wait & Save branch

**REQ-B-W-002:** For each detected lot, the system must display a named interrupt notice at the fund or lot level including: the lot identifier, the number of days until long-term conversion, and the projected tax difference (in dollars) between selling now versus selling after conversion, at the active rate assumptions.
Priority: Must
Source: Wait & Save branch

**REQ-B-W-003:** The interrupt notice must present two actions simultaneously and visibly: "Exclude this lot" and a dismiss action explicitly labeled to communicate that dismissal means inclusion (e.g., "Include lot and continue" or "Proceed without excluding"). There is no ambiguous dismissal state — the dismiss action is defined as "include and proceed."
Priority: Must
Source: Wait & Save branch, Conflict Resolution 3

**REQ-B-W-004:** If the user elects to exclude the lot, the system must recalculate available sell amounts for the affected fund, update the running total, and surface a notice if the exclusion creates a shortfall against the target withdrawal amount.
Priority: Must
Source: Wait & Save branch

**REQ-B-W-005:** The interrupt notice must be dismissible in a single action. Single-action dismissal is explicitly defined as "include this lot and proceed." The dismiss control must be labeled to communicate this behavior unambiguously.
Priority: Must
Source: Conflict Resolution 3, Segment C
⚠️ REVIEW: The plain-language framing of the Wait & Save notice must be reviewed to ensure it does not constitute a tax advice recommendation. The notice must present a factual tradeoff, not a directive.

---

### Step B3 — Manual Amount Entry and Real-Time Tax Impact

**REQ-B3-001:** The system must accept sell amount entry at both the fund level and the lot level. Fund-level entry must trigger automatic lot selection according to the active accounting method.
Priority: Must
Source: Step B3

**REQ-B3-002:** The system must compute and display the following in real time as sell amounts are entered or modified: running total of sell amounts vs. target withdrawal amount, projected short-term gains to be realized, projected long-term gains to be realized, estimated total tax liability at active rate assumptions, and resulting portfolio allocation post-sale vs. target.
Priority: Must
Source: Step B3

**REQ-B3-003:** The active accounting method must be displayed and selectable at the fund level and at the lot level. Changing the accounting method must trigger immediate recalculation of all tax impact figures for the affected fund.
Priority: Must
Source: Step B3
⚠️ REVIEW: Accounting method changes mid-session must be validated against IRS rules and Vanguard account-type constraints. Certain method elections may not be changeable after a prior tax-year election has been made.

**REQ-B3-004:** A running tally of total sell amount vs. target withdrawal amount must be persistently visible and must update with each entry. A clear visual indicator must distinguish between: below target, at target, and above target states.
Priority: Must
Source: Step B3

**REQ-B3-005:** From Step B3 onward, the "Return to system recommendation" control must be replaced by "Save as scenario and compare." Activating this control must save the current manual configuration as a named scenario and navigate to the Scenario Comparison view. The Workflow A recommendation must remain in memory as a parallel scenario available for comparison.
Priority: Must
Source: Amendment 2, Step B3

**REQ-B3-006:** First-session coach marks must be active at Step B3, covering at minimum: what the real-time tax impact figure represents and why it changes as amounts are adjusted.
Priority: Must
Source: REQ-G-021, Segment D

---

### Step B4 — Save Scenario

**REQ-B4-001:** The system must allow the user to save the current manual configuration as a named scenario. The system must provide a default label. The user must be able to rename the scenario.
Priority: Must
Source: Step B4

**REQ-B4-002:** A saved scenario must store: fund selection, lot selection (if applicable), accounting method per fund, sell amounts, active tax rate assumption, projected tax impact, and resulting allocation.
Priority: Must
Source: Step B4

**REQ-B4-003:** After saving, the system must present two paths: navigate to the Scenario Comparison view, or proceed directly to execution confirmation.
Priority: Must
Source: Step B4

**REQ-B4-004:** An incomplete session — one in which a scenario has been saved but no transaction executed — must be preserved per REQ-G-023 and flagged for returning user entry per REQ-G-024.
Priority: Should
Source: Step B4, Segment D

---

## Section 4: Scenario Comparison Requirements

---

**REQ-SC-001:** The system must support up to three simultaneously saved scenarios in the comparison view. A fourth scenario may not be added until one existing scenario is deleted.
Priority: Must
Source: Scenario Comparison

**REQ-SC-002:** Scenarios may be any combination of Workflow A system-generated recommendations and Workflow B manual configurations. The comparison view must not distinguish between their origin in its display.
Priority: Must
Source: Convergence mechanism

**REQ-SC-003:** Each scenario column in the comparison view must display: fund-by-fund sell amounts, accounting method applied per fund, projected short-term gains realized, projected long-term gains realized, estimated total tax liability at active rate assumption, resulting portfolio allocation vs. target post-sale, and a plain-language tradeoff summary sentence.
Priority: Must
Source: Scenario Comparison

**REQ-SC-004:** The plain-language tradeoff summary sentence for each scenario must be generated by the system and must reference at least one concrete tradeoff between the tax and allocation dimensions (e.g., lower tax impact at the cost of residual allocation drift, or better balance at the cost of higher tax liability).
Priority: Must
Source: Scenario Comparison, Segment D

**REQ-SC-005:** The user must be able to return to Workflow B to modify any saved scenario from within the comparison view. Modifications must replace the existing scenario in the comparison — not create an additional scenario.
Priority: Must
Source: Scenario Comparison

**REQ-SC-006:** The user must be able to delete any scenario from the comparison view and replace it with a new one.
Priority: Must
Source: Scenario Comparison

**REQ-SC-007:** The user must be able to select any scenario to execute directly from the comparison view. Execution must proceed to the confirmation step with the selected scenario's fund and lot instructions populating the pre-execution summary.
Priority: Must
Source: Scenario Comparison

**REQ-SC-008:** All tax impact figures in the comparison view must update simultaneously if the user changes their active tax rate assumption.
Priority: Must
Source: REQ-G-010, Scenario Comparison

---

## Section 5: Execution and Confirmation Requirements

---

**REQ-EC-001:** The pre-execution confirmation screen must display: funds to be sold, sell amounts per fund, accounting method applied per fund, estimated gross proceeds, projected tax impact at active rate assumption, destination account, and estimated settlement timeline.
Priority: Must
Source: Step A6
⚠️ REVIEW: All figures on the confirmation screen must be clearly labeled as estimates where applicable. Legal must approve the language used to distinguish estimated from guaranteed figures.

**REQ-EC-002:** The tax professional advisory notice must appear on the confirmation screen.
Priority: Must
Source: PM Decision 5, Step A6

**REQ-EC-003:** The confirmation screen must require an explicit affirmative action from the user before the transaction is submitted. No passive or auto-advance confirmation mechanism is permitted.
Priority: Must
Source: Step A6
⚠️ REVIEW: Confirmation mechanism must comply with Vanguard's existing transaction authorization and electronic signature standards.

**REQ-EC-004:** The confirmation screen must not display any information, figure, or notice that was not already visible in a prior step during the same session.
Priority: Must
Source: Step A6, Segment C

**REQ-EC-005:** After successful transaction submission, the system must display a post-submission confirmation screen showing: a transaction reference number, a plain-language summary of what was executed (funds sold, amounts, destination), and the active tax rate assumption used in the recommendation.
Priority: Must
Source: Step A6

**REQ-EC-006:** Cancellation from the confirmation screen must return the user to the immediately preceding step (Step A5 for Workflow A, Step B4 or Scenario Comparison for other paths) with all session state — including saved scenarios and the Workflow A recommendation — fully preserved.
Priority: Must
Source: Step A6

**REQ-EC-007:** Transaction submission must be idempotent. Duplicate submission (e.g., from a double-tap or browser back/forward action) must be detected and prevented.
Priority: Must
Source: Step A6
⚠️ REVIEW: Idempotency mechanism must be reviewed against Vanguard's transaction processing infrastructure standards.

---

## Section 6: Optimization Engine Requirements

---

**REQ-OE-001:** The optimization engine must consume the following inputs: target withdrawal amount, portfolio holdings (all funds, all lots, all balances), target allocation weights per fund, cost basis per lot, holding period per lot, active capital gains rate assumptions (short-term and long-term), YTD realized gains (short-term and long-term), and RMD requirements per account (if applicable).
Priority: Must
Source: Step A4, PM Decision 5

**REQ-OE-002:** The optimization engine must pursue two objectives simultaneously: (1) minimize capital gains tax impact of the withdrawal at the active rate assumptions, and (2) move the portfolio allocation toward the user's target allocation. Default priority is tax efficiency. When the tax-optimal recommendation produces meaningful allocation drift, the system must surface a notice and offer the user the ability to request a balance-prioritized alternative within Workflow A.
Priority: Must
Source: PM Decision 6
⚠️ REVIEW: The definition of "meaningful allocation drift" used to trigger the tradeoff notice must be defined quantitatively and reviewed to ensure it does not constitute investment advice.

**REQ-OE-003:** The optimization engine must prefer long-term lots over short-term lots when selecting which lots to sell, all else being equal, in order to minimize short-term gain realization.
Priority: Must
Source: PM Decision 5, Optimization Engine

**REQ-OE-004:** The optimization engine must identify and prioritize any lots that have an unrealized loss, where selling would realize a loss that offsets other realized gains in the current tax year.
Priority: Must
Source: Step B2, HMW set

**REQ-OE-005:** The optimization engine must apply specific lot identification as the default accounting method when it produces a better tax outcome than FIFO or average cost, and when specific lot identification is permissible for the account type.
Priority: Must
Source: Step A4, REQ-G-003
⚠️ REVIEW: Automatic application of specific lot identification requires that this election is either already on file or can be made at time of sale. IRS and Vanguard rules governing method election must be confirmed before this requirement is implemented.

**REQ-OE-006:** The optimization engine must detect any lot within 30 days of long-term conversion and must account for this in its recommendation logic — either by excluding such lots from the recommendation or by explicitly noting the Wait & Save opportunity in the recommendation rationale.
Priority: Must
Source: Wait & Save branch, Step A4

**REQ-OE-007:** The engine must generate a plain-language rationale sentence for each recommendation. The rationale must: reference the primary driver of the recommendation (tax, rebalancing, or both), be free of financial jargon, and be accurate relative to the actual optimization logic applied.
Priority: Must
Source: Step A4, Segment C, Segment D
⚠️ REVIEW: The rationale sentence is a system-generated natural language output that describes a financial recommendation. Its accuracy, consistency, and potential to mislead must be reviewed before deployment. Any AI-generated component of this output requires disclosure review.

**REQ-OE-008:** The engine must compute the full progressive disclosure detail layer for every recommendation at generation time. This detail must be available immediately upon user request with no perceptible delay. Deferred computation of this layer is not permitted.
Priority: Must
Source: PM Decision 1, Conflict Resolution 1, Segment A

**REQ-OE-009:** The engine must generate a plain-language tradeoff summary sentence for each saved scenario in the Scenario Comparison view, describing the primary tradeoff between the tax and allocation dimensions for that scenario relative to the alternatives.
Priority: Must
Source: REQ-SC-004

**REQ-OE-010:** The optimization engine must not recommend selling from tax-advantaged accounts (traditional IRA, Roth IRA) in a manner that conflicts with the user's stated intent or that would trigger unintended tax consequences (e.g., Roth conversion events not initiated by the user).
Priority: Must
Source: REQ-G-003
⚠️ REVIEW: Selling logic across account types involves complex tax interactions. The engine's behavior across taxable and tax-advantaged accounts must be reviewed by tax and compliance teams before implementation.

---

## Post-Document Summary

---

### Resolved PM Decisions

**Decision 6 — Optimization objective priority ordering**
Default priority is tax efficiency. When the tax-optimal recommendation produces meaningful allocation drift, the system surfaces a notice and offers the user an inline action to request a balance-prioritized alternative recommendation within Workflow A, without requiring navigation to Workflow B or Scenario Comparison. This decision resolves REQ-OE-002 and drives REQ-A4-006 and REQ-A4-007.

**Decision 7 — Behavior when no target allocation is on record**
The tool degrades gracefully to tax-only optimization mode. A prominent notice informs the user that portfolio balancing is inactive. The tool provides inline access to a simplified allocation editor defaulting to a 50/50 equity/bond split, editable directly without the full Vanguard allocation wizard. This decision resolves the conflict between REQ-G-005 and REQ-OE-002 and updates REQ-G-005 accordingly.

**Decision 8 — Session timeout duration**
Deferred until authentication is in scope. Placeholder alignment with Vanguard portal standard of 5–10 minutes of inactivity. No finalized requirement can be written against this threshold until authentication is implemented. REQ-G-023 reflects this deferral.

**Decision 9 — Deep-link suppression threshold for low-engagement returning users**
The deep-link entry path is suppressed for returning users whose prior session lasted fewer than 5 minutes and resulted in no saved scenario. These users are shown the full tool entry screen. REQ-G-029 is updated to reflect this threshold.

---

### Resolved Requirement Conflicts

**Conflict 1 — REQ-A4-002 vs. REQ-OE-008 (progressive disclosure timing)**
Resolved: Optimization detail is computed at recommendation generation time, not deferred. The progressive disclosure layer reveals pre-computed detail immediately upon user request with no perceptible delay. No performance exception is permitted for any segment. REQ-A4-002 and REQ-OE-008 are updated to reflect this resolution.

**Conflict 2 — REQ-G-005 vs. REQ-OE-002 (no target allocation)**
Resolved by Decision 7. The engine falls back to tax-only optimization mode when no target allocation exists. REQ-G-005 is updated to include graceful degradation behavior, inline access to allocation editor, and 50/50 default. No conflict remains between the two requirements.

**Conflict 3 — REQ-B-W-005 vs. REQ-B-W-003 (Wait & Save dismissal ambiguity)**
Resolved: Single-action dismissal of the Wait & Save interrupt is explicitly defined as "include this lot and proceed." The dismiss control must be labeled to communicate this behavior unambiguously (e.g., "Include lot and continue" or "Proceed without excluding"). A separate "Exclude this lot" action must be simultaneously visible. There is no ambiguous dismissal state. REQ-B-W-003 and REQ-B-W-005 are updated to reflect this resolution.

---

### Items Requiring Technical Scoping

**TECH-01 — Real-time lot-level gain/loss calculation**
Requirements blocked: REQ-B2-003, REQ-B3-002
What Dev must determine: Whether the calculation engine can perform iterative lot-level tax impact recalculations — across all funds and all open lots simultaneously — with sub-second response time as the user modifies entries, at the scale of portfolios with complex lot histories.
Blocking status: Does not block functional requirements from being finalized. Blocks implementation specification. If real-time recalculation is not feasible at sub-second latency, a fallback behavior (e.g., recalculate on field exit rather than on keystroke) must be defined before implementation begins.

**TECH-02 — Optimization engine computation time**
Requirements blocked: REQ-A2-004, REQ-A4-005
What Dev must determine: The realistic computation time for generating a fully optimized recommendation — including specific lot identification across all funds, YTD gain integration, and progressive disclosure detail pre-computation — for portfolios at the high end of the complexity range (8–12 funds, many lots), in order to validate or revise the 3-second loading state threshold.
Blocking status: Does not block functional requirements from being finalized. Blocks implementation specification and UX loading state design. If computation consistently exceeds 5–7 seconds for complex portfolios, the loading state design and user-facing messaging will require revision.

**TECH-03 — Accounting method election at time of sale**
Requirements blocked: REQ-OE-005, REQ-B3-003
What Dev must determine: Whether Vanguard's transaction infrastructure supports applying or changing a specific lot identification election at time of sale within this tool's transaction flow, or whether such elections must be pre-established through a separate account-level process, and whether mid-session method changes can be applied retroactively to the current transaction.
Blocking status: Blocks functional requirements from being finalized for REQ-OE-005 and REQ-B3-003. If mid-session method election is not supported by the transaction infrastructure, these requirements must be revised to reflect the actual constraint before the requirements document can be considered complete.

**TECH-04 — YTD realized gains data retrieval**
Requirements blocked: REQ-G-013, REQ-G-014, REQ-G-015
What Dev must determine: Whether YTD realized gains data can be retrieved from Vanguard's tax records systems in real time at session initiation, or whether it requires a batch retrieval process with a defined latency, and whether the data is available at the lot level or only at the fund or account level.
Blocking status: Does not block functional requirements from being finalized. Blocks implementation specification. If batch retrieval is required, the display and freshness timestamp behavior in REQ-G-013 and REQ-G-014 must be revised to reflect data latency. If lot-level granularity is unavailable, REQ-B2-003 may require adjustment.

**TECH-05 — Transaction idempotency mechanism**
Requirements blocked: REQ-EC-007
What Dev must determine: Which idempotency mechanism (e.g., idempotency keys, session-level transaction locks, server-side deduplication) is compatible with Vanguard's existing transaction processing infrastructure, and whether the mechanism can reliably detect and suppress duplicate submissions originating from client-side events such as double-tap or browser navigation actions.
Blocking status: Does not block functional requirements from being finalized. Blocks implementation specification. The chosen mechanism must be confirmed before the confirmation screen interaction model is finalized in the design phase.
