# User Research (Structured Inference)

## Step 1: User Population Analysis

### Financial Sophistication

The population spans a wide range, but the range is not a smooth continuum — there are meaningful clusters and breakpoints worth naming.

At one end are investors who understand the mechanics of what they own: they can articulate the difference between a fund's NAV and its total return, they know what expense ratios are doing to their compounding, and they have an intuitive model of how equity and bond allocations interact with risk over time. These investors likely arrived at Vanguard through deliberate research — they read Bogleheads forums, they've done their own asset allocation math, and they chose Vanguard specifically because the philosophy aligned with conclusions they'd already reached. Their sophistication is real but often narrow: they may understand portfolio construction well and tax mechanics poorly, or vice versa.

At the other end are investors who made good decisions decades ago — often on the advice of a now-retired employer benefits counselor, a spouse, or a trusted friend — and have since left their portfolios largely untouched. They know they own "stock funds and bond funds." They know Vanguard has a good reputation. They do not know what a cost basis accounting method is, and they have never needed to. Their financial sophistication is low in technical terms but their judgment is not poor — they've simply never been required to engage at this level before.

The meaningful breakpoints are roughly:

- **Can they read a capital gains distribution notice and understand what it means for their taxes?** This separates a large middle group from both the sophisticated and unsophisticated ends.
- **Have they ever made an active sell decision, as opposed to a systematic withdrawal?** Investors who have only experienced automatic or RMD-driven withdrawals have a very different mental model than those who have manually selected funds to sell.
- **Do they have an outside advisor?** Advised investors have often outsourced the cognitive load of these decisions entirely and may approach the tool with a very different posture — more skeptical, less exploratory, possibly using it to audit or cross-check their advisor's work.

---

### Relationship to Tax Complexity

There is a genuine attitudinal split here, not merely a knowledge gap.

Some investors are actively tax-aware and find tax optimization intellectually engaging. They track their cost basis across lots, they know whether they're using FIFO or specific identification, and they think about tax-loss harvesting as a regular practice. For these users, tax complexity is not a burden — it is a lever they want to pull. They may be frustrated with Vanguard precisely because the tools don't give them enough control or enough information to optimize effectively.

A much larger group acknowledges that taxes matter but finds the subject aversive. They know capital gains exist. They know selling at a gain has consequences. But the accounting methods — FIFO, average cost, specific lot identification — feel opaque and anxiety-inducing, like a domain where a mistake has invisible consequences they won't discover until they file. For this group, tax complexity creates avoidance behavior: they delay withdrawal decisions, they default to whatever the system recommends or defaults to, or they call a professional rather than engage with the decision themselves.

A third group is genuinely unaware that the *method* by which they sell matters tax-wise. They assume Vanguard handles it and that whatever happens is what happens. This is not negligence — it reflects a reasonable expectation that a brokerage should handle routine mechanics. This group may be the most surprised by a tool that reveals they have choices, and their reaction could go either way: empowerment or overwhelm.

One important nuance: tax-awareness is not correlated simply with wealth or sophistication. Some very wealthy investors have fully delegated tax decisions to CPAs and are no more engaged with basis accounting than a novice. Some middle-income investors are meticulous because they have had a bad experience — an unexpected tax bill, an audit, a specific event that made the consequences visceral.

---

### Withdrawal Triggers

The most commonly assumed trigger — retiree covering regular living expenses — is real but flattens significant variation. The full landscape of withdrawal triggers includes:

**Routine and planned**
- Regular monthly or quarterly drawdown to supplement Social Security, pension, or other income streams
- Required Minimum Distributions (RMDs), which are mandatory and calendar-driven, removing some decision-making but not all (the user still controls *which* funds to liquidate)
- Systematic Withdrawal Plans, where amounts are pre-set but fund selection may still vary

**Event-driven, anticipated**
- Large planned purchases: home renovation, vehicle, travel, a family event
- Funding a gift or transfer to adult children or grandchildren
- Paying estimated quarterly taxes, particularly for those with significant non-wage income
- Charitable giving strategies (e.g., donor-advised fund contributions funded by appreciated shares)

**Event-driven, unanticipated**
- Medical expenses, including long-term care costs that arrive suddenly or escalate
- Emergency family support: a child's financial crisis, a spouse's illness, a death in the family with associated costs
- Home repair or disaster recovery not covered by insurance
- Legal expenses

**Strategically motivated**
- Tax-year-end harvesting: deliberately realizing losses before December 31
- Roth conversion funding: selling from taxable accounts to fund a Roth conversion in a low-income year
- Pre-RMD drawdown strategy: voluntarily reducing traditional IRA balances in years before RMDs begin to manage future tax exposure
- Rebalancing that incidentally requires selling: the withdrawal is secondary to a rebalancing need

**Relational and transitional**
- Divorce, requiring liquidation to divide assets
- Death of a spouse who previously managed finances, leaving the survivor newly responsible for decisions they've never made
- Transition off of an advisor relationship, requiring the investor to take over decisions previously delegated

The emotional and behavioral profile of an investor varies substantially across these triggers. Conflating them into "making a withdrawal" misses important design implications.

---

### Emotional Context

The affective state at the moment of a withdrawal decision is shaped by three variables operating somewhat independently: **urgency**, **perceived permanence**, and **sense of control**.

When urgency is low and the trigger is routine, the dominant emotions tend to be mild anxiety and mild tedium. The investor knows they need to do this periodically, they've done it before, but the decision never feels fully comfortable because the stakes are real even if the situation is familiar. There is often a background worry about "doing it wrong" — not catastrophically wrong, but suboptimally wrong in a way they won't be able to see until tax time.

When urgency is high — a medical bill, a family emergency — anxiety is acute and the desire to minimize decision complexity is strong. These users are not in a frame of mind to optimize. They want to execute quickly and return to whatever is actually demanding their attention. A tool that requires learning or extended engagement will be abandoned in favor of calling a human.

The sense of permanence is particularly salient for this population. Selling shares feels irreversible in a way that feels qualitatively different from, say, moving money between accounts. Long-term investors have an emotional relationship with accumulation — they have watched balances grow over decades and selling feels like a form of loss, even when it is entirely rational. This can produce hesitation, over-analysis, and a tendency to sell less than they should and then return to the decision again shortly after.

Investors who are newly managing their own finances — recent widows or widowers, those who have left an advisor — often experience acute self-doubt layered on top of the normal anxiety. They are not only making a financial decision; they are proving something to themselves about their competence. Errors, or even the fear of errors, carry a meaning beyond the financial consequence.

---

### Prior Coping Strategies

Understanding what users do today reveals the workarounds the tool will need to displace or accommodate.

**The spreadsheet builder.** A meaningful subset of sophisticated investors maintains their own tracking spreadsheet: cost basis by lot, current balances, projected gains by accounting method. They find the information on Vanguard's portal but assemble it manually into a decision support tool they've built themselves. These users have high expectations and will compare the tool directly against their own system.

**The advisor call.** Many investors in this population have a standing relationship with a CPA, financial advisor, or both. Before making a significant withdrawal, they place a call. The advisor answers the question, the investor executes. This is slow, has a real cost (hourly fees or retainer), and is sometimes unavailable when needed. These users are not looking to the tool to replace their advisor entirely — they want to reduce the *frequency* of advisor contact for routine decisions.

**The default to average cost.** A very common passive strategy is to simply let Vanguard's default accounting method (historically average cost for mutual funds) handle the calculation and not engage with the question. These users are not optimizing; they are avoiding the decision. They may not realize they are leaving tax efficiency on the table.

**The "sell the bond fund first" heuristic.** A common folk wisdom among balanced-portfolio investors is to draw from bonds first during market downturns, equities first during upturns, as a rough rebalancing heuristic. This is directionally sound but ignores tax basis entirely and ignores lot-level variation within funds. Many users apply this rule confidently without realizing its limitations.

**The avoidance loop.** Some investors delay withdrawal decisions past the point of comfort because the decision feels too complex and the consequences of error feel too severe. They may make the withdrawal eventually but with low confidence, or they may withdraw a round number from one fund without analysis and experience lingering uncertainty about whether it was the right choice.

**The post-hoc regret pattern.** Some investors make a withdrawal, discover the tax consequences at filing time, and spend the following year trying to understand what they should have done differently — but without a tool to support that learning, the insight rarely translates into better decisions the next time.

---

## Step 2: Contextual Variation

*Method note: The following dimensions describe how user needs vary within a single tool session. The question is not "who is the user" but "what is the context that shapes what the user needs right now."*

---

### Dimension 1: Decision Urgency

**High urgency pole:** The user needs funds within days. A medical bill has arrived, a contractor requires payment, or a wire transfer is time-sensitive. The withdrawal amount is fixed by external circumstances and non-negotiable.

**Low urgency pole:** The user is planning ahead — a quarterly drawdown, an anticipated expense months away, or a tax-year-end strategy review. The amount and timing are flexible.

**How it changes what the user needs:** At high urgency, the user needs the fastest credible path to execution. Optimization is secondary to confidence and speed. Explanatory content, scenario comparison, and rationale text become obstacles rather than aids. The tool needs to surface a single trustworthy recommendation with minimal friction. At low urgency, the user has the cognitive bandwidth to explore, compare, and learn. The full feature surface — scenario comparison, manual adjustment, rationale explanations — becomes genuinely useful rather than burdensome.

---

### Dimension 2: Withdrawal Amount Relative to Portfolio Size

**High pole (large relative withdrawal):** The user is withdrawing an amount that represents a meaningful percentage of one or more fund positions — enough that fund selection and lot selection will materially affect both balance and tax outcome. There are real tradeoffs to navigate.

**Low pole (small relative withdrawal):** The withdrawal is small enough that any reasonable approach produces similar outcomes. The differences between fund selections are marginal in both tax and rebalancing terms.

**How it changes what the user needs:** At the high pole, the tool's optimization logic carries real weight — the recommendation can produce meaningfully different outcomes, and the user benefits from understanding the tradeoffs between options. Scenario comparison earns its complexity. At the low pole, the user primarily needs reassurance and simplicity. Presenting a complex scenario comparison for a small withdrawal introduces cognitive overhead disproportionate to the actual stakes and may erode rather than build trust.

---

### Dimension 3: Portfolio Drift from Target Allocation

**High drift pole:** The portfolio is already meaningfully out of balance — equities may have outperformed bonds (or vice versa) and the allocation has drifted from the user's target. The withdrawal decision is also, urgently, a rebalancing opportunity.

**Low drift pole:** The portfolio is close to its target allocation. Any fund could be drawn from without significantly worsening balance. The rebalancing dimension of the decision is nearly neutral.

**How it changes what the user needs:** At high drift, the rebalancing logic needs to be foregrounded — the tool should make clear that there is an opportunity to correct allocation while withdrawing, and the recommendation should weight this heavily. The user may need guidance on *why* the tool is recommending they sell a fund that doesn't seem like the obvious choice. At low drift, rebalancing rationale is minor and surfacing it prominently may feel like unnecessary complexity. The tax dimension dominates the recommendation logic.

---

### Dimension 4: Tax Situation Clarity

**High clarity pole:** The user knows their likely tax bracket for the year, has already accounted for other realized gains and losses, and understands roughly how additional capital gains will affect their tax liability. They have enough context to evaluate tax tradeoffs meaningfully.

**Low clarity pole:** The user doesn't know their effective rate, hasn't tracked realized gains/losses for the year, or has unusual circumstances (a large one-time income event, an inheritance, a spouse's separate income) that make their tax picture uncertain or complex.

**How it changes what the user needs:** At high clarity, the tool can present tax impact figures — projected short- and long-term gains, estimated tax liability — and expect the user to interpret them usefully. These figures are actionable inputs to the decision. At low clarity, the same figures may confuse or mislead. The user needs either a way to input their tax context, or explicit framing that the tool's tax estimates are illustrative and should be reviewed with a tax professional. Without this, a user in an unusual tax situation could be nudged toward a recommendation that is actually suboptimal for them.

---

### Dimension 5: Prior Engagement with the Tool

**First session pole:** The user is encountering the tool for the first time. They don't know what inputs it needs, what it will produce, what "scenario comparison" means, or whether to trust its recommendations. Every element requires orientation.

**Returning user pole:** The user has used the tool before — possibly multiple times. They know the workflow, they have expectations about what the tool will show them, and they may have a saved scenario or prior recommendation as a reference point.

**How it changes what the user needs:** First-session users need progressive disclosure, contextual explanation, and explicit trust signals — particularly around the AI recommendation in Workflow A. They need to understand *what the tool is doing* before they can evaluate whether to act on it. Returning users need efficiency: the ability to skip orientation, recall prior decisions, and move quickly to the part of the workflow that's relevant this session. A tool optimized only for first-time users will feel patronizing to returning users; one optimized only for returning users will be disorienting and untrustworthy to first-timers.

---

### Dimension 6: Confidence in the Withdrawal Amount

**Determined pole:** The user knows exactly how much they need. The dollar figure is set — by a bill, by a budget, by an RMD calculation. The decision space is about *which funds* to sell, not *how much* to withdraw.

**Exploratory pole:** The user knows they want to take something out but is open to adjusting the amount based on what the tool reveals. They might take more if it creates a good tax-harvesting opportunity, or less if the tax consequences of their target amount are worse than expected.

**How it changes what the user needs:** At the determined pole, the tool should accept a fixed input and optimize around it without prompting reconsideration of the amount itself. Suggestions to "consider withdrawing a slightly different amount" would feel presumptuous or confusing. At the exploratory pole, the tool can legitimately surface insights that invite the user to reconsider the amount — for example, flagging that withdrawing $500 more would allow full harvesting of a loss position, or that the target amount falls just over a threshold that triggers a higher gains rate. This is high-value guidance that only applies to users who have decision latitude.

---

### Dimension 7: Emotional State at Session Entry

**Calm and deliberate pole:** The user has set aside time for this. They're not under immediate pressure. They are willing to engage with complexity and learn from the tool.

**Stressed or reactive pole:** The user is making this decision under emotional load — financial anxiety, grief, family crisis, or simply the cumulative stress of managing a major financial transition. Their cognitive bandwidth is reduced and their tolerance for friction is low.

**How it changes what the user needs:** This dimension is largely invisible to the tool — there is no direct signal that distinguishes a calm session from a stressed one based on behavior alone. But the design implication is that the tool must be legible and trustworthy enough to serve both states without asking the user to self-identify. This means: no dead ends that require backtracking, no jargon without plain-language alternatives, no recommendations without at least a brief rationale, and a clear and always-accessible path to human support.

---

### Dimension 8: Fund-Level Complexity of the Portfolio

**High complexity pole:** The user holds many funds — perhaps 8–12 — accumulated over decades, with layered cost basis histories, multiple lot vintages, a mix of short- and long-term positions, and possibly a mix of account types (taxable, traditional IRA, Roth IRA) that interact with each other in tax terms.

**Low complexity pole:** The user holds 2–4 funds with relatively straightforward cost basis histories — few lots, primarily long-term positions, a single account type.

**How it changes what the user needs:** At high complexity, the tool's value is greatest but the data presentation challenge is most acute. The user cannot absorb a fund-by-fund, lot-by-lot breakdown without cognitive scaffolding — progressive disclosure, intelligent summarization, and clear signposting of what matters most. At low complexity, the full data picture can be shown without overwhelming, and the user may actually want to see more detail rather than less. The tool should adapt its information density rather than applying a single display template across the complexity range.

---

## Step 3: Segment Derivation

*Method note: Segments are derived by letting dimensions cluster naturally. Dimensions 1, 6, and 7 are treated as a single composite axis — **session pressure** — representing the combined effect of urgency, amount flexibility, and emotional state. Dimension 5 (prior engagement) is excluded from segment generation and appears only as annotated design implications within each segment.*

---

### Segment A: The Strategic Optimizer

**Composite session pressure (D1+D6+D7):** Low urgency, exploratory amount, calm and deliberate.
**Withdrawal size relative to portfolio (D2):** Large — enough that fund selection materially affects both balance and tax outcome.
**Portfolio drift (D3):** Significant — the portfolio has drifted meaningfully and the withdrawal is also a rebalancing opportunity.
**Tax situation clarity (D4):** High — this user knows their bracket, has tracked realized gains for the year, and can interpret tax impact figures as actionable inputs.
**Portfolio complexity (D8):** High — many funds, layered lot histories, possibly multiple account types.

**What this user needs from the tool in this session:**
This user wants maximum information density and genuine optimization, not reassurance. They will scrutinize the AI recommendation and expect to understand *why* it made the choices it did — at the lot level if necessary. They are likely to move between Workflow A and Workflow B, using the system recommendation as a starting point and then adjusting manually based on their own judgment. The Scenario Comparison view is where this user lives: they will construct multiple scenarios, compare them deliberately, and may save or export the results. They are also the most likely to find tool limitations frustrating — if the optimization logic doesn't account for something they consider important (e.g., wash-sale implications, multi-account interactions), they will notice.

**First-session implication:** A first-session Strategic Optimizer may distrust the tool initially, not because they lack sophistication but because they have a well-developed existing system — a spreadsheet, an advisor, a mental model — and will be benchmarking the tool against it. The first session is an audition. If the tool's recommendation matches or improves on what they would have done themselves, trust is established quickly. If it doesn't, and no explanation is offered, they may disengage permanently.

**Returning-user implication:** Returning Strategic Optimizers will want to move fast. They've already evaluated the tool and will be impatient with orientation elements. They may want to begin directly in Workflow B with the prior session's scenario as a reference.

---

### Segment B: The Routine Executor

**Composite session pressure (D1+D6+D7):** Low urgency, determined amount, mild background anxiety but fundamentally calm. This user has done this before — perhaps many times — and the withdrawal is part of an established pattern (quarterly drawdown, RMD, regular expense coverage).
**Withdrawal size relative to portfolio (D2):** Small to moderate — meaningful in absolute dollar terms but a small percentage of total holdings. Individual fund and lot decisions have limited impact on overall outcomes.
**Portfolio drift (D3):** Low to moderate — the portfolio hasn't drifted dramatically, and rebalancing is not an urgent driver.
**Tax situation clarity (D4):** Moderate — this user knows roughly what to expect at tax time but doesn't track it closely. They have a general sense that capital gains matter but have not optimized at the lot level.
**Portfolio complexity (D8):** Moderate — a manageable number of funds, some cost basis complexity but not overwhelming.

**What this user needs from the tool in this session:**
Efficiency and confirmation, not exploration. This user has a routine and wants the tool to support it with minimal friction. Workflow A is their natural entry point: enter an amount, receive a recommendation, confirm it looks reasonable, execute. They are unlikely to build multiple scenarios for a routine withdrawal, and prompting them to do so may feel like the tool is making a simple task complicated. The most important thing the tool can do for this user is be *predictably consistent* — if the recommendation logic produces a similar pattern each time, they build trust in it and the tool becomes a reliable fixture in their financial routine.

**First-session implication:** The Routine Executor may arrive expecting something like the existing Vanguard transaction flow. The concept of an "optimized recommendation" may be slightly unfamiliar. They need a very short explanation of what the tool does differently — not a tutorial, just a single orienting sentence — before they can engage with the recommendation confidently.

**Returning-user implication:** This user should be able to complete a session faster than the first time. If the tool remembers prior withdrawal patterns or displays a summary of the last session, that continuity is genuinely useful — it confirms the tool knows their situation and reduces the sense that they're starting from zero each time.

---

### Segment C: The Reactive Withdrawer

**Composite session pressure (D1+D6+D7):** High urgency, determined amount (set by external circumstance), elevated stress. The withdrawal need has arrived faster than expected or under emotionally difficult conditions — a medical bill, a family emergency, an unexpected large expense. This user is not choosing to engage with this decision; they are compelled to.
**Withdrawal size relative to portfolio (D2):** Variable, but the amount is non-negotiable. Whether it is large or small, the user cannot adjust it.
**Portfolio drift (D3):** Unknown and low-priority to the user in this moment — they are not thinking about rebalancing.
**Tax situation clarity (D4):** Low — the user is not in a frame of mind to engage with tax complexity, and may not have the information needed to evaluate it even if they wanted to.
**Portfolio complexity (D8):** Any level — complexity compounds the problem but does not define the segment.

**What this user needs from the tool in this session:**
A fast, credible path to executing a specific dollar amount, with a recommendation they can accept without needing to understand fully. Rationale and scenario comparison are not valuable in this session — they are friction. The most important design requirement for this user is that the tool does not make them feel they are doing something wrong by not engaging more deeply. The recommendation should be presented as complete and trustworthy on its own, with depth available but not foregrounded. Critically, the path from recommendation to execution must be as short as possible, and the tool must clearly communicate what will happen next so the user does not feel uncertainty at the moment of commitment.

This user is also at the highest risk of abandonment. If the tool requires inputs they don't have, presents complexity they can't parse, or fails to provide a clear "just do this" answer, they will call a human instead.

**First-session implication:** A first-session Reactive Withdrawer is in the most vulnerable position of any user in this product. They need help, they are under pressure, and they are encountering an unfamiliar tool. The tool must earn trust almost instantly — a brief, plain-language explanation of what it will do, followed by a minimal-input recommendation, is the only viable path. The alternative — a multi-step onboarding experience — will cause immediate abandonment.

**Returning-user implication:** A returning Reactive Withdrawer is somewhat better positioned, but stress still dominates. Efficiency gains from familiarity are meaningful here — this is the user most helped by remembered preferences, pre-populated inputs, and a reduced-step execution flow.

---

### Segment D: The Newly Self-Directed Investor

**Composite session pressure (D1+D6+D7):** Moderate urgency, uncertain amount, emotionally complex. This user is managing their own investment withdrawals for the first time — following the death of a spouse, a divorce, the end of an advisor relationship, or a life transition that has shifted financial responsibility onto them. They know they need to do this but are not sure how much to take or from where. The anxiety is not purely about the transaction; it is about competence and self-trust.
**Withdrawal size relative to portfolio (D2):** Uncertain — they may be establishing what a sustainable withdrawal looks like for the first time.
**Portfolio drift (D3):** Unknown — they may not have a clear target allocation or may be inheriting one they don't fully understand.
**Tax situation clarity (D4):** Low to moderate — they may be aware that taxes matter but lack the context to evaluate specific tradeoffs.
**Portfolio complexity (D8):** Moderate to high — they are often working with a portfolio someone else built, which they understand partially or not at all.

**What this user needs from the tool in this session:**
Orientation as much as optimization. Before this user can benefit from a recommendation, they need to understand what they're looking at — what their portfolio is, what it's currently weighted toward, what a "balanced" allocation means in their context. The tool's primary job in the early part of a session with this user is to create comprehension, not to drive toward execution. A recommendation presented without that foundation will not be trusted, because this user has no internal benchmark to evaluate it against.

This user also needs explicit reassurance at commitment points. Language that normalizes the decision — that what they're doing is reasonable, that the tool is helping them make a sound choice, that they are not doing something irreversible without knowing it — matters more here than for any other segment. And unlike the Reactive Withdrawer, this user is not in a hurry. They may want to pause, look something up, return later. The tool must be comfortable with incomplete sessions.

**First-session implication:** Virtually every session for this user is, in practice, a first-session experience — even if they've logged in before, each withdrawal decision feels new. Progressive disclosure is essential. The tool should not reveal full complexity until the user has signaled readiness to engage with it. Workflow A is the natural starting point, but the rationale text accompanying the recommendation carries unusually high weight: it is not just explaining a recommendation, it is teaching the user how to think about this class of decision.

**Returning-user implication:** Returning sessions with this user represent a genuine opportunity for the tool to function as a learning environment. If the tool can gently surface what happened last time — what was recommended, what was executed, what the outcome was in portfolio terms — it supports the user in building a mental model over time. This is the segment most likely to be transformed from anxious to confident through repeated positive tool interactions.

---

### Segment Map Summary

| | **Session Pressure** | **Withdrawal Size** | **Portfolio Drift** | **Tax Clarity** | **Portfolio Complexity** | **Triggering Situation** | **What the Tool Must Avoid** |
|---|---|---|---|---|---|---|---|
| **A: Strategic Optimizer** | Low / Exploratory / Calm | Large | High | High | High | Year-end tax review or meaningful portfolio drift creates a deliberate, calendar-driven opportunity to withdraw and rebalance simultaneously. | Hiding or summarizing away the reasoning behind the recommendation; presenting a single "take it or leave it" output without exposing the tradeoffs that drove it. |
| **B: Routine Executor** | Low / Determined / Mild | Small–Moderate | Low–Moderate | Moderate | Moderate | A recurring personal expense — monthly living costs, quarterly estimated taxes — triggers a withdrawal that is functionally identical to ones made before. | Adding decision steps or scenario-building prompts that are disproportionate to the stakes of a routine, small-impact withdrawal. |
| **C: Reactive Withdrawer** | High / Fixed / Stressed | Variable (non-negotiable) | Unknown | Low | Any | An unexpected bill or emergency creates an immediate, non-negotiable need for a specific dollar amount within a short time window. | Requiring inputs the user doesn't have or presenting complexity before delivering a clear, executable recommendation; making the user feel they are doing something wrong by not engaging more deeply. |
| **D: Newly Self-Directed** | Moderate / Uncertain / Complex | Uncertain | Unknown | Low–Moderate | Moderate–High | A life transition — death of a spouse, end of an advisor relationship, divorce — has placed withdrawal responsibility on someone who has never made this decision alone before. | Presenting a recommendation before the user has enough orientation to evaluate it; using jargon or assuming familiarity with portfolio concepts the user may be encountering for the first time. |

---

## Step 4: Key Findings and How Might We

### Part A: Key Research Findings

**Finding 1: Tax optimization and portfolio rebalancing are cognitively separate tasks for most users, even when they occur simultaneously.**
Investors in this population do not naturally frame withdrawal decisions as a unified tax-plus-rebalancing problem. They tend to approach one dimension first — usually whichever feels more urgent or more familiar — and treat the other as secondary or ignore it entirely. The "sell bonds first" heuristic is evidence of this: it is a rebalancing rule that users apply with confidence while remaining unaware of its tax implications. A tool that presents both dimensions together may not be understood as solving one problem; it may be perceived as solving two problems at once, which reads as complexity rather than value.

**Finding 2: The moment of withdrawal carries a disproportionate emotional weight relative to its financial complexity.**
Selling feels irreversible to long-term accumulators in a way that other financial transactions do not, regardless of the actual dollar amount or tax consequence involved. This affective response — loss aversion expressed as hesitation at the point of execution — is likely to be present across all segments and is not resolved by better information alone. Users may understand intellectually that a withdrawal is appropriate and still experience friction at the moment of commitment that has no rational basis.

**Finding 3: A significant subset of users has already built a personal workaround system, and those systems set the benchmark against which any tool will be evaluated.**
Spreadsheet builders, advisor-callers, and users with established heuristics are not passive recipients of a new tool — they are active evaluators comparing it against something they already trust. If the tool's recommendation diverges from their own system without explanation, it will lose the comparison by default. The tool's first job with this subset is not to optimize; it is to demonstrate that it understands the problem as well as they do.

**Finding 4: Users' ability to act on tax impact information is contingent on having tax context the tool cannot assume they possess.**
Presenting projected capital gains figures or estimated tax liability is only useful to a user who knows their marginal rate, has tracked their realized gains for the year, and understands how the figures interact with their broader tax situation. A meaningful portion of this population lacks one or more of these inputs — not because they are unsophisticated, but because their tax situation involves variables outside the portfolio (spousal income, one-time events, state tax variation) that the tool has no visibility into. Displaying tax impact figures to users without this context may create false precision and misplaced confidence.

**Finding 5: The population contains users for whom the withdrawal decision is also a first experience of financial self-direction, and these users have fundamentally different orientation needs than those making routine decisions.**
Life transitions — widowhood, divorce, advisor departure — place some users in front of this decision without the mental models needed to evaluate recommendations. These users are not a small edge case; they represent a structurally recurring entry point into this user population. Their primary need is comprehension before optimization, and a tool that leads with a recommendation before establishing comprehension will not be trusted — and may actively increase anxiety rather than reduce it.

**Finding 6: Withdrawal triggers vary enough in urgency, emotional load, and decision latitude that a single interaction model cannot serve all of them well.**
The same user, in different sessions, may be making a calm year-end strategic decision or an urgent emergency withdrawal. These sessions require meaningfully different tool behaviors — not just different content, but different pacing, information density, and paths to execution. A tool calibrated for the deliberate session will create friction in the urgent one; a tool calibrated for urgency will feel shallow and limiting in the deliberate one. Session context, not user identity, is the primary driver of what the tool needs to do.

**Finding 7: The post-hoc regret pattern suggests that users lack a feedback loop between withdrawal decisions and their tax consequences.**
Investors who discover the tax impact of a withdrawal at filing time are unable to connect that outcome back to the specific decision that caused it, or to learn from it in a way that improves future decisions. This is not a tool failure — it is an absence of a tool entirely. It suggests that the population has an unmet need not just for decision support at the moment of withdrawal, but for outcome visibility afterward: a way to see, in retrospect, what a decision cost and what an alternative would have cost.

---

### Part B: How Might We Questions

**HMW 1** *(from Finding 1)*
How might we present the tax and rebalancing dimensions of a withdrawal decision as a single integrated recommendation without requiring users to first understand that these are two separate problems being solved simultaneously?

*Design tension: A unified output obscures the reasoning; a two-part explanation restores the reasoning but reintroduces the cognitive separation the tool is trying to collapse.*

---

**HMW 2** *(from Finding 2)*
How might we reduce execution hesitation at the point of commitment without undermining the user's sense that they are making a considered, reversible-feeling decision?

*Design tension: Friction reduction (fewer steps, faster execution) conflicts with the user's need to feel that something consequential is being treated with appropriate weight. Removing friction may remove the reassurance that friction inadvertently provides.*

---

**HMW 3** *(from Finding 3)*
How might we earn the trust of users who arrive with an existing decision-making system, in cases where our recommendation diverges from what their system would produce?

*Design tension: Explaining the divergence in enough detail to satisfy a sophisticated user risks overwhelming a less sophisticated one. Summarizing the explanation to protect less sophisticated users risks appearing to hide reasoning from sophisticated ones.*

---

**HMW 4** *(from Finding 4)*
How might we present tax impact information in a way that is useful to users who have their tax context, without being misleading to users who do not?

*Design tension: Qualifying every tax figure with uncertainty language protects uninformed users but degrades the signal for informed ones. Presenting figures without qualification serves informed users but may produce false confidence in uninformed ones.*

---

**HMW 5** *(from Finding 5)*
How might we sequence the tool's output so that users who need orientation before they can evaluate a recommendation receive it, without forcing users who don't need it to sit through it?

*Design tension: Adaptive sequencing based on inferred user state risks misclassifying users and delivering the wrong experience. Offering the user an explicit choice of path adds a decision before the first decision, which may itself be disorienting to the users who most need guidance.*

---

**HMW 6** *(from Finding 6)*
How might we allow the same tool to serve a high-urgency, low-bandwidth session and a low-urgency, high-engagement session without requiring the user to declare which mode they are in?

*Design tension: Designing for the urgent session produces a tool that feels too simple for the deliberate one. Designing for the deliberate session produces a tool that is too slow for the urgent one. A mode-selection mechanism solves the problem logically but adds a step that the urgent user — the one who most needs it resolved — is least equipped to navigate.*

---

**HMW 7** *(from Finding 7)*
How might we create a feedback loop between a withdrawal decision and its eventual tax outcome, in a way that builds user capability over time rather than simply surfacing a result they can't act on retroactively?

*Design tension: Post-hoc outcome visibility is most useful if it connects to a future decision — but the connection between a past withdrawal and a future one may be months or years away, making continuity across sessions both technically and experientially difficult to sustain.*

---

**HMW 8** *(from Findings 1 and 3 combined)*
How might we design the manual workflow so that it functions as a genuine learning environment for users building their own intuition, rather than just a data entry interface for users who already know what they want to do?

*Design tension: A learning-oriented manual workflow adds contextual guidance, explanatory labels, and real-time feedback — all of which increase cognitive load and reduce efficiency for users who are using the manual workflow precisely because they want direct control without mediation.*
