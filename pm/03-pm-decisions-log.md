# PM Decisions Log
*April 9, 2026*

---

## 1. Silent Integration of Tax and Rebalancing Optimization

**Decision:** The tool presents a single optimized recommendation in Workflow A. Because the user has deliberately chosen this tool over a direct sell route elsewhere in the portal, it is reasonable to assume intent to optimize across both tax impact and portfolio balance. The recommendation will integrate both dimensions silently by default, with the ability for the user to expand and view how the recommendation performed on each dimension.

**Rationale:** Users who navigate to this tool have self-selected for optimization; surfacing both dimensions on demand — rather than by default — preserves simplicity without hiding information users may want.

---

## 2. Session Context Adaptation

**Decision:** The tool will not attempt to infer session context from behavioral signals. The default entry point is Workflow A (system-guided), initiated by the user entering a target dollar amount to sell with the presumed intent to withdraw to their settlement account. Users may manually switch to Workflow B (manual) at any point. A lightweight self-selection mechanism will be used to allow this switch rather than any automated mode detection.

**Rationale:** Attempting to automate session-type inference with insufficient signals risks misclassifying users and producing a more frustrating experience than a simple, explicit workflow toggle.

---

## 3. Post-Decision Feedback Loop

**Decision:** Deferred to a future release. The post-decision feedback loop — connecting withdrawal decisions to their eventual tax outcomes — will not be included in the initial release. It will be reconsidered once transaction persistence is implemented and the initial release can serve as a baseline for comparison.

**Rationale:** Deferring this feature reduces initial complexity and preserves the ability to evaluate v1 outcomes against prior project versions before introducing longitudinal capability.

---

## 4. Manual Workflow Identity

**Decision:** The manual workflow (Workflow B) is primarily a power-user control surface. Contextual guidance will be delivered through coach marks that are visible during a user's initial sessions and subsequently hidden but remain accessible on demand in all subsequent sessions.

**Rationale:** Coach marks allow the workflow to serve both first-time users who need orientation and returning users who need efficiency, without compromising the interaction model for either.

---

## 5. Default Tax Assumptions and Communication

**Decision:** The tool will operate on the following default capital gains rate assumptions, applied when the user has not specified their income range:

- Short-term capital gains rate: **24%**
- Long-term capital gains rate: **15%**

These defaults will correspond to a mid-range income assumption. The tool will display the active assumption and provide direct access to a full table of rates by income range, allowing users to select their applicable range without requiring entry of exact income figures.

The tool will surface the following notices in all sessions:

- A summary of year-to-date realized gains and the incremental tax impact of the planned sale
- Highlighted callout for any accounts subject to RMD requirements, including the remaining RMD amount required for the current year
- A recommendation to consult a tax professional regarding individual tax circumstances

Consultation with a tax professional is advisory only and will not be mandated or required to proceed.

**Rationale:** Defaulting to mid-range rates with transparent, selectable assumptions gives users actionable tax estimates with minimal friction while preserving accuracy for users who choose to refine their inputs.
