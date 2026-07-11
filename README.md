# Vanguard AI Pipeline — Sell & Rebalance Tool

A complete 0-to-1 product pipeline applied to a hypothetical Vanguard Sell & Rebalance tool. This repository documents and implements the full PM → PD → Dev workflow, with AI assistance at every stage.

**This project is not affiliated with Vanguard.** It is a self-initiated portfolio project by [Michael Casey](https://github.com/mcasey10), Principal Product Designer, demonstrating AI-assisted product delivery across all three roles.

## Live artifacts

| Artifact | URL |
|----------|-----|
| Deployed application | https://vanguard-ai-pipeline-jade.vercel.app/ |
| Reset URL (clean demo state) | https://vanguard-ai-pipeline-jade.vercel.app/?reset=true |
| Pipeline document | https://mcasey10.github.io/vanguard-ai-pipeline/ai_pipeline.html |
| Portfolio case study | https://etch-chief-15924551.figma.site/ai-pipeline |

## Repository structure

| Directory | Phase | Contents |
|-----------|-------|----------|
| `/pm` | Product Management | Problem statement, PRD, user journeys, requirements, sample dataset, Jira backlog artifacts |
| `/pd` | Product Design | Design decisions log, dev handoff prompt, design system reference, CLAUDE.md spec |
| `/dev` | Development | Full React application source, optimization engine, Vitest unit tests, Playwright E2E tests |

## What was built

A working web application — not a prototype — with real business logic, real state management, and a real dual-objective optimization engine. The engine minimizes capital gains tax while rebalancing portfolio allocation toward target percentages.

**Tech stack:** Vite + React 18 + TypeScript + Tailwind v3 + React Router v6 + Zustand v5  
**Testing:** 58/58 Vitest unit tests passing · 2/2 Playwright E2E flows passing  
**Deployment:** Vercel + GitHub Actions (unit tests as deployment gate)  
**Git release tag:** `dev-phase-complete` (commit 923323b)

## Phase summary

### Product Management (April 8–13, 2026)
- Problem statement scoped against Vanguard's existing portal
- 11 functional requirements (REQ-G and REQ-OE series)
- Canonical sample dataset: 43 lots, 3 account types, 7 funds, $870,619.40 portfolio total
- 80-issue Jira backlog across 8 epics including 28 compliance review flags
- Multi-tool comparison: same prompts run in Claude.ai, ChatGPT, and Gemini — disagreements used as requirements validation signal

### Product Design (April 13 – June 17, 2026)
- Design system extraction from Vanguard's live portal DevTools → 33-component Figma library
- 12 annotated screens across 4 workflow stages
- Figma wired prototype: 50 connections, zero failures
- Key design decisions logged in PDB decisions log
- Post-handoff revision: Execution Summary screen (ES-1-rev) added transaction context discovered missing during Dev testing

### Development (June 17 – July 9, 2026)
- Full application built with Claude Code + Figma MCP
- All 12 screens wired to real optimization engine and Zustand store
- 58/58 engine unit tests, 2/2 integration flows
- Deployed to Vercel with GitHub Actions CI gate

## Key findings

1. AI-assisted development does not eliminate the need for verification — it shifts where verification happens
2. The working application is a design quality gate — gaps invisible in Figma became visible with real data
3. Sample data must be arithmetically verified before Dev begins
4. Hardcoded values in AI-generated code are a systematic pattern, not one-time scaffolding
5. AI tools default toward safety, not exploration — reaching the automation ceiling requires explicit instruction
6. Notion as single source of truth across all phases enabled traceability from requirement to implementation

## Documentation

Full retrospective: [`retrospective.md`](./retrospective.md)  
Pipeline document: [`ai_pipeline.html`](https://mcasey10.github.io/vanguard-ai-pipeline/ai_pipeline.html)
