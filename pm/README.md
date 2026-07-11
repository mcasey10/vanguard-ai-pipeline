# PM Phase — Product Management

This directory contains artifacts from the Product Management phase of the Vanguard AI Pipeline project.

**Timeline:** April 8–13, 2026  
**Role:** Product Manager (AI-assisted)  
**Tool:** Claude.ai (Projects)

## Artifacts

| File | Description |
|------|-------------|
| `problem_statement.html` | Scoped problem definition against Vanguard's existing portal |
| `user_journeys.html` | Four primary user journeys across the Sell & Rebalance workflow |
| `functional_requirements.html` | 11 functional requirements (REQ-G and REQ-OE series) |
| `sample_dataset.html` | Canonical portfolio dataset: 43 lots, 3 account types, 7 funds, $870,619.40 total |
| `jira_backlog.html` | 80-issue Jira backlog across 8 epics |
| `multi_tool_comparison.html` | Same prompts run in Claude.ai, ChatGPT, and Gemini — response comparison |
| `amendments/` | Requirement amendments generated after Dev-phase gap analysis |

## Key finding

The sample dataset contained a NAV error on VBTLX that compounded through every price-dependent calculation. The error was discovered during PD handoff review when lot-level math didn't reconcile. The corrected dataset was propagated to all downstream Notion pages and the `sample_dataset.html` artifact before Dev began.

This finding drove a project-level rule: **always verify dataset arithmetic before handing off to the next phase.**

## Notion workspace

Full PRD, user journeys, and requirements: https://www.notion.so/Vanguard-Sell-Rebalance-PRD-33edcac9574a808da907cc9decefb512
