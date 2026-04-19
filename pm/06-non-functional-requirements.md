# Non-Functional Requirements

---

## Section 1: Performance

**REQ-NF-PERF-001:** The optimization engine must return a completed recommendation within 5 seconds of the user proceeding from Step A3 for portfolios up to moderate complexity (up to 6 funds, up to 50 open lots). This is a user-facing SLA — exceeding it requires a loading state per REQ-A4-005.
Priority: Must
Source: Step A4, TECH-02

**REQ-NF-PERF-002:** For high-complexity portfolios (7 or more funds, 51 or more open lots), the optimization engine must return a completed recommendation within 10 seconds. A loading state with reassuring messaging must be displayed from second 3 onward. This is a user-facing SLA.
Priority: Must
Source: Step A4, TECH-02

**REQ-NF-PERF-003:** Real-time tax impact recalculation in Workflow B (Steps B2 and B3) must complete and update all displayed figures within 1 second of a user input event (field change, lot selection, accounting method change) for portfolios up to moderate complexity. This is a user-facing SLA.
Priority: Must
Source: REQ-B3-002, TECH-01

**REQ-NF-PERF-004:** For high-complexity portfolios, real-time recalculation must complete within 3 seconds of a user input event. If this threshold cannot be met, the system must display an inline calculating indicator on the affected figures rather than leaving stale values visible. This is a user-facing SLA.
Priority: Must
Source: REQ-B3-002, TECH-01

**REQ-NF-PERF-005:** Progressive disclosure of optimization detail (the expanded recommendation view in Step A4) must render within 500 milliseconds of the user activating the disclosure control. Detail must be pre-computed at recommendation generation time — no additional server call may be required at disclosure time. This is a user-facing SLA.
Priority: Must
Source: Conflict Resolution 1, REQ-OE-008

**REQ-NF-PERF-006:** Initial tool load time (from navigation to tool entry screen rendered) must not exceed 3 seconds on a standard broadband connection. This is a user-facing SLA.
Priority: Must
Source: Step A1, Segment C

**REQ-NF-PERF-007:** Portfolio and cost basis data must complete background loading (initiated at Step A2) within 5 seconds for moderate-complexity portfolios and within 10 seconds for high-complexity portfolios. These are internal engineering targets — loading occurs silently and does not gate user progression unless calculation is requested before loading completes.
Priority: Must
Source: REQ-A2-004, TECH-04

**REQ-NF-PERF-008:** Transaction submission (Step A6) must receive a processing acknowledgment from the transaction system within 5 seconds of the user's affirmative confirmation action. If acknowledgment is not received within this window, the system must display a processing status message and must not permit the user to resubmit until the original submission status is confirmed. This is a user-facing SLA.
Priority: Must
Source: REQ-EC-007
⚠️ REVIEW: Transaction submission timeout behavior must be coordinated with Vanguard's transaction processing infrastructure team to ensure the acknowledgment window is technically achievable and that timeout handling does not risk duplicate transaction submission.

---

## Section 2: Accessibility

**REQ-NF-ACC-001:** The tool must conform to WCAG 2.1 Level AA at minimum across all views, workflows, and interactive components.
Priority: Must
Source: Standard accessibility requirement
⚠️ REVIEW: Given the financial and emotional sensitivity of this tool's context, Vanguard's accessibility team should evaluate whether specific components warrant AAA conformance targets, particularly for users who may be under stress or cognitive load.

**REQ-NF-ACC-002:** All data tables in Workflow B (the fund list, lot expansion rows, and scenario comparison columns) must be implemented as semantic HTML tables with appropriate header associations, ARIA labels, and keyboard navigation support. Users must be able to navigate all table rows, expand lot detail rows, and interact with entry fields without a mouse.
Priority: Must
Source: Step B1, Step B2, Scenario Comparison

**REQ-NF-ACC-003:** All real-time updating figures (running tax impact totals, allocation drift recalculations, running sell total) must be implemented using ARIA live regions with appropriate politeness settings. Updates must be announced to screen readers without interrupting the user's current focus context.
Priority: Must
Source: REQ-B3-002

**REQ-NF-ACC-004:** Progressive disclosure components (optimization detail in Step A4, lot expansion rows in Step B2, rate table in Step A3) must be fully operable via keyboard and must communicate expanded/collapsed state to assistive technologies via appropriate ARIA attributes.
Priority: Must
Source: REQ-A4-002, REQ-B2-001, REQ-G-009

**REQ-NF-ACC-005:** Visual indicators used to convey meaning in Workflow B (overweight flags, harvestable loss flags, Wait & Save indicators, pre-populated field distinction) must not rely on color alone. Each indicator must include a text label, icon, or pattern that conveys the same information as the color signal.
Priority: Must
Source: Step B2, WCAG 2.1 Success Criterion 1.4.1

**REQ-NF-ACC-006:** All coach marks must be keyboard-accessible, focus-managed appropriately on activation, and dismissible via keyboard. Coach mark content must be available to screen readers.
Priority: Must
Source: REQ-G-019 through REQ-G-022

**REQ-NF-ACC-007:** The tool's plain-language rationale sentences, tradeoff summaries, and advisory notices must meet a reading level of grade 8 or below as measured by a standard readability score (e.g., Flesch-Kincaid). This applies to all system-generated natural language output.
Priority: Should
Source: Step A4, Segment C, Segment D

**REQ-NF-ACC-008:** All interactive controls (buttons, entry fields, disclosure triggers, bracket selectors) must meet WCAG 2.1 AA minimum touch target and contrast requirements. Given the likely age demographic of the primary user population, touch targets should meet the AAA minimum of 44x44 CSS pixels where feasible.
Priority: Should
Source: Segment annotations (retiree and near-retiree population)

**REQ-NF-ACC-009:** Session timeout warnings (when applicable per REQ-G-023) must be surfaced with sufficient advance notice to allow users with motor or cognitive impairments to extend their session before data loss occurs, in conformance with WCAG 2.1 Success Criterion 2.2.1.
Priority: Must
Source: REQ-G-023, PM Decision 8

---

## Section 3: Data Freshness and Accuracy

**REQ-NF-DATA-001:** Portfolio balance and holding data displayed in the tool must reflect end-of-prior-business-day valuations at minimum. If intraday pricing is available and sourced from Vanguard's existing pricing infrastructure, it must be used and a data freshness timestamp must be displayed.
Priority: Should
Source: REQ-G-004

**REQ-NF-DATA-002:** Cost basis data — including lot-level acquisition dates, per-share basis, and holding period classifications — must be sourced from Vanguard's authoritative cost basis records and must reflect all transactions processed as of the prior business day. Cost basis data must not be estimated or interpolated.
Priority: Must
Source: REQ-G-002
⚠️ REVIEW: Cost basis accuracy is a tax compliance matter. Any gap between the tool's displayed cost basis and the basis reported to the IRS on Form 1099-B creates regulatory risk. Data sourcing must be confirmed against the system of record used for tax reporting.

**REQ-NF-DATA-003:** YTD realized gains data must be sourced from Vanguard's tax records system. If the data reflects a processing lag (e.g., trades from the prior day not yet reflected), the tool must display the as-of date of the YTD figures and note that recent transactions may not be included.
Priority: Must
Source: REQ-G-013, TECH-04
⚠️ REVIEW: Displaying YTD realized gains that do not reflect recent transactions may cause the tool's tax impact projections to understate the user's actual cumulative gain position for the year. The staleness handling notice must be sufficient to prevent reliance on incomplete data.

**REQ-NF-DATA-004:** RMD figures must be sourced from Vanguard's authoritative RMD calculation system and must not be computed independently by this tool. If RMD data cannot be retrieved, the tool must display a notice indicating RMD information is unavailable and recommend the user verify their RMD status independently before proceeding.
Priority: Must
Source: REQ-G-017
⚠️ REVIEW: RMD figures are IRS-governed. Independent recalculation by this tool, or display of an incorrect figure, creates regulatory and fiduciary risk. Data source must be confirmed as authoritative.

**REQ-NF-DATA-005:** If portfolio, cost basis, YTD gains, or RMD data cannot be retrieved at session initiation, the system must surface a specific, actionable error notice for each unavailable data type. The tool must not silently substitute estimated or cached data without disclosure. The user must be informed of what data is missing and what functionality is affected.
Priority: Must
Source: REQ-G-015, Step A2

**REQ-NF-DATA-006:** Data displayed during a session must not be silently refreshed mid-session in a way that changes displayed figures, invalidates saved scenarios, or alters the basis of a pending recommendation without the user's awareness. If a material data refresh is required mid-session (e.g., due to a trade settling), the user must be notified and offered the ability to regenerate the recommendation on updated data.
Priority: Must
Source: REQ-G-006

---

## Section 4: Error Handling

**REQ-NF-ERR-001:** The system must distinguish between recoverable errors (data temporarily unavailable, calculation timeout, network interruption) and non-recoverable errors (account access revoked, transaction rejected by processing system, critical data permanently unavailable). Recoverable errors must present a retry path. Non-recoverable errors must present a clear explanation and a path to human support.
Priority: Must
Source: Global, Step A6

**REQ-NF-ERR-002:** If portfolio data fails to load at session initiation, the system must display a specific error message identifying which data could not be retrieved, and must not display a partial or empty tool state without explanation. The user must be offered a retry action and a path to Vanguard support.
Priority: Must
Source: REQ-NF-DATA-005

**REQ-NF-ERR-003:** If the optimization engine fails to generate a recommendation (calculation error, timeout, or insufficient data), the system must not display a blank or partial recommendation view. The error must be surfaced with a plain-language explanation (e.g., "We weren't able to generate a recommendation right now") and the user must be offered the option to switch to Workflow B or contact support.
Priority: Must
Source: Step A4, Segment C

**REQ-NF-ERR-004:** If real-time tax recalculation in Workflow B fails or times out, the affected figures must display a visible stale-data indicator rather than retaining the last calculated value without notice. The user must be able to manually trigger recalculation.
Priority: Must
Source: REQ-B3-002

**REQ-NF-ERR-005:** If a transaction submission fails at Step A6, the system must: display a clear error message distinguishing between a temporary failure (retry available) and a permanent rejection (action required), preserve all session state including saved scenarios and the pending transaction configuration, and not require the user to re-enter any information already provided.
Priority: Must
Source: REQ-EC-007, Step A6
⚠️ REVIEW: Transaction failure messaging must be reviewed by legal and compliance to ensure it does not create user-facing liability implications or misrepresent the cause of rejection.

**REQ-NF-ERR-006:** If a session times out while a user has unsaved work (amounts entered in Workflow B but not yet saved as a scenario), the system must warn the user before the timeout completes and offer an extension. If the session expires without extension, the tool must clearly communicate what was and was not preserved.
Priority: Must
Source: REQ-G-023, PM Decision 8

**REQ-NF-ERR-007:** Error messages throughout the tool must be written in plain language consistent with the tool's overall communication standards. Technical error codes must not be exposed to the user. All error states must offer a clear next action.
Priority: Must
Source: Segment C, Segment D

---

## Section 5: Security and Data Privacy

**REQ-NF-SEC-001:** This tool handles non-public personal financial information (NPPI) including portfolio holdings, cost basis, realized gains, and RMD data. All data transmission between client and server must occur over TLS 1.2 or higher, consistent with Vanguard's existing security standards for the investor portal.
Priority: Must
Source: Standard financial data security requirement
⚠️ REVIEW: Security requirements for this tool must be reviewed against Vanguard's current security posture documentation and any applicable regulatory obligations (e.g., SEC, FINRA data security rules). This requirement defers to those standards rather than re-specifying them.

**REQ-NF-SEC-002:** Session data — including saved scenarios, entered amounts, and loaded portfolio data — must not be persisted to client-side storage (cookies, localStorage, or equivalent) in unencrypted form. Session state persistence must occur server-side or via encrypted client-side mechanisms consistent with Vanguard's portal session management standards.
Priority: Must
Source: REQ-G-023
⚠️ REVIEW: Client-side storage of financial data may conflict with Vanguard's existing data residency and privacy policies. Confirm permissible storage mechanisms with the security team before implementation.

**REQ-NF-SEC-003:** The tool must not log or retain tax bracket selections, withdrawal amounts, or scenario configurations in application logs in a manner that associates them with individually identifiable users beyond the retention period required for transaction audit purposes.
Priority: Must
Source: Financial data privacy best practice
⚠️ REVIEW: Log retention and data association policies must be reviewed against applicable privacy regulations (e.g., CCPA) and Vanguard's internal data governance standards.

**REQ-NF-SEC-004:** Access to this tool must be gated by Vanguard's existing investor portal authentication and authorization controls. No additional authentication mechanism is required by this tool beyond what the portal already enforces. Session expiration behavior must be consistent with portal standards per PM Decision 8.
Priority: Must
Source: PM Decision 8

**REQ-NF-SEC-005:** The tool must not expose portfolio data, cost basis, or tax information belonging to one user to any other user under any error or edge-case condition. Data isolation must be enforced at the API and session layer.
Priority: Must
Source: Standard financial data isolation requirement

---

## Section 6: Browser and Device Compatibility

**REQ-NF-COMPAT-001:** The tool must be fully functional on the two most recent major versions of the following browsers: Chrome, Safari, Firefox, and Edge. Given the primary user demographic (retirees and near-retirees), browser version distribution in this population skews toward slightly older versions, and testing coverage should extend to the three most recent major versions of Safari and Chrome specifically.
Priority: Must
Source: User population demographic, Step A1

**REQ-NF-COMPAT-002:** The tool must be fully functional on desktop and laptop devices at viewport widths of 1024px and above. The data-dense table layouts in Workflow B and the Scenario Comparison view are not suitable for compressed viewports and must not be forced into a mobile layout that sacrifices data legibility.
Priority: Must
Source: Step B1, Scenario Comparison

**REQ-NF-COMPAT-003:** The tool should be usable on tablet devices (viewport widths of 768px and above) with layout adaptations that preserve data table legibility. Horizontal scrolling of table columns is acceptable on tablet viewports. Full feature parity with desktop is required.
Priority: Should
Source: User population demographic

**REQ-NF-COMPAT-004:** The tool is not required to support mobile phone viewports (below 768px) in the initial release. If mobile support is added in a future release, the Workflow B data table and Scenario Comparison view will require dedicated layout design before mobile deployment.
Priority: Could
Source: PM Decision scope, data density constraints

**REQ-NF-COMPAT-005:** The tool must not depend on browser plugins, extensions, or non-standard web platform features. All functionality must be achievable using standard HTML, CSS, and JavaScript APIs available in the supported browser versions.
Priority: Must
Source: Compatibility and accessibility baseline

**REQ-NF-COMPAT-006:** The tool must degrade gracefully in browsers where JavaScript is disabled or blocked, displaying a clear message that the tool requires JavaScript to function and directing the user to an alternative support path. A non-functional blank state is not acceptable.
Priority: Must
Source: REQ-NF-ERR-007, Accessibility baseline
