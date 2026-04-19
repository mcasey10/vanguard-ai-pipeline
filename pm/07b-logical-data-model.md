# Logical Data Model

*PM-level logical model. This document defines the entities the system must represent and their relationships. It is not a database schema and does not specify data types, normalization, or implementation structure.*

---

## Entities

---

### 1. User / Investor

**Definition:** The authenticated Vanguard account holder accessing the Sell & Rebalance tool.

**Required attributes:**
- *User identifier:* The unique identifier linking this user to their Vanguard portal account and all associated portfolio and account data.
- *First session flag:* Whether the user has completed at least one full session in this tool, used to determine coach mark behavior.
- *Prior session reference:* A pointer to the user's most recent Withdrawal Session, used to determine deep-link entry eligibility and returning user behavior.
- *Prior session engagement signal:* The duration and outcome of the user's most recent session (duration in minutes, whether a scenario was saved), used to apply the deep-link suppression threshold per PM Decision 9.

**Relationships:**
- A User has one or more Portfolios.
- A User has zero or more Withdrawal Sessions.

---

### 2. Portfolio

**Definition:** The aggregate of all investment accounts held by a User within Vanguard, treated as a single view for the purposes of withdrawal and rebalancing decisions.

**Required attributes:**
- *Total investable balance:* The sum of current market value across all eligible accounts and holdings.
- *Current allocation:* The aggregate percentage weight of each asset class (equity, bond, other) across all holdings, calculated at the time of session initiation.
- *Target allocation:* The user's stated desired allocation split across asset classes. May be absent if the user has not set one (see Target Allocation entity).
- *Allocation drift:* The difference between current allocation and target allocation for each asset class, calculated at session initiation.

**Relationships:**
- A Portfolio belongs to one User.
- A Portfolio contains one or more Accounts.
- A Portfolio has zero or one Target Allocation.

---

### 3. Account

**Definition:** A single investment account within the user's Portfolio, distinguished by its tax treatment type.

**Required attributes:**
- *Account identifier:* The unique identifier for this account within Vanguard's systems.
- *Account type:* The tax treatment classification of the account — taxable brokerage, traditional IRA, or Roth IRA. Determines which accounting methods are available and what tax consequences apply to withdrawals.
- *Account balance:* The total current market value of all holdings within this account.
- *RMD applicability flag:* Whether this account is subject to Required Minimum Distribution rules for the current tax year.
- *Settlement account link:* The linked settlement or money market account to which withdrawal proceeds are directed by default.

**Relationships:**
- An Account belongs to one Portfolio.
- An Account contains one or more Fund Holdings.
- An Account has zero or one RMD Record.

---

### 4. Fund / Holding

**Definition:** A single mutual fund or investment held within an Account, representing the user's position in that fund.

**Required attributes:**
- *Fund identifier:* The unique identifier for this fund (e.g., ticker or Vanguard fund code).
- *Fund name:* The plain-language name of the fund as displayed to the user.
- *Asset class:* The primary asset class of the fund — equity, bond, or other — used in allocation calculations.
- *Current balance (shares):* The total number of shares held in this fund within the account.
- *Current balance (dollar value):* The current market value of all shares held, calculated using the most recent available price.
- *Current allocation weight:* This fund's percentage of the total portfolio value.
- *Target allocation weight:* This fund's desired percentage of the total portfolio value, drawn from the Target Allocation. May be absent if no target allocation is set.
- *Allocation drift:* The difference between current and target allocation weight for this fund. Positive values indicate overweight; negative values indicate underweight.
- *Available accounting methods:* The accounting methods available for lot selection when selling this fund within this account type — FIFO, average cost, specific lot identification, or a subset thereof.
- *Unrealized short-term gain/loss:* The aggregate unrealized gain or loss across all short-term lots in this fund.
- *Unrealized long-term gain/loss:* The aggregate unrealized gain or loss across all long-term lots in this fund.

**Relationships:**
- A Fund Holding belongs to one Account.
- A Fund Holding contains one or more Lots.

---

### 5. Lot

**Definition:** A discrete purchase of shares within a Fund Holding, with its own acquisition date, cost basis, and holding period, representing the smallest unit of tax lot tracking.

**Required attributes:**
- *Lot identifier:* The unique identifier for this lot within the fund and account.
- *Acquisition date:* The date on which these shares were purchased or acquired, used to determine holding period.
- *Shares in lot:* The number of shares acquired in this lot that remain unsold.
- *Cost basis per share:* The original purchase price per share for this lot, used to calculate gain or loss on sale.
- *Current value per share:* The current market price per share, used to calculate unrealized gain or loss.
- *Holding period classification:* Whether this lot is currently classified as short-term (held less than one year) or long-term (held one year or more).
- *Days to long-term conversion:* If the lot is short-term, the number of calendar days remaining until the one-year holding threshold is reached. Used to trigger the Wait & Save interrupt.
- *Unrealized gain/loss:* The difference between the current value and cost basis for the shares remaining in this lot.
- *Realized gain/loss if sold:* The gain or loss that would be recognized if this lot were fully sold at the current price, calculated at the active tax rate assumption. Displayed in real time in Workflow B.

**Relationships:**
- A Lot belongs to one Fund Holding.
- A Lot may be included in one or more Scenarios (as a selected lot for sale).

---

### 6. Target Allocation

**Definition:** The user's stated desired distribution of portfolio value across asset classes and, optionally, individual funds, used as the reference point for rebalancing recommendations.

**Required attributes:**
- *Equity target percentage:* The desired percentage of total portfolio value allocated to equity funds.
- *Bond target percentage:* The desired percentage of total portfolio value allocated to bond funds.
- *Other target percentage:* The desired percentage of total portfolio value allocated to funds not classified as equity or bond, if applicable.
- *Fund-level targets:* The desired percentage allocation for each individual fund held, if specified at the fund level rather than only at the asset class level.
- *Source:* Whether this allocation was set through the full Vanguard allocation wizard or through the simplified inline editor within this tool.
- *As-of date:* The date on which the target allocation was last set or modified.

**Relationships:**
- A Target Allocation belongs to one Portfolio.
- A Target Allocation is referenced by the Recommendation and Scenario entities for allocation drift calculations.

---

### 7. Withdrawal Session

**Definition:** A single instance of a user's engagement with the Sell & Rebalance tool, from entry through either transaction execution or exit, representing all state generated during that engagement.

**Required attributes:**
- *Session identifier:* The unique identifier for this session.
- *Session start timestamp:* When the session began.
- *Session status:* Whether the session is active, incomplete (withdrawal amount entered, no transaction executed), or completed (transaction executed).
- *Target withdrawal amount:* The dollar amount the user entered as their withdrawal goal for this session.
- *Destination account:* The settlement or cash account to which withdrawal proceeds will be directed.
- *Active tax assumption set:* The Tax Assumption Set in use for this session, either the system default or a user-selected bracket.
- *Stored Workflow A recommendation:* The system-generated Recommendation produced in this session, held in memory regardless of Workflow B activity.
- *Saved scenarios:* The set of Scenarios saved during this session (maximum three).
- *Session duration:* The elapsed time of the session, used to apply the deep-link suppression threshold for returning users.

**Relationships:**
- A Withdrawal Session belongs to one User.
- A Withdrawal Session has zero or one Recommendation (the Workflow A system recommendation).
- A Withdrawal Session has zero to three Scenarios.
- A Withdrawal Session references one Tax Assumption Set.

---

### 8. Scenario

**Definition:** A named, saved configuration of fund and lot selections, sell amounts, and accounting methods that together represent one approach to meeting the target withdrawal amount, along with the projected tax and allocation outcomes of that configuration.

**Required attributes:**
- *Scenario identifier:* The unique identifier for this scenario within the session.
- *Scenario label:* The user-facing name for this scenario. System-generated by default; user-editable.
- *Origin:* Whether this scenario was generated by the system (Workflow A recommendation saved as a scenario) or constructed manually (Workflow B configuration saved as a scenario).
- *Fund sell instructions:* For each fund included in this scenario: the fund identifier, the dollar amount to sell, the accounting method applied, and the specific lots selected (if specific lot identification was used).
- *Total sell amount:* The sum of all fund sell amounts in this scenario.
- *Shortfall or overage:* The difference between the total sell amount and the target withdrawal amount — positive if the scenario overshoots, negative if it falls short.
- *Projected short-term gains:* The estimated short-term capital gains that would be realized by executing this scenario, at the active tax rate assumption.
- *Projected long-term gains:* The estimated long-term capital gains that would be realized by executing this scenario, at the active tax rate assumption.
- *Estimated tax liability:* The total estimated capital gains tax that would result from executing this scenario, at the active tax rate assumption.
- *Resulting allocation:* The portfolio allocation (by asset class and fund) that would result from executing this scenario, compared to target.
- *Plain-language tradeoff summary:* The system-generated sentence describing the primary tradeoff this scenario represents relative to the others in the comparison view.

**Relationships:**
- A Scenario belongs to one Withdrawal Session.
- A Scenario references one or more Lots (the lots selected for sale).
- A Scenario references one Tax Assumption Set (the active assumption at the time of generation or last recalculation).

---

### 9. Recommendation

**Definition:** The system-generated, optimization-engine-produced withdrawal configuration representing the optimal approach to meeting the target withdrawal amount given the user's portfolio, tax situation, and target allocation, produced by Workflow A.

**Required attributes:**
- *Recommendation identifier:* The unique identifier for this recommendation within the session.
- *Fund sell instructions:* For each fund included in the recommendation: the fund identifier, the dollar amount to sell, the accounting method applied, and the specific lots selected.
- *Total sell amount:* The sum of all fund sell amounts in the recommendation.
- *Optimization priority applied:* Whether the recommendation was generated under the default tax-efficiency-first priority or the user-requested balance-first alternative.
- *Projected short-term gains:* The estimated short-term capital gains that would be realized by executing this recommendation.
- *Projected long-term gains:* The estimated long-term capital gains that would be realized by executing this recommendation.
- *Estimated tax liability:* The total estimated capital gains tax that would result from executing this recommendation.
- *Resulting allocation:* The portfolio allocation that would result from executing this recommendation, compared to target.
- *Allocation drift notice flag:* Whether the recommendation triggers the notice that the tax-optimal result produces meaningful allocation drift.
- *Plain-language rationale:* The system-generated sentence explaining the primary logic of the recommendation, free of jargon.
- *Progressive disclosure detail:* The pre-computed expanded detail layer, including tax impact score vs. FIFO baseline, allocation improvement score vs. no-rebalancing baseline, and lot-level detail for each fund included.
- *Balance-priority alternative:* The system-generated alternative recommendation produced if the user requests a balance-first version, stored alongside the primary recommendation.

**Relationships:**
- A Recommendation belongs to one Withdrawal Session.
- A Recommendation references one Tax Assumption Set.
- A Recommendation references one or more Lots.
- A Recommendation may be saved as a Scenario.

---

### 10. Tax Assumption Set

**Definition:** The set of capital gains rate assumptions active for a session, used as the basis for all tax impact calculations throughout the tool.

**Required attributes:**
- *Short-term capital gains rate:* The percentage rate applied to short-term gains in all calculations. Default: 24%.
- *Long-term capital gains rate:* The percentage rate applied to long-term gains in all calculations. Default: 15%.
- *Income bracket label:* The plain-language income range this rate set corresponds to (e.g., "Income between $X and $Y").
- *Source:* Whether this assumption set is the system default or was selected by the user from the bracket table.
- *Selection timestamp:* When the assumption set was last set or changed within the session.

**Relationships:**
- A Tax Assumption Set is referenced by one Withdrawal Session.
- A Tax Assumption Set is referenced by all Scenarios and the Recommendation within that session.
- A Tax Assumption Set change triggers recalculation of all tax impact figures across all Scenarios and the active Recommendation.

---

### 11. RMD Record

**Definition:** The Required Minimum Distribution data for a single Account in the current tax year, sourced from Vanguard's authoritative RMD calculation system.

**Required attributes:**
- *Account reference:* The Account to which this RMD record applies.
- *RMD required for year:* The total dollar amount required to be distributed from this account in the current tax year, per IRS rules.
- *RMD distributed year-to-date:* The dollar amount already distributed from this account in the current tax year.
- *RMD remaining:* The difference between the required amount and the amount already distributed — the outstanding RMD balance for the year.
- *As-of date:* The date through which the distributed amount is current, reflecting the processing lag of Vanguard's tax records system.

**Relationships:**
- An RMD Record belongs to one Account.
- An RMD Record is displayed as a notice within the Withdrawal Session but does not block or branch the workflow.

---

### 12. YTD Gains Record

**Definition:** The year-to-date realized capital gains for the user's portfolio in the current tax year, sourced from Vanguard's tax records system, used to contextualize the incremental tax impact of the planned withdrawal.

**Required attributes:**
- *Short-term gains realized YTD:* The total short-term capital gains already realized across all accounts in the current tax year.
- *Long-term gains realized YTD:* The total long-term capital gains already realized across all accounts in the current tax year.
- *As-of date:* The date through which the YTD figures are current, reflecting any processing lag in Vanguard's tax records system.
- *Data completeness flag:* Whether the record reflects all transactions through the as-of date or whether known gaps exist (e.g., recent trades not yet processed).

**Relationships:**
- A YTD Gains Record belongs to one Portfolio (aggregated across all accounts).
- A YTD Gains Record is displayed alongside the Tax Assumption Set at Step A3 and carried forward as context throughout the session.
- A YTD Gains Record informs the incremental tax impact calculation in the Recommendation and all Scenarios but is not an input to the optimization engine directly.

---

## Sample Data Coverage Requirements

*The following cases represent the minimum scenarios that sample or test data must exercise to validate the tool's logic. Each is stated as a test case description. Data records should be constructed to instantiate each case.*

---

**Case 1 — Baseline moderate complexity, no edge conditions**
A user with a two-account portfolio (one taxable brokerage, one traditional IRA), four funds across both accounts, a mix of short-term and long-term lots in each fund, a defined target allocation, no RMD requirement, and YTD gains in both short-term and long-term categories. This case validates the core happy path for both Workflow A and Workflow B with no special conditions triggered.

**Case 2 — High portfolio complexity**
A user with three accounts (taxable, traditional IRA, Roth IRA), ten or more funds across all accounts, fifteen or more open lots across multiple funds, layered cost basis histories from many years of contributions and reinvestments, and significant allocation drift. This case validates the tool's performance and display behavior at the high end of the complexity range and exercises the data table layout in Workflow B.

**Case 3 — No target allocation on record**
A user with a portfolio that has no target allocation set in Vanguard's system. This case validates the graceful degradation to tax-only mode, the prominent notice display, and the inline allocation editor including the 50/50 default and user modification behavior.

**Case 4 — RMD-affected account present**
A user with at least one account subject to an RMD in the current tax year, with a known required amount and a year-to-date distributed amount that leaves a non-zero remaining balance. This case validates RMD notice display, remaining balance calculation, and the behavior of the notice as informational-only (non-blocking).

**Case 5 — Wait & Save condition present**
A user with at least one lot in at least one fund that is within 30 days of converting from short-term to long-term status. This case validates the Wait & Save interrupt trigger, the lot-level notice display, the tax difference calculation, and both the exclude and include-and-proceed paths including the shortfall recalculation if the lot is excluded.

**Case 6 — Tax-optimal recommendation produces meaningful allocation drift**
A portfolio where the tax-optimal lot selection strategy (e.g., selling lots with harvestable losses or long-term lots) draws disproportionately from one asset class, resulting in a post-sale allocation that meaningfully deviates from the user's target. This case validates the allocation drift notice, the user's ability to request a balance-prioritized alternative recommendation within Workflow A, and the display of that alternative.

**Case 7 — Harvestable loss present**
A user with at least one lot in at least one fund where the current value is below the cost basis, creating an unrealized loss that could offset realized gains if sold. This case validates that the optimization engine correctly identifies and surfaces this opportunity, that the visual indicator appears in Workflow B, and that the lot is included in the recommendation when it improves tax efficiency.

**Case 8 — Large relative withdrawal (exceeds 10% of portfolio value)**
A user whose entered withdrawal amount exceeds 10% of their total portfolio value. This case validates the soft informational notice at Step A2 and confirms that the tool proceeds without blocking the user.

**Case 9 — YTD gains data unavailable**
A session in which the call to retrieve YTD realized gains data returns no result or an error. This case validates the tool's behavior when this data is missing: the appropriate notice is surfaced, the session proceeds without the YTD summary, and no calculation dependent on YTD data is presented as if the data were present.

**Case 10 — Returning user with prior incomplete session**
A user whose most recent prior session lasted more than 5 minutes and resulted in at least one saved scenario but no executed transaction. This case validates the deep-link entry path, the "Continue where you left off" label, and the surfacing of prior session context at Step A2 entry.

**Case 11 — Returning user below deep-link suppression threshold**
A user whose most recent prior session lasted fewer than 5 minutes and resulted in no saved scenario. This case validates that the deep-link entry path is suppressed and the user is shown the full tool entry screen instead.

**Case 12 — Three-scenario comparison**
A session in which the user saves a Workflow A recommendation as Scenario 1, builds and saves a manual configuration in Workflow B as Scenario 2, modifies that configuration and saves it as Scenario 3, and then selects one to execute. This case validates the full Scenario Comparison view with three populated columns, the plain-language tradeoff summary generation for each, and the execution path from the comparison view.

**Case 13 — Workflow B entry without prior Workflow A recommendation**
A user who navigates directly to Workflow B from the tool entry screen without first going through Workflow A. This case validates that all sell amount fields are blank on entry, that the "Return to system recommendation" control is absent or inactive (as there is no stored recommendation), and that the user can build and save a scenario without a Workflow A starting point.

**Case 14 — Non-default tax bracket selected**
A user who opens the rate table at Step A3 and selects a bracket other than the default mid-range. This case validates that the selected rate is applied consistently across all tax impact calculations in the session — in the recommendation, in all Workflow B real-time recalculations, in all saved scenarios, and in the Scenario Comparison view — and that changing the bracket after scenarios have been saved triggers recalculation of all affected figures.

**Case 15 — Accounting method change mid-session in Workflow B**
A user who changes the accounting method for a fund partway through building a manual configuration in Workflow B. This case validates that all tax impact figures for the affected fund recalculate immediately, that the running total and allocation figures update accordingly, and that the method change is stored correctly in the saved scenario.
