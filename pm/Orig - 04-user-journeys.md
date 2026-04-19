# User Journeys

---

## Workflow A: System-Guided

---

### Step A1 — Tool Entry

**What the user does:** Navigates to the Sell & Rebalance tool from within the Vanguard investor portal. The tool is accessed by deliberate navigation — it is not surfaced mid-transaction in an existing sell flow.

**What the system does:** Displays the tool entry screen. Presents a brief, single-sentence description of what the tool does: it recommends which funds to sell and in what amounts to meet a withdrawal target, optimizing for both tax impact and portfolio balance. No inputs are requested yet. A visible link to Workflow B ("I'd rather enter amounts manually") is present from this point forward.

**Emotional state:** Varies sharply by segment. Most users arrive with at least mild purposefulness — they have sought this tool out. Anxiety level correlates with urgency.

**Segment annotation:**
- *Strategic Optimizer:* Calm, evaluative. Reading the entry screen to assess whether the tool is worth their time relative to their existing system.
- *Routine Executor:* Mild impatience. They've done this before and want to get to the input step.
- *Reactive Withdrawer:* Elevated stress. Scanning for the fastest path forward. Any friction at this screen risks abandonment.
- *Newly Self-Directed:* Cautious. The entry description is doing significant work here — it either orients or overwhelms.

**Decision point:** None. The entry screen is informational. The user proceeds by engaging with the tool or navigates away.

**Design annotation — returning user deep-link entry:**
Users who have a prior session on record — a saved scenario, a previously executed recommendation, or an incomplete session — should be offered a direct entry path that bypasses the tool entry screen and lands at Step A2 with the prior session context surfaced. This deep-link should be available from wherever the tool is accessed in the portal (navigation menu, dashboard widget, or prior session notification) and should be labeled contextually: *"Continue where you left off"* for incomplete sessions, or *"Start a new withdrawal"* for users whose prior session was completed. The tool entry screen remains available via a secondary path for returning users who want to re-read the tool description or who are entering a meaningfully different session than their last.

*Returning user segment annotation:* The Routine Executor and Strategic Optimizer benefit most from this path — both are likely to have prior session data and both have low tolerance for orientation content they have already seen. The Reactive Withdrawer benefits from the speed reduction. The Newly Self-Directed user should be offered the deep-link but not defaulted into it if their prior session was incomplete and showed low engagement — in that case, the full entry screen provides useful re-orientation.

---

### Step A2 — Withdrawal Amount Entry

**What the user does:** Enters a target dollar amount they wish to withdraw. This is the tool's single required input at entry. No fund selection, no account specification, no tax bracket entry is required at this step.

**What the system does:** Accepts the dollar amount. Displays the user's current total investable balance and a real-time calculation of the withdrawal as a percentage of total portfolio value. If the entered amount exceeds a threshold that would materially affect portfolio composition (e.g., more than 10% of total holdings), the system surfaces a soft notice — not a warning — acknowledging the significance of the amount and confirming the tool will account for this in its recommendation.

Also at this step: the system silently loads portfolio data (current balances, cost basis by lot, target allocation, YTD realized gains) in preparation for the recommendation calculation. No loading state is visible to the user unless calculation time requires it.

**Emotional state:** Task-focused for most segments. This is the moment the decision becomes concrete — entering a number makes it real.

**Segment annotation:**
- *Strategic Optimizer:* May enter a round number as a starting point, knowing they will refine later. Not committed to this figure.
- *Routine Executor:* Enters a predetermined amount with minimal deliberation. This step is mechanical for them.
- *Reactive Withdrawer:* Enters the exact amount dictated by their external circumstance. High motivation to move past this step quickly.
- *Newly Self-Directed:* May hesitate here. The question of "how much should I take?" has not necessarily been resolved before they arrived. May need to leave and return.

**Decision point:** The user may adjust the amount before proceeding. If the user has not specified a settlement destination, the system defaults to the linked settlement account and notes this assumption visibly.

---

### Step A3 — Tax Assumption Display and Optional Refinement

**What the user does:** Reviews the default tax rate assumptions the system will use in its recommendation. Optionally selects a different income bracket if the defaults do not reflect their situation.

**What the system does:** Displays the active assumptions:
- Short-term capital gains rate: 24%
- Long-term capital gains rate: 15%

Presents these with the associated income range they correspond to, and a collapsed rate table showing all available brackets. The user may select any bracket without entering exact income. Also displays: YTD realized gains summary (short-term and long-term separately) and the projected incremental tax impact of a sale of the entered dollar amount at default assumptions. RMD notices appear here for any account where an RMD applies, with the remaining required distribution for the year clearly stated.

A single-line advisory notice is shown: *For complex tax situations, we recommend reviewing this output with a tax professional before executing.*

**Emotional state:** This is the highest cognitive-load step in Workflow A for most users. The presentation of tax information requires interpretation even when framed simply.

**Segment annotation:**
- *Strategic Optimizer:* Actively engages with this screen. Likely to open the rate table, verify their bracket, and review the YTD summary in detail. May adjust bracket.
- *Routine Executor:* Reviews briefly. Likely accepts defaults unless something is obviously wrong. Does not open the rate table.
- *Reactive Withdrawer:* At high risk of friction here. The system must make it visually clear that this step can be passed through quickly — the defaults are reasonable and proceeding without adjustment is explicitly acceptable.
- *Newly Self-Directed:* This step may surface information (YTD gains, RMD requirements) they were not aware they needed to consider. The system must not present this as alarming. Coach mark guidance is most critical here for first-session users.

**Decision point:** Accept defaults and proceed, or select a different income bracket. RMD notice, if present, is informational only — it does not block or branch the flow.

---

### Step A4 — System Recommendation Generation

**What the user does:** Proceeds from the tax assumption screen. Waits for the recommendation.

**What the system does:** Calculates and presents the optimized recommendation. The recommendation specifies:
- Which funds to sell
- The dollar amount to sell from each fund
- The accounting method applied (e.g., specific lot identification)
- The resulting portfolio allocation after the sale, compared to the user's target allocation
- The projected tax impact (short-term and long-term gains realized) at the active rate assumption

The default view presents this as a clean summary: fund names, sell amounts, and a plain-language rationale sentence explaining the primary logic of the recommendation (e.g., *"This recommendation prioritizes selling from your bond funds, which are currently overweight, using lots with the lowest tax cost."*). Optimization detail — how the recommendation scored on each dimension — is available via progressive disclosure but not shown by default.

**Emotional state:** This is the pivot point of Workflow A. The emotional response to the recommendation determines whether the user proceeds, adjusts, or abandons.

**Segment annotation:**
- *Strategic Optimizer:* Will immediately open the optimization detail. Wants to see the tradeoffs, not just the conclusion. If the expanded detail is not available or is insufficient, trust is not established.
- *Routine Executor:* Reads the summary and rationale. If it looks consistent with prior recommendations, proceeds quickly. Consistency across sessions builds trust more than depth of explanation.
- *Reactive Withdrawer:* Reads the summary only. The plain-language rationale is essential — it must be a single sentence that conveys credibility without requiring engagement. If the recommendation looks credible, this user is ready to execute.
- *Newly Self-Directed:* The rationale sentence carries the highest weight for this segment. It is teaching them how to interpret the recommendation and, implicitly, how to think about this category of decision. Jargon in this sentence is a failure.

**Decision point:** Three paths diverge here:
1. Accept the recommendation and proceed toward execution (continues in Workflow A)
2. Switch to Workflow B to review or modify the recommendation manually (Workflow A recommendation pre-populates Workflow B)
3. Save the recommendation as a scenario and generate an alternative (proceeds toward Scenario Comparison)

---

### Step A5 — Recommendation Review and Action Selection

**What the user does:** Decides how to act on the recommendation. Reviews the expanded optimization detail if desired. Elects to execute, modify, compare, or exit.

**What the system does:** Presents three clearly labeled action paths:
- *Execute this recommendation* — proceeds to the confirmation step
- *Adjust manually* — transfers the recommendation to Workflow B as a pre-populated starting point
- *Save as Scenario and compare* — saves this recommendation as Scenario 1 and prompts the user to generate or configure an alternative

The expanded optimization detail (accessible via disclosure) shows: how the recommended sale affects each allocation dimension, the tax impact compared to a hypothetical FIFO or average-cost sale of the same amount, and lot-level detail for any fund where specific identification was applied.

**Emotional state:** Decision fatigue is possible here if the user has spent extended time on prior steps. The system's job is to make each path feel like a clear and complete option, not a preliminary to further complexity.

**Segment annotation:**
- *Strategic Optimizer:* Likely to save as scenario and compare. Will use the expanded detail to evaluate the recommendation before committing.
- *Routine Executor:* Likely to execute directly or make a minor adjustment in Workflow B. Scenario comparison is low-value for this session context.
- *Reactive Withdrawer:* Executes directly. Any prompt to "save and compare" must be visually subordinate to the execute action — it should not read as a required step.
- *Newly Self-Directed:* May hesitate before executing. The availability of the "adjust manually" path provides reassurance that they are not locked in, even if they don't use it.

**Decision point:** Execute, adjust in Workflow B, or save and compare. Execution path continues to Step A6. Adjust path enters Workflow B at Step B1. Compare path enters the Scenario Comparison view.

---

### Step A6 — Execution Confirmation

**What the user does:** Reviews a confirmation screen summarizing the full transaction before submitting. Confirms or cancels.

**What the system does:** Presents a complete pre-execution summary:
- Funds to be sold and amounts
- Estimated proceeds net of projected tax impact
- Destination account (settlement account, confirmed)
- Estimated settlement timeline
- A final one-line tax advisory notice

Requires an affirmative confirmation action (not a passive continuation) before the transaction is submitted. After submission, displays a transaction confirmation with a reference number and a summary of what was executed.

**Emotional state:** This is the highest-anxiety moment in the workflow for all segments. The act of committing is where the emotional weight of "selling feels irreversible" is most acute.

**Segment annotation:**
- *Strategic Optimizer:* Reviews the confirmation carefully. May cancel and return to comparison if something in the summary triggers a concern.
- *Routine Executor:* Reviews briefly and confirms. The routine nature of this transaction reduces the emotional weight over time.
- *Reactive Withdrawer:* Confirms quickly. Needs this step to be short. The confirmation screen must not introduce new information that wasn't visible earlier — surprises at this step are high-risk for abandonment.
- *Newly Self-Directed:* Needs the confirmation screen to feel like a safety net, not another decision. Clear language that the transaction can be reviewed (even if not reversed) after submission supports this.

**Decision point:** Confirm or cancel. Cancellation returns the user to Step A5 without losing the recommendation.

---

## Workflow B: Manual

---

### Back-Navigation Path: Workflow B to Workflow A

Two distinct motivations drive a user to return from Workflow B to the Workflow A recommendation:

- **Intentional exploration:** The user switched to Workflow B with genuine curiosity — they wanted to see the underlying data, understand the lot-level detail, or verify that the system recommendation was reasonable. Having satisfied that curiosity, they return to Workflow A not because Workflow B failed them but because exploration confirmed the system recommendation was sound. This is a successful tool interaction.

- **Preference reversal:** The user entered Workflow B intending to build a better configuration than the system produced, engaged with the manual controls, and concluded that the system recommendation was preferable — either because the manual configuration produced worse tax outcomes, because the complexity of the manual workflow exceeded their tolerance in this session, or because the system recommendation held up under scrutiny. This is also a successful tool interaction.

*Segment annotation by motivation:*
- Intentional exploration is most characteristic of the **Strategic Optimizer** (auditing the system's logic) and the **Newly Self-Directed** user (building comprehension before committing).
- Preference reversal is most characteristic of the **Routine Executor** (who entered Workflow B to make a minor adjustment, found it unnecessary, and returned) and, occasionally, the **Strategic Optimizer** (who found that manual iteration did not improve on the system output).
- The **Reactive Withdrawer** is unlikely to enter Workflow B at all; if they do and trigger a return, the motivation is almost always preference reversal driven by friction rather than analytical comparison.

A persistently visible control labeled *"Return to system recommendation"* is present throughout Workflow B from Step B1 through Step B2. The Workflow A recommendation is held in memory for the full session regardless of any activity in Workflow B — including changes to fund amounts, lot selections, or accounting methods. No Workflow B activity modifies or overwrites the stored Workflow A recommendation. From Step B3 onward, this direct return path is replaced by *"Save as scenario and compare"* — at that point the user has built something worth preserving rather than discarding, and returning to Workflow A should surface both configurations for side-by-side evaluation rather than discard the manual work.

---

### Step B1 — Workflow B Entry

**What the user does:** Navigates to Workflow B either from the tool entry screen (Step A1) or from within Workflow A after reviewing a recommendation (Step A5). If entering from Workflow A, the recommendation pre-populates the manual entry fields. If entering directly, all fields are blank.

**What the system does:** Displays the full portfolio fund list with the following data columns for each fund:
- Current balance
- Target allocation weight and current actual weight
- Allocation drift (over/underweight indicator)
- Cost basis by available accounting method (FIFO, average cost, specific lot identification)
- Unrealized short-term gains/losses
- Unrealized long-term gains/losses
- A manual entry field for the sell amount

If entering from Workflow A, each fund's entry field is pre-populated with the recommended sell amount. The pre-population is visually distinguished from a blank state — the user can see immediately which fields came from the system recommendation and can modify or clear any of them.

The tax assumption display from Step A3 is persistent and visible throughout Workflow B. YTD realized gains and RMD notices are also carried forward.

A persistently visible *"Return to system recommendation"* control is present at this step. Activating it returns the user to Step A5 with the original Workflow A recommendation restored and intact, unaffected by any Workflow B activity.

**Emotional state:** Entry-from-Workflow-A users arrive with a reference point and a sense of orientation. Direct-entry users arrive with more cognitive load — they are looking at a full data table with no pre-computed starting point.

**Segment annotation:**
- *Strategic Optimizer:* Arrives here either from Workflow A (to refine) or directly (to build their own strategy from scratch). In either case, this is their primary working surface.
- *Routine Executor:* Unlikely to enter Workflow B directly. If arriving from Workflow A, reviews the pre-populated amounts and makes minor adjustments. Preference reversal is the most likely return motivation for this segment.
- *Reactive Withdrawer:* Unlikely to be in Workflow B at all. If they are, they arrived from Workflow A and are making a specific targeted modification — not reviewing the full table.
- *Newly Self-Directed:* May arrive here from Workflow A and find the data table overwhelming. Coach marks are most critical at this entry point for first-session users — specifically, guidance on what each column means and how to read the allocation drift indicators. Intentional exploration is the most likely return motivation for this segment.

**Decision point:** If arriving from Workflow A, the user may accept the pre-population, modify it, or clear all amounts and start from scratch. The user may return to Workflow A via the *"Return to system recommendation"* control at any point during this step.

---

### Step B2 — Fund and Lot Review

**What the user does:** Reviews fund-level data to understand where the portfolio stands. May expand individual funds to see lot-level detail: acquisition date, cost basis per share, current value, and the gain/loss realized if that lot were selected for sale.

**What the system does:** Supports expandable fund rows for lot-level detail. Displays lot-level gain/loss calculations in real time for any lot the user hovers over or selects. Applies visual indicators:
- Overweight funds are flagged (consider selling to rebalance)
- Funds with harvestable losses are flagged (opportunity to offset gains)
- Lots approaching long-term conversion — within 30 days of the one-year holding threshold — are flagged with a **Wait & Save** indicator (see branch below)

A persistently visible *"Return to system recommendation"* control is present at this step. Behavior is identical to Step B1: the Workflow A recommendation is unaffected by any review or expansion activity in Step B2, and activation returns the user to Step A5 with the original recommendation intact.

**Emotional state:** Analytical and deliberate for users who belong here. Potentially overwhelming for users who arrived here without adequate preparation.

**Segment annotation:**
- *Strategic Optimizer:* This is the most valued screen in the entire tool for this segment. They will review lot-level detail, interpret the visual indicators, and use this information to construct their own strategy. Depth of data here directly correlates with their assessment of tool quality.
- *Routine Executor:* Skims at the fund level. Does not expand lots unless something looks unexpected.
- *Reactive Withdrawer:* Should not be here. If they are, the visual complexity of this screen is a strong abandonment signal.
- *Newly Self-Directed:* Needs the indicators to be interpretable without prior knowledge. Coach mark guidance on "what is a harvestable loss" and "what does overweight mean" is most valuable here.

**Decision point:** The user may proceed to enter sell amounts (Step B3), trigger the Wait & Save branch (see below), or return to Workflow A via the *"Return to system recommendation"* control.

---

### Wait & Save Interrupt — Named Branch

**Trigger condition:** A lot within any fund held by the user is within 30 days of converting from short-term to long-term status. Selling this lot now would realize a short-term gain (taxed at 24% under default assumptions). Waiting would convert it to a long-term gain (taxed at 15% under default assumptions). The system detects this condition and surfaces the interrupt.

**What the system does:** Displays a named interrupt notice at the fund or lot level: *"Wait & Save opportunity — this lot converts to long-term in [N] days. Selling now vs. then affects your estimated tax by approximately $[X]."* The notice presents:
- The specific lot(s) affected
- The number of days until long-term conversion
- The projected tax difference between selling now and selling after conversion
- Two paths: *Exclude this lot from my sale* or *Include it and proceed*

If the user elects to exclude the lot, the system recalculates available sell amounts for that fund, adjusts the total sell amount available from that fund, and may flag a shortfall if excluding the lot makes it impossible to reach the target withdrawal amount from the current fund selection.

**Emotional state:** This interrupt is most valuable when the user is in a deliberate session. In an urgent session, it introduces friction at a moment when the user cannot act on the recommendation (they need the money now, not in 30 days).

**Segment annotation:**
- *Strategic Optimizer:* High value. Will engage with the detail and may restructure their entire fund selection around the Wait & Save opportunity.
- *Routine Executor:* Moderate value. Will consider the dollar figure and make a quick judgment.
- *Reactive Withdrawer:* Low value and potential friction. The notice must be dismissible in a single action without requiring engagement with the lot-level detail.
- *Newly Self-Directed:* Potentially confusing unless the plain-language framing is strong. The dollar figure ("approximately $X") is the most important element for this segment — it makes the abstract tradeoff concrete.

**Decision point:** Exclude the lot and recalculate, or include the lot and proceed. The interrupt is advisory — it does not block execution.

---

### Step B3 — Manual Amount Entry and Real-Time Tax Impact

**What the user does:** Enters or modifies sell amounts for each fund in the manual entry fields. Amounts can be entered at the fund level (the system applies the accounting method to determine which lots are sold) or at the lot level (user selects specific lots).

**What the system does:** Calculates and updates the following in real time as amounts are entered:
- Total sell amount vs. target withdrawal amount (running tally, with clear indicator when the target is met or exceeded)
- Projected tax impact of the current configuration (short-term gains, long-term gains, total estimated tax liability)
- Resulting portfolio allocation after the planned sale, compared to target allocation
- Any shortfall or overage relative to the target withdrawal amount

The accounting method in use is displayed and selectable at both the fund level and the lot level. If the user changes the accounting method for a fund, the tax impact recalculates immediately.

From this step onward, the *"Return to system recommendation"* direct return control is replaced by *"Save as scenario and compare."* A user who has actively entered or modified sell amounts has produced something worth preserving. Activating this control saves the current manual configuration as a scenario and enters the Scenario Comparison view, where the original Workflow A recommendation (held in memory throughout the session) is available as a parallel scenario.

**Emotional state:** Active and engaged for users who belong in this workflow. The real-time feedback loop supports iterative decision-making and gives a sense of control.

**Segment annotation:**
- *Strategic Optimizer:* The real-time recalculation is the core value of this step. They will experiment with different configurations, compare the tax impact, and iterate toward their preferred scenario.
- *Routine Executor:* Makes targeted adjustments to the pre-populated amounts and confirms the tax impact looks reasonable. Does not iterate extensively.
- *Reactive Withdrawer:* Not expected in this step. If present, they are making one specific change to the pre-populated Workflow A recommendation and proceeding.
- *Newly Self-Directed:* Watching the tax impact number change in real time may be disorienting without context. Coach mark guidance explaining what the number means and why it changes is valuable here on first session.

**Decision point:** When the target amount is met (or the user decides the current configuration is acceptable), the user proceeds to save the scenario and move toward comparison or direct execution.

---

### Step B4 — Save Scenario

**What the user does:** Saves the current manual configuration as a named scenario. Labels it (system provides a default label; user may rename). Elects to compare with another scenario or proceed to execution.

**What the system does:** Saves the current configuration — fund selection, lot selection, accounting method, sell amounts, and projected tax impact — as a named scenario. Confirms the save and presents two paths:
- *Add another scenario or compare* — proceeds to Scenario Comparison view
- *Execute this scenario* — proceeds to Execution Confirmation (equivalent to Step A6)

Up to three scenarios may be saved. If the user already has a Workflow A recommendation saved as Scenario 1, their manual configuration becomes Scenario 2.

**Emotional state:** A moment of pause and reflection. The act of saving creates a sense of provisional commitment without the finality of execution.

**Segment annotation:**
- All segments: The save step provides a natural resting point. For users who need to pause and return later (particularly *Newly Self-Directed* users), this step is where incomplete sessions can be preserved.

**Decision point:** Compare or execute. This is the convergence point into the Scenario Comparison view.

---

## Convergence: Scenario Comparison View

---

### How Workflows Converge

Both Workflow A and Workflow B converge on the Scenario Comparison view through the same mechanism: saving a configuration as a named scenario. A Workflow A recommendation becomes a scenario when the user elects "Save as Scenario and compare" at Step A5. A Workflow B configuration becomes a scenario when the user saves it at Step B4. The two paths are equivalent from the Scenario Comparison view's perspective — it does not distinguish between system-generated and manually constructed scenarios.

A user may hold up to three scenarios simultaneously. Scenarios may be any combination of Workflow A outputs and Workflow B configurations. The comparison view is therefore reachable by:
- Saving a Workflow A recommendation and generating an alternative
- Building two or more configurations in Workflow B
- Saving a Workflow A recommendation and then building a manual variant in Workflow B for comparison

---

### Scenario Comparison View

**What the user does:** Reviews up to three scenarios side by side. Selects one to execute.

**What the system does:** Displays scenarios in a structured side-by-side layout. Each scenario column shows:
- Fund-by-fund sell amounts
- Accounting method applied
- Projected short-term gains realized
- Projected long-term gains realized
- Estimated total tax liability at active rate assumption
- Resulting portfolio allocation (actual vs. target, post-sale)
- A plain-language summary of the primary tradeoff this scenario represents (e.g., *"Lowest tax impact but leaves portfolio slightly overweight in equities"*)

The user may return to Workflow B to modify a scenario from within this view. Modifying a saved scenario replaces it in the comparison — it does not create a fourth scenario. The user may also delete a scenario from the comparison and replace it with a new one.

**Emotional state:** Evaluative and deliberate. Users who have arrived here have already demonstrated willingness to engage at depth. The emotional register is more controlled than at earlier steps.

**Segment annotation:**
- *Strategic Optimizer:* Primary home in the tool. Will compare all three dimensions (tax, allocation, tradeoff summary) across scenarios. May iterate between this view and Workflow B multiple times before committing.
- *Routine Executor:* If they have arrived here, they had a specific reason — likely a one-time comparison between a system recommendation and a manual adjustment. Will make a quick selection.
- *Reactive Withdrawer:* Should rarely arrive here. If they do, it indicates the session was less urgent than initially classified, or the Workflow A recommendation was not credible enough to execute directly.
- *Newly Self-Directed:* The tradeoff summary sentence in each scenario column is the primary decision input for this segment. The numerical columns provide supporting context but the plain-language summary drives the choice.

**Decision point:** Select a scenario to execute. Execution proceeds to the Confirmation step (equivalent to Step A6), with the selected scenario's fund and lot instructions populating the pre-execution summary.
