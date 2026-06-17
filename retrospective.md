# Vanguard Sell & Rebalance — Project Retrospective
## AI-Assisted PM → PD → Dev Pipeline Case Study

---

## What this project was

A portfolio case study demonstrating a structured AI-assisted product pipeline applied to a hypothetical Vanguard Sell & Rebalance tool — a self-service retirement account withdrawal and portfolio rebalancing feature that doesn't exist in the real Vanguard portal. The project spanned three roles (PM, PD, Dev-ready handoff) using AI tools at every stage, with Notion as the authoritative workspace throughout.

The domain is genuinely complex: lot-level cost basis, tax-loss harvesting, RMD compliance, FIFO/SpecID accounting methods, WCAG 2.1 AA, and four distinct user segments with conflicting needs. Choosing a hard domain was deliberate — it creates more interesting AI tool interactions and produces more meaningful findings than a simple CRUD application.

---

## What went well

### Notion as the single source of truth

The decision to use Notion as the authoritative handoff reference across all three phases paid off consistently. Any role could theoretically be substituted by a human navigating the workspace. The MCP connection meant Claude could read and write Notion content directly without copy-paste overhead — an agentic workflow that felt genuinely different from a chat-and-paste approach. When requirements changed, updating Notion updated the ground truth; every subsequent phase read the corrected version.

### CC + Figma MCP for programmatic screen generation

Using Claude Code with Figma MCP to write native Figma frames directly was the most novel and successful technical approach in the project. The combination produced real Figma artifacts — not code approximations or exports — with correct component references, design token values, and layer naming. The key discipline that made it work: writing detailed specification documents in the Claude.ai thread, then executing them in Claude Code sessions with explicit confirmation gates between steps.

### The three-prompt wiring spec approach

For prototype wiring (PD Step 8), generating a structured spec before touching the prototype proved significantly more efficient than attempting direct wiring. Three sequential prompts — DS library audit, frame inventory + gap analysis, full connection spec with ambiguity resolutions — surfaced every blocker before any connections were applied. The result: 37 connections applied in a single CC session with zero failures.

### Sample data generated bottom-up

Generating the canonical dataset from lot-level transactions upward (rather than top-down from portfolio totals) meant every aggregate was arithmetically consistent. An automated Python verification script caught the one arithmetic error before it propagated. The dataset — 43 lots across 7 fund/account combinations — exercised all 15 coverage cases from the logical data model simultaneously.

### Multi-tool comparison experiments

Running the same prompt in Claude.ai, ChatGPT, and Gemini in parallel for key PM deliverables (problem framing, user journeys) produced concrete, documentable differences. Gemini surfaced the "empathy gap" concept that was underweighted in the Claude.ai draft; Gemini also produced the key insight at the execution confirmation step that became REQ-EC-002. These weren't just token comparisons — the gap analysis changed the output.

### Lovable over Bolt for logic validation

Side-by-side evaluation with identical prompts produced a clear result: Lovable got the lot count correct (32), both optimization modes working, and all harvestable loss alerts firing in one correction prompt. Bolt produced wrong lot counts, missing optimization modes, and incorrect account priority order, and exhausted its free token allocation before corrections could be applied. Documenting the comparison criteria before running the experiment made the finding credible rather than anecdotal.

### Progressive disclosure architecture decision

The decision to replace the two-workflow model (Workflow A / Workflow B as separate entry paths) with a unified four-stage progressive disclosure model (Fund Selection → Scenario Analysis → Order Confirmation → Execution Summary) with an Automated/Manual mode toggle was the right structural call. It emerged from v0 structural prototyping — two functional unstyled React layouts compared directly — rather than from debate about the PRD. The structural prototype was the decision artifact.

---

## What didn't go well

### The screen architecture gap at PM → PD handoff

The most expensive mistake in the project. User journeys were written at the correct abstraction level — workflow events, emotional states, decision points — but the numbered step convention (A1, A2, A3...) borrowed the visual language of a screen flow document. When those journeys became inputs to screen generation prompts, each numbered step was treated as a discrete screen.

The correction required rewriting the user journey document, creating PM Decision 11, updating functional requirements, the logical data model, open design questions, and the entire Jira backlog. Multiple screens had to be deleted and rebuilt.

What was missing: a screen architecture map — a lightweight artifact that explicitly declares which workflow events map to which screens and which use progressive disclosure within a single screen. This artifact sits between the PM workflow definition and the PD screen design layer. It answers the question "which logical steps happen on which physical screens?" — a structural decision that requires PM input but belongs to the PD phase. Without it, numbered workflow steps will be interpreted as screen boundaries by default.

**Principle:** User journey documents describe *what happens*. Screen designs describe *where it happens*. The gap between them should be resolved explicitly as a named handoff artifact before screen generation begins.

### Fund Row component — CC authoring vs. CC usage

The Fund Row component family required full manual reconstruction after multiple CC regression cycles. The component has a property unusual in UI component design: its visual structure is conditionally self-referential across abstraction levels. The same component (Fund Row) contains a sub-component (Details Row) that contains another component (Lot Details Table) that contains a Lot Detail Row — and visibility and behavior at every level is governed by a combination of variant state AND boolean properties that interact non-trivially.

CC consistently defaulted to more variants, less property-driven behavior — producing a combinatorial explosion of variants that was brittle and hard to maintain. The deeper issue: CC is significantly better at *using* components (placing instances, setting properties) than *authoring* them (deciding how to structure variants, which properties to expose, how to nest instances). Component authoring requires design judgment involving tradeoffs where a wrong structural choice at the top level makes every subsequent step harder.

**Principle:** CC can execute well-defined component specifications but cannot navigate the design-space exploration required to *arrive* at a good specification. Human judgment is currently irreplaceable for component architecture decisions.

### Scenario Analysis — the cost of an unresolved editing surface ambiguity

The Scenario Analysis screen went through 5+ major architectural revisions. The core issue was an unresolved ambiguity: should Scenario Analysis be an editing surface or a read-only comparison view?

The revisions: initial read-only → inline editing with cost basis selectors → SpecID rows read-only, others editable → back to read-only → final model confirmed. Each step toward editability revealed new complexity: cost basis selectors don't fit at 3-scenario width, SpecID requires lot detail panels that can't be embedded in narrow columns, the scenario context label requires dynamic state that static design can't represent.

The resolution came from going back to first principles: Scenario Analysis is *for comparing* prepared scenarios, not building them. All creation and editing belongs in Fund Selection. This simplification eliminated the column width problem, the SpecID complexity, and the need for a separate SC-EDIT screen.

**Principle:** Unresolved interaction model questions (who owns the editing surface?) should be resolved explicitly as PD decisions before screen generation begins.

### Hidden layer inspection in Figma MCP

CC inspection reports include hidden layer content — stale data from prior iterations appears in inspection output as if visible. This produced multiple incorrect readings during screen generation where deprecated component variants were being reported as current state. Human visual confirmation of screenshots is authoritative over CC inspection reports.

### Calculation errors in long threads

Over the course of a long thread, CC made multiple errors in scenario analysis calculations — most notably confusing which lot was selected by MinTax, producing negative tax figures, and using incorrect cost basis values. The canonical dataset was in Notion but CC was reasoning from thread memory rather than fetching the Verification Tables.

**Principle:** Canonical data should be fetched from the authoritative source at the start of any calculation session, not recalled from thread memory. This is especially critical in threads exceeding roughly 50 exchanges.

### Terminology drift

The primary action button navigating from Fund Selection to Order Confirmation was labeled inconsistently across screens: "Proceed" in Fund Selection, "Execute this scenario" in early SC-1 versions, "Select this scenario" in others. A batch update across all screens and documentation artifacts was required.

**Principle:** Button terminology should be decided and documented at the start of the PD phase, not derived screen-by-screen.

---

## AI tool findings

### Claude.ai (coordination and documentation)

The primary tool throughout. Most effective for: structured inference research, PRD authoring via Notion MCP, design decision resolution, wiring spec generation, and documentation synthesis. Long thread context drift is the main limitation — canonical data should be re-fetched rather than recalled after extended sessions. The Notion MCP connection made Claude.ai genuinely agentic rather than conversational for documentation tasks.

### Claude Code + Figma MCP

The most novel tool combination in the project. Effective for initial screen generation and bulk content updates across frames. Less effective for: component architecture decisions, correction loops on structural issues, and variant swap interactions on instances referencing external library components (blocked by Figma Plugin API remote component restriction). The correct division of labor: CC for initial structure, manual Figma for finishing.

### Notion MCP

Reliable throughout. Key operational notes: `replace_content` handles long content reliably; `update_content` requires short, unique anchor strings; tables in fetched pages appear in HTML format; `insert_content` with `position: end` reliably appends without affecting existing content.

### Atlassian Rovo MCP (Jira)

All 69+ Jira issues created programmatically in three batches with confirmation at each stage — no manual ticket creation. Epic-to-child linking uses the `parent` field, not link types. Transition ID 21 moves issues from Idea to To Do.

### v0 by Vercel

Used for structural exploration (PD Step 4), not screen generation. Two structural prototypes — two-workflow architecture and progressive disclosure model — provided the comparison artifact for the PD-DEC-01 structural model decision. v0 renders specification prompts as annotation-heavy visual documents rather than clean structural layouts, and has no access to the Figma Design System file, making it unsuitable for final screen generation.

### Lovable

Used for logic validation (PM Step 6). Produced correct output in one correction prompt: 32 lots accurate, both Tax-First and Balance-First optimization modes working, all harvestable loss alerts firing, Wait & Save correct. Key finding from the evaluation: neither Lovable nor Bolt inferred account withdrawal priority order (taxable → IRA → Roth) without explicit instruction — this became a required CLAUDE.md constraint for the Dev phase.

### Framer

Used for prototype Track B. Native overlay system with scrim, animation, and dismissible backdrop produced interactions not achievable in Figma prototype mode. Full happy path and branch paths wired manually. Key limitations: no built-in hotspot visualization (Figma's "Show hotspots" has no equivalent), viewport height locks to first page dimensions unless presenting full screen, import workflow requires auto-layout in source Figma frames (absolute-positioned components import incorrectly). Framer AI generates marketing websites, not prototype interactions — all wiring was manual.

### ProtoPie

Evaluated but not completed due to free plan constraints (2-scene hard limit per prototype, AI features require paid plan). Notable finding: existing Figma prototype connections auto-import into ProtoPie without manual wiring — a viable workflow would be completing the Figma prototype first, then importing to ProtoPie for conditional logic layering. Mobile-first tool; desktop HD prototyping requires manual device configuration.
---

## The messy reality beneath the clean process

The phase-by-phase structure of this project — PM complete, then PD, then Dev-ready handoff — implies a linear progression that didn't actually happen. The PRD was a living document throughout the PD phase. What looks like a clean handoff in the pipeline diagram was in practice an iterative collaboration between the PM and PD roles, simulated by a single person working across both.

Several PRD shortcomings were only discovered when the design phase forced concrete decisions:

**SpecID constrained to Manual mode** wasn't clearly specified in the original PRD. It emerged as a PD decision (REQ-B3-003 clarification) when the Scenario Analysis editing surface question forced a clear answer about where lot-level selection belonged.

**Wait & Save lot-specificity** required a mid-PD clarification to REQ-B-W-002. The PRD implied portfolio-level comparison; the component design revealed it needed to be lot-specific and comparative within a fund only.

**EST. NET TAX netting logic** (REQ-EC-001) was updated during PD when the distinction between per-fund gross tax and portfolio-level net tax wasn't captured in the original requirement. The Summary Banner design made the ambiguity visible.

**Impact column replacing the Drift indicator** — the PRD specified a drift indicator per fund (PD-DEC-03). PD discovered this was only meaningful with per-fund allocation targets, which the tool doesn't collect. The Impact column (signed delta to overall portfolio allocation) replaced it — a design decision that corrected a requirements gap.

**Single active account constraint** (PD-DEC-02) — the PRD implied multi-account selling was possible. PD clarified this to one active account per session with all others as informational context, after recognizing that simultaneous multi-account selling was operationally impractical and misleading.

**Recalculation trigger behavior** (PD-DEC-06) — the PRD specified real-time recalculation. PD revised this to an explicit button trigger after recognizing that keystroke recalculation causes distracting UI churn and that on-blur alone is unpredictable.

**Scenario Analysis editing surface** — the PRD implied Scenario Analysis was a working surface where users could modify fund selections. Five revision cycles later, PD resolved it as a read-only comparison view with all editing belonging in Fund Selection.

In a real product team, these would be the conversations between PM and PD that happen in Slack threads, hallway discussions, and design reviews. Here they happened as iterative debates within and between Claude sessions — sometimes requiring explicit PRD rewrites, sometimes resolving through the act of building the design and discovering the constraint. The AI didn't eliminate this collaborative friction; it relocated it.

---

### The workflow artifact that should have existed from the start

Closely related to the screen architecture gap: the `sell_rebalance_workflow.html` document — the staged workflow diagram classifying every element of every screen as an input, read-only value, action, or notice across Automated and Manual modes — was created mid-PD as a response to the confusion about what belonged where.

This document became the canonical reference that the screen inventory was built from. It answered questions the user journeys couldn't: which elements are shown at which stage, what's user-input vs. system-calculated, what actions are available in each mode, and how the mode toggle affects every element simultaneously.

It should have been produced at the PM→PD handoff, not discovered as necessary through pain. In future projects this type of artifact — which sits between behavioral user journeys and visual screen designs — should be a required handoff deliverable. User journeys answer "what does the user do and feel?" The workflow artifact answers "what does the screen contain and how does each element behave?"

---

### Human-first component design

A hard-earned pattern from this project: complex Figma component architecture requires human design judgment applied *before* CC is involved. The Fund Row family — six levels of nesting with conditional visibility governed by variant state and boolean properties at each level — was attempted multiple times through CC prompts before being rebuilt manually.

The anti-pattern is asking CC to figure out the component hierarchy and iterate toward correctness. CC consistently defaults to more variants, less property-driven behavior, producing a combinatorial explosion that's brittle and expensive to maintain. The pattern that works: design the component structure manually in Figma first — deciding which properties to expose, how to nest sub-components, where to use variants vs. booleans — then use CC to generate screen instances of the finalized components.

This applied beyond the Fund Row. Any component where the visible structure changes conditionally based on multiple simultaneous factors requires human architectural judgment first. The lesson transferred from this project to a general principle: use CC for component *usage*, use human judgment for component *authoring*.

---

### Sample data as a vehicle for business logic discovery

This project involved more in-depth analysis of sample data and business logic than previous projects — and that depth was necessary rather than incidental. The canonical dataset wasn't just test data; it was a vehicle for discovering and resolving business logic ambiguities that the PRD hadn't anticipated.

Working through which lot MinTax would select for VBTLX (a long-term loss lot, not a short-term loss lot, because MinTax prioritizes tax rate reduction not total tax reduction) revealed a subtlety in the PRD's optimization description that needed clarification. The debate about Wait & Save scope (lot-specific vs. portfolio-level) couldn't be resolved abstractly — it required working through specific lot scenarios to understand what "comparative" actually meant. The EST. NET TAX netting question emerged directly from computing the specific figures for the canonical investor portfolio and recognizing that the per-fund and portfolio-level numbers told different stories.

In each case, Claude served as an interlocutor for reasoning through business logic — not as an authority, but as a structured thinking partner that could hold the scenario details while working through implications. The debates were genuine: Claude would propose one interpretation, the human would push back with a counterexample from the dataset, and the resolution would become a PRD update. This kind of iterative business logic refinement through concrete data scenarios is something AI tools are genuinely well-suited for, and it's underrepresented in how AI-assisted design work is typically described.

---

## What I would do differently

1. **Produce a screen architecture map at PM→PD handoff.** Explicitly declare which workflow events map to which screens before any screen generation begins. This single artifact would have prevented the most expensive correction in the project.

2. **Resolve all Tier 1 design questions before starting any component work.** The Fund Row architecture decision couldn't be finalized until the editing surface question was resolved. Starting component work before that resolution was premature.

3. **Establish button terminology in pd/CLAUDE.md before screen generation.** A canonical terminology table available to every CC session would have prevented the "Proceed / Execute / Review order" drift entirely.

4. **Use a shorter thread cadence with more deliberate context resets.** Long threads accumulated context that produced calculation drift and incorrect inspection readings. More frequent sessions with explicit context re-establishment from Notion would have been more reliable.

5. **Build the DS component audit into the PD pipeline as a formal gate.** The DS audit before screen generation (PD Step 6) was added mid-project after gaps were discovered the hard way. It should be a required step in every PD phase from the start.

---

## What surprised me

The Figma MCP cross-page prototype wiring limitation was the most surprising hard constraint encountered — the Plugin API enforces same-page-only NAVIGATE connections with no workaround. The entire frame consolidation step (moving all 12 screens from 4 separate Figma pages onto one page) was necessitated by this constraint, which isn't documented prominently anywhere.

ProtoPie auto-importing existing Figma prototype connections was the most pleasant surprise — an intelligent import behavior that neither Framer nor any other tool attempted. The implication for future workflows is meaningful: wire the Figma prototype fully first, then import to ProtoPie, and the navigation scaffold arrives for free.

The multi-tool comparison experiments (Claude.ai vs. ChatGPT vs. Gemini) produced more differentiated results than expected. The tools weren't just stylistically different — they surfaced different concepts, missed different edge cases, and had different failure modes. Running the same prompt in parallel is more valuable than it appears.

---

## Artifacts produced

| Phase | Artifact | Tool |
|---|---|---|
| PM | Problem statement, success metrics, user research | Claude.ai |
| PM | Contextual segment map (interactive HTML) | Claude.ai visualizer + GitHub Pages |
| PM | Contextual variation dimensions explorer | Claude.ai visualizer + GitHub Pages |
| PM | HMW design brief | Claude.ai visualizer + GitHub Pages |
| PM | User journeys + workflow architecture | Claude.ai |
| PM | PRD (13 Notion pages) | Claude.ai + Notion MCP |
| PM | Jira backlog (VSR-1 through VSR-74, 8 epics) | Claude.ai + Atlassian Rovo MCP |
| PM | Canonical sample dataset (43 lots) | Claude.ai + GitHub |
| PM | Logic validation prototype | Lovable |
| PM | Workflow diagram v3 (HTML) | Claude.ai |
| PD | Vanguard design system (33 components) | Claude Code + Figma MCP |
| PD | Screen inventory (12 annotated screens) | Claude Code + Figma MCP |
| PD | Track A — Figma wired prototype (37 connections) | Claude Code + Figma MCP |
| PD | Track B — Framer interactive prototype | Framer |
| PD | Track C — ProtoPie evaluation | ProtoPie |
| PD | PD decisions log (Notion PDB) | Claude.ai + Notion MCP |
| Pipeline | AI pipeline document by role (HTML) | Claude.ai |
