# Open Questions for Design

---

## Tier 1: Must Resolve Before Any Screen Design Begins

---

**Q1. How does the tool communicate the silent integration of tax and rebalancing optimization without requiring users to understand that two problems are being solved simultaneously?**

*Why the PM documents don't resolve it:* PM Decision 1 establishes that the integration is silent by default with progressive disclosure available, but does not specify how the default summary view conveys that both dimensions were considered. The rationale sentence requirement (REQ-A4-003) specifies that it must reference "at least one of the two optimization dimensions" — but the framing, hierarchy, and visual language of the recommendation display are unresolved design questions.

*Segments most affected:* Reactive Withdrawer (needs immediate credibility from the summary), Newly Self-Directed (needs the summary to teach them what was considered), Strategic Optimizer (needs the summary to signal that depth is available).

*Design tension:* A summary that foregrounds tax efficiency as the primary frame will feel incomplete to users who care about allocation. A summary that tries to reference both dimensions in a single sentence risks jargon and cognitive load. A visual treatment that separates the two dimensions (even in summary) reintroduces the cognitive split that the silent integration was meant to avoid.

---

**Q2. What is the interaction model for the tax bracket selector, and how does the tool communicate the difference between "default assumption" and "your confirmed rate"?**

*Why the PM documents don't resolve it:* PM Decision 5 specifies the default rates, the income range display, and the collapsed rate table. It does not specify whether the selector is a dropdown, a segmented control, a modal, or an inline expansion — nor does it specify how the tool visually distinguishes between a session in which the user has accepted the default without review and a session in which the user has affirmatively selected their bracket. These are different epistemic states with different implications for the user's confidence in the tax impact figures.

*Segments most affected:* Strategic Optimizer (will want to confirm their bracket is set correctly before trusting tax figures), Newly Self-Directed (may not realize the default doesn't reflect their situation), Routine Executor (needs to be able to pass through without friction).

*Design tension:* Making bracket selection prominent enough to be noticed by users who should change it will slow down users who shouldn't. Making it subtle enough to be skippable risks Strategic Optimizers missing it or Newly Self-Directed users not realizing it exists. A "confirmed" vs. "default" visual distinction adds clarity but adds UI complexity.

---

**Q3. How does the Workflow A recommendation display handle the presence of a balance-prioritized alternative — is it a second recommendation shown alongside the first, a replacement, or something else?**

*Why the PM documents don't resolve it:* PM Decision 6 and REQ-A4-006/A4-007 establish that when the tax-optimal recommendation produces meaningful allocation drift, the user can request a balance-prioritized alternative within Workflow A without leaving the workflow. The interaction model for presenting this alternative — whether it replaces the original, appears beside it, appears below it, or triggers a comparison state — is entirely unresolved and determines whether Workflow A remains a single-recommendation experience or becomes a lightweight comparison experience in its own right.

*Segments most affected:* Strategic Optimizer (most likely to request the alternative and compare), Routine Executor (must not be confused by the appearance of a second recommendation they didn't ask for), Reactive Withdrawer (must not be destabilized by the appearance of optionality at the moment they were about to execute).

*Design tension:* Showing both recommendations simultaneously supports informed comparison but introduces visual complexity and may undermine the clarity of Workflow A's "single trusted answer" value proposition. Replacing the original with the alternative loses the reference point. A toggle or tab model preserves both but adds interaction cost and may be unfamiliar in this context.

---

**Q4. What is the visual and interaction model for the "Return to system recommendation" control in Workflow B, and how does the transition from this control to "Save as scenario and compare" at Step B3 work without confusing the user?**

*Why the PM documents don't resolve it:* The back-navigation path is fully specified in terms of behavior (REQ-B1-005, REQ-B2-004, REQ-B3-005), but the design question of how to make a persistent control change its label and behavior mid-workflow — without the user feeling that a familiar affordance has disappeared or that they've lost access to the system recommendation — is unresolved. The transition at Step B3 is a particularly high-risk moment: the control changes at exactly the point where the user has become invested in their manual work.

*Segments most affected:* Routine Executor (most likely to use the return path after preference reversal), Newly Self-Directed (most likely to be confused by a control that changes behavior mid-session).

*Design tension:* Changing the label abruptly may feel like the system recommendation has been locked away. Keeping both controls visible simultaneously (return + save as scenario) adds visual weight to an already data-dense surface. Explaining the transition inline adds copy that may not be read.

---

**Q5. How does the tool handle the graceful degradation to tax-only mode when no target allocation is on record — specifically, how prominent is the notice, and where in the workflow does the inline allocation editor appear?**

*Why the PM documents don't resolve it:* PM Decision 7 and REQ-G-005 specify that the tool degrades to tax-only mode with a prominent notice and inline access to a simplified allocation editor defaulting to 50/50. The placement, visual weight, and timing of this notice — whether it appears at tool entry, at the recommendation step, or both — and the interaction model for the inline editor (modal, drawer, inline expansion) are unresolved. The answer determines whether setting a target allocation feels like a required prerequisite or an optional enhancement.

*Segments most affected:* Newly Self-Directed (most likely to have no target allocation on record and most likely to be confused by the concept), Strategic Optimizer (most likely to want to set a precise allocation rather than accept the 50/50 default).

*Design tension:* A prominent early notice that the tool is in degraded mode may discourage users who have no allocation set and aren't sure what one is. A subtle notice may result in users completing a recommendation without realizing rebalancing wasn't considered. The inline editor's placement relative to the main workflow determines whether setting an allocation feels like a natural step or an interruption.

---

## Tier 2: Must Resolve During Wireframing

---

**Q6. How does the Workflow B fund table handle portfolios at the high end of the complexity range — 8 to 12 funds with multiple lots each — without becoming unusable?**

*Why the PM documents don't resolve it:* REQ-B1-001 specifies the columns that must be displayed. It does not specify how the table handles scroll, column freezing, lot expansion in a long table, or whether any progressive disclosure at the fund level (e.g., showing only overweight or flagged funds by default) is appropriate. The data density requirements for Segment A conflict with the cognitive load concerns for Segment D on the same screen.

*Segments most affected:* Strategic Optimizer (needs all data visible and scannable), Newly Self-Directed (may be overwhelmed by a 12-fund table with expanded lot rows).

*Design tension:* Default expansion of all funds and lots surfaces maximum information but creates an unusably long page for complex portfolios. Default collapse with expansion on demand reduces cognitive load but may obscure information that the Strategic Optimizer needs to see at a glance. Filtering or sorting controls help power users but add interaction overhead for users who don't know what they're filtering for.

---

**Q7. How are the Wait & Save interrupt notices positioned and timed — at what point in the Workflow B experience does the user encounter them, and how do they coexist with the rest of the data table?**

*Why the PM documents don't resolve it:* REQ-B-W-001 through REQ-B-W-005 specify the content and behavior of the interrupt but not its visual placement (inline within the fund row, as a banner above the table, as a modal, or as a sidebar notice) or the timing of its appearance (on page load, on lot expansion, on hover, or on sell amount entry for the affected fund).

*Segments most affected:* Strategic Optimizer (needs the interrupt to be rich enough to act on), Reactive Withdrawer (needs it to be dismissible instantly without engagement), Newly Self-Directed (needs the dollar figure to be the most prominent element).

*Design tension:* An inline interrupt within the table row is contextually precise but may be missed on a data-dense page. A banner or modal is harder to miss but interrupts the flow of a user who is in the middle of building their manual configuration. A hover-triggered notice is subtle but may not surface at all for users who don't explore lot-level detail.

---

**Q8. How does the Scenario Comparison view present the plain-language tradeoff summary sentence in relation to the numerical data columns — and what visual hierarchy ensures that each segment can find their primary decision input?**

*Why the PM documents don't resolve it:* REQ-SC-003 and REQ-SC-004 specify that each scenario column must include both numerical figures and a plain-language tradeoff summary. The visual hierarchy between these two elements — whether the summary leads and the numbers support, or the numbers lead and the summary explains — determines which segments the comparison view serves most effectively. The Newly Self-Directed user relies primarily on the tradeoff summary; the Strategic Optimizer relies primarily on the numbers.

*Segments most affected:* Newly Self-Directed (tradeoff summary is the primary decision input), Strategic Optimizer (numerical columns are the primary decision input), Routine Executor (needs to make a quick selection and leave).

*Design tension:* Leading with the tradeoff summary makes the view more accessible to less sophisticated users but may feel reductive to Strategic Optimizers who find plain-language summaries imprecise. Leading with numbers makes the view more useful to power users but may leave Newly Self-Directed users unable to identify which scenario to choose.

---

**Q9. What does the coach mark system look like in the context of a data-dense Workflow B table — and how does the system avoid coach marks that block data the user needs to see in order to benefit from the coach mark?**

*Why the PM documents don't resolve it:* REQ-G-019 through REQ-G-022 specify the behavior and placement requirements for coach marks but not their visual form, positioning logic, or sequencing. In a table with many columns and expandable rows, a coach mark pointing to a specific column must not obscure adjacent columns. The sequencing of coach marks (all at once, one at a time, triggered by scroll position, triggered by interaction) determines whether first-session users experience orientation as helpful or as an obstacle to getting started.

*Segments most affected:* Newly Self-Directed (primary beneficiary of coach marks), Strategic Optimizer (most likely to be frustrated by coach marks blocking data).

*Design tension:* A sequential coach mark tour ensures coverage but creates a mandatory onboarding gate that slows users who already understand the interface. Contextual coach marks triggered by interaction are less intrusive but may never fire for users who interact in an unexpected order. Tooltip-style marks are lightweight but may be too small to convey meaningful guidance in a complex table context.

---

**Q10. How does the pre-execution confirmation screen communicate the "estimated" status of tax impact figures without introducing uncertainty that causes last-minute abandonment?**

*Why the PM documents don't resolve it:* REQ-EC-001 requires all figures to be clearly labeled as estimates where applicable, and REQ-A6-001 carries a compliance review flag on this point. The design question is how to honor the accuracy-of-labeling requirement while not making the confirmation screen feel like the tool is walking back its own recommendation at the highest-anxiety moment in the workflow. "Estimated" language that is prominent may increase abandonment; "estimated" language that is buried may create compliance risk.

*Segments most affected:* Reactive Withdrawer (high abandonment risk at confirmation if something feels uncertain), Newly Self-Directed (may interpret "estimated" as "we're not sure this is right"), Routine Executor (needs confirmation to feel routine, not hedged).

*Design tension:* Prominent estimate labeling is legally safer but emotionally destabilizing at the moment of commitment. Subtle estimate labeling reduces anxiety but may not satisfy compliance review requirements. The wording of the estimate notice must thread this needle — and the PM documents establish the requirement without resolving how to meet it in copy and layout simultaneously.

---

**Q11. How does the returning user deep-link entry surface prior session context — what does the user see, and how much of their prior session is presented before they decide whether to continue or start fresh?**

*Why the PM documents don't resolve it:* REQ-G-026 and REQ-G-027 specify the entry labels and the existence of the deep-link. They do not specify what "prior session context surfaced" means in terms of what is shown — whether it is a summary of the prior recommendation, the prior withdrawal amount, the prior scenarios, or all of the above — or how the user transitions from reviewing prior context to acting on it.

*Segments most affected:* Routine Executor (benefits most from fast re-entry with minimal review), Strategic Optimizer (may want to review prior session detail before deciding whether to continue).

*Design tension:* Showing too much prior context on entry creates a review burden before the user has confirmed they want to continue. Showing too little may result in the user continuing a prior session without realizing the context is stale or no longer relevant. The entry experience must convey "here is what you were doing" without requiring the user to re-engage with prior decisions before they've chosen to.

---

## Tier 3: Can Be Resolved Through Prototype Testing

---

**Q12. At what point of detail in the plain-language rationale sentence does the Newly Self-Directed user transition from feeling oriented to feeling overwhelmed — and does the answer differ between first-session and returning users in this segment?**

*Why prototype testing is the right method:* The rationale sentence requirements (REQ-A4-003, REQ-OE-007) establish that it must be jargon-free and reference at least one optimization dimension. The right level of specificity — whether naming a specific fund, naming a specific tax mechanism, or staying at the level of general principle — can only be calibrated by observing how users in this segment actually respond to different phrasings. No PM decision can predetermine the right reading level for emotional reassurance.

*Segments most affected:* Newly Self-Directed, Routine Executor.

---

**Q13. Does the Scenario Comparison view benefit from a visual "winner" signal — some form of default highlighting or recommendation — or does any such signal undermine the user's sense of autonomous choice?**

*Why prototype testing is the right method:* The comparison view is designed to support an informed decision, not to make one for the user. But in practice, users faced with three parallel columns of equivalent visual weight may experience decision paralysis. Whether a subtle default highlight on the tax-optimal scenario (or the most recently generated scenario) helps or frustrates users in different segments cannot be determined from the PM documents — it depends on how users behave when confronted with the comparison view for the first time.

*Segments most affected:* Newly Self-Directed (most susceptible to paralysis), Strategic Optimizer (most likely to feel patronized by a pre-selected option).

---

**Q14. How much real-time tax recalculation feedback is useful in Workflow B before it becomes distracting — and does continuous recalculation on every keystroke serve Segment A better than recalculation on field exit?**

*Why prototype testing is the right method:* REQ-B3-002 requires real-time recalculation as amounts are entered. TECH-01 flags that sub-second recalculation may not be feasible for all portfolios. Even if performance allows it, the UX question of whether continuous recalculation supports iterative decision-making or creates visual noise that disrupts concentration can only be answered by observing Strategic Optimizers and Routine Executors using the interface with real data.

*Segments most affected:* Strategic Optimizer (primary user of iterative adjustment in Workflow B), Routine Executor (may find constant recalculation distracting during targeted adjustments).

---

**Q15. How long do users in the Reactive Withdrawer segment spend on the tax assumption screen (Step A3) before proceeding — and does any element of that screen reliably trigger abandonment that could be addressed by layout or copy changes?**

*Why prototype testing is the right method:* Step A3 is identified in the journey as the highest-anxiety moment in Workflow A for Reactive Withdrawers, and REQ-A3-003 requires the screen to make proceeding without adjustment "explicitly acceptable." Whether the current content scope of that screen (default rates, YTD summary, RMD notice, advisory notice) is too much for high-urgency users to pass through confidently — and if so, which element is causing friction — can only be determined empirically. No amount of PM specification can predict the threshold.

*Segments most affected:* Reactive Withdrawer, Newly Self-Directed.

---

**Q16. Does the availability of the manual workflow from the tool entry screen (Step A1) meaningfully reduce trust in Workflow A — does seeing "I'd rather do this myself" as an entry option cause users to second-guess the system recommendation before they've seen it?**

*Why prototype testing is the right method:* PM Decision 2 establishes that the Workflow B link must be visible from Step A1. The potential trust implication — that surfacing a manual alternative at entry signals that the system recommendation may not be reliable — is a real UX risk that the PM documents acknowledge but cannot evaluate. Only user testing can determine whether the presence of the manual entry link affects how users receive the Workflow A recommendation.

*Segments most affected:* Newly Self-Directed (most susceptible to trust signals at entry), Routine Executor (may interpret the manual option as unnecessary complexity).

---

## Constraints the PD Must Not Reopen

**1. Workflow A is the default entry point; Workflow B requires explicit user selection.**
PM Decision 2. Automated session-context inference was evaluated and rejected. The default-plus-toggle model is final.

**2. The tool silently integrates tax and rebalancing optimization; it does not ask users to configure optimization priorities.**
PM Decision 1 and PM Decision 6. The priority ordering (tax-first with drift notice) is defined. Users may request an alternative recommendation but may not configure the engine's weighting parameters.

**3. Tax bracket selection uses income ranges, not exact income entry.**
PM Decision 5. Requiring exact income entry was evaluated and rejected on friction grounds. The range-selector model is final for this release.

**4. Coach marks are the delivery mechanism for first-session guidance; a separate onboarding flow was not approved.**
PM Decision 4. The manual workflow is a power-user control surface. A dedicated learning mode or onboarding wizard is not in scope.

**5. The post-decision feedback loop (connecting withdrawal decisions to eventual tax outcomes) is explicitly out of scope for this release.**
PM Decision 3. HMW 7 has been removed from the active design input set. Any design element that implies or requires post-session outcome tracking is not permitted in v1.

**6. Mobile phone viewports (below 768px) are not supported in the initial release.**
REQ-NF-COMPAT-004. The data density of Workflow B and the Scenario Comparison view make mobile layout a future-release design problem, not a constraint to be accommodated now.

**7. Up to three scenarios may be saved simultaneously; a fourth cannot be added without deleting one.**
REQ-SC-001. This limit is a deliberate design and technical constraint. The PD may not design around the assumption of unlimited scenarios.

**8. Single-action dismissal of the Wait & Save interrupt is defined as "include this lot and proceed."**
Conflict Resolution 3. The disambiguation is final. The PD must design both actions (exclude and include/dismiss) as simultaneously visible controls with unambiguous labels. There is no neutral dismissal state.

**9. The Workflow A recommendation must be held in memory for the full session regardless of Workflow B activity.**
REQ-G-025. The back-navigation path and its behavior are fully specified. The PD may not design a workflow in which Workflow B activity overwrites or invalidates the stored Workflow A recommendation.

**10. The tax professional advisory notice is required on the confirmation screen and must be worded to normalize rather than amplify uncertainty.**
REQ-EC-002 as amended. The notice is not optional and its emotional framing requirement is fixed. Legal and compliance will approve the final wording; the PD's responsibility is to ensure the notice's visual treatment supports the normalization intent rather than undermining it.
