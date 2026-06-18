# Dev Phase Handoff Prompt
## Vanguard Sell & Rebalance — AI Pipeline Portfolio Case Study

Copy the prompt below into a new Claude thread with the following MCPs active:
- **Notion MCP** — primary workspace and decisions
- **Atlassian Rovo MCP** — Jira story updates
- GitHub access (via Claude Code or browser)

Attach the following file to the new thread before sending:
- `DECISIONS.md` (this session's context document — the only file needed)

All other reference documents are reachable directly:
- User journeys: Notion page 33edcac9574a819eaa01c61e6675b368
- Workflow HTML: GitHub mcasey10/vanguard-ai-pipeline/pm/sell_rebalance_workflow.html
- PD CLAUDE.md: GitHub mcasey10/vanguard-ai-pipeline/pd/CLAUDE.md

---

## HANDOFF PROMPT (copy into new thread)

```
You are beginning the Dev phase of an AI-assisted PM→PD→Dev 
pipeline project. The PM and PD phases are complete.

I'm attaching DECISIONS.md which contains the full current 
project context — read it first before doing anything else. 
It contains all file references, Notion page IDs, Jira 
credentials, completed screen inventory with node IDs, 
wiring status, canonical sample data, design decisions, 
and process learnings from both phases.

---

CONNECTIONS REQUIRED

Before starting, confirm the following MCP connections 
are active:
- Notion MCP (primary workspace and decisions)
- Atlassian Rovo MCP (Jira story updates)

---

PROJECT CONTEXT

Primary goal: demonstrate a structured AI-assisted 
PM→PD→Dev pipeline applied to a hypothetical Vanguard 
Sell & Rebalance tool. The Dev phase produces a working 
prototype application from the PD handoff artifacts.

Notion workspace (authoritative source of truth):
https://www.notion.so/Vanguard-Sell-Rebalance-Design-Process-365dcac9574a8187a8ced7d4e9408c3b

Key Notion pages:
- PRD root: 33edcac9574a808da907cc9decefb512
- PRD 05 — Functional requirements: 33edcac9574a81c4b19ffcf6facc40b8
- PRD 10 — Sample dataset: 33fdcac9574a81d181c0f25bb665d8ad
- PDB 04 — Screen inventory: 364dcac9574a81aca521c64f205958f3
- PDB 09 — PD decisions log: 340dcac9574a8141a170de6bc25d9750

Figma files:
- Design System: krtNgOD3jL5U6WmUMT32u6
- Screens: jz82GrOp8RE2QGh81V0qbs (all frames on Stage 1 page)
- Figma prototype: https://www.figma.com/proto/jz82GrOp8RE2QGh81V0qbs/Vanguard-Sell---Rebalance-%E2%80%94-Screens

Reference prototypes:
- Framer: https://spiky-manager-267229.framer.app/
- ProtoPie: https://cloud.protopie.io/p/8951614ea03c1c2b09b7c4b9
- Lovable logic validation: https://github.com/mcasey10/vanguard-lovable-prototype

GitHub:
- Primary repo: mcasey10/vanguard-ai-pipeline
- Pipeline HTML: ai_pipeline.html (repo root)
- Workflow HTML: pm/sell_rebalance_workflow.html

Jira:
- Site: michaelcasey-jira-site.atlassian.net
- cloudId: 89da3bf5-61e1-4506-98ff-7cf28f3fa5f9
- Project key: VSR
- 74 issues across 8 epics (VSR-1 through VSR-74)

---

DEV PHASE STEPS (per pipeline HTML, PD tab → Dev tab)

Per the pipeline diagram (ai_pipeline.html, Dev tab):

Step 1 — Project scaffold + component generation
Generate app scaffold and translate Figma components to 
production code. The Lovable logic validation prototype 
serves as the reference implementation for the 
optimization engine. Claude Code handles multi-file 
agentic implementation reading from PDB 09 and PRD 05 
via Notion MCP.
Tools to evaluate: v0 by Vercel, Lovable, Replit, 
Base44, Claude Code

Step 2 — Data model + API layer
Implement the logical data model from the PRD (page 07b). 
Build API routes, data fetching, and state management. 
The canonical sample dataset (PRD page 10) drives unit 
test coverage from the first commit.
Tools: Claude Code, Cursor

Step 3 — Optimization engine implementation
Tax calculation logic, lot selection algorithm, 
rebalancing engine, Wait & Save detection, harvestable 
loss identification, account priority ordering 
(taxable → traditional IRA → Roth — this must be 
explicit, not inferred), and accounting method switching.
Lovable prototype is the reference implementation.
Requirements: REQ-OE-001 through REQ-OE-010 in PRD 05.
Tools: Claude Code

Step 4 — Testing + quality assurance
Unit tests against the 15 coverage cases from the 
canonical sample dataset. Integration tests for the 
optimization engine across all accounting methods 
and optimization modes.
Tools: Claude Code

Step 5 — Deployment
Configure and execute deployment. Write deployment 
configuration files (Dockerfile, Vercel config, 
GitHub Actions workflows) in the same session as 
the application code.
Tools: Claude Code, Vercel or Railway

Step 6 — PR creation + ticket management
Agents create GitHub PRs, update Jira tickets, and 
post summaries — closing the loop back to the PM 
backlog without manual status updates.
Tools: Claude Code, GitHub MCP, Slack MCP, n8n

---

FIRST TASK

Before any code is written, read the following in order:

1. DECISIONS.md (attached) — full project context
2. PRD 05 — Functional requirements 
   (33edcac9574a81c4b19ffcf6facc40b8) — requirements 
   governing what the application must do
3. PRD 10 — Sample dataset 
   (33fdcac9574a81d181c0f25bb665d8ad) — canonical test 
   data for all 15 coverage cases
4. PDB 09 — PD decisions log 
   (340dcac9574a8141a170de6bc25d9750) — design decisions 
   that constrain implementation

Then produce a Dev phase plan covering:
- Which scaffold tool to evaluate first and why
- How the Lovable reference implementation will be used
- Which CLAUDE.md constraints are needed before any 
  CC sessions begin (account priority order must be 
  one of them — see DECISIONS.md process learnings)
- Proposed GitHub branch strategy
- First three Jira stories to transition to In Progress

Wait for confirmation of the Dev phase plan before 
writing any code.

---

KEY CONSTRAINTS FROM PD PHASE (do not re-derive)

These are final decisions — do not reopen them:

- Progressive disclosure model: 4 stages 
  (Fund Selection → Scenario Analysis → 
  Order Confirmation → Execution Summary)
- Automated/Manual mode toggle within Fund Selection
- SpecID cost basis is Manual mode only
- EST. NET TAX is portfolio-level netting; per-fund 
  EST. TAX is gross (pre-netting)
- Wait & Save is lot-specific and comparative within 
  a fund only — suppressed in Automated mode
- Scenario Analysis is read-only — all editing in 
  Fund Selection
- Account withdrawal priority: taxable → 
  traditional IRA → Roth IRA (must be explicit 
  in CLAUDE.md, never inferred)
- Up to 3 scenarios simultaneously, auto-labeled
- State persistence via localStorage per 
  REQ-PS-001 through REQ-PS-007
- State tax out of scope for v1 — federal rates only 
  per REQ-G-007
- Target allocation: Stocks 55% / Bonds 35% / 
  Reserves 10% (Margaret Ellison canonical data)

---

DOCUMENTATION APPROACH

Notion is the single source of truth. All Dev decisions 
recorded in a new Dev decisions log page under the 
Design Process workspace. Update Jira stories with 
GitHub PR links as work is completed. Pipeline HTML 
(ai_pipeline.html) Dev tab to be updated with 
chip-used status as tools are evaluated.

The Dev phase CLAUDE.md (dev/CLAUDE.md in the repo) 
should be created before the first Claude Code session 
and committed to the repo. It should include at minimum:
- Account withdrawal priority order (explicit constraint)
- Sample dataset reference location
- Optimization engine requirements reference
- Figma Screens file key for component reference
- Lovable prototype URL for logic validation reference
```

---

## Files to attach to new thread

| File | Source | Purpose |
|---|---|---|
| `DECISIONS.md` | This output | Full project context, screen inventory, node IDs, design decisions, process learnings |

All other references are fetched directly in the thread via Notion MCP or GitHub — no file attachments needed.

---

## Pre-flight checklist before starting Dev thread

- [x] Cost Basis Dialog + Target Allocation Modal wiring confirmed complete (13 connections, zero failures)
- [x] Cost Basis Dialog node IDs confirmed in DECISIONS.md
- [ ] Confirm ai_pipeline.html Step 8 updates committed to GitHub
- [ ] Review PDB 09 decisions log in Notion for completeness
- [ ] Decide which scaffold tool to start with 
      (v0, Lovable, Replit, Base44) before opening thread
- [ ] Confirm Notion MCP and Atlassian Rovo MCP are 
      active in new thread before sending first message
