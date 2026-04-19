# Vanguard AI Pipeline — Project Context

## What this project is
A portfolio project demonstrating AI-assisted product development across PM, PD, and Dev roles using a hypothetical Vanguard Sell & Rebalance tool as the case study. The tool helps long-term mutual fund investors optimize portfolio withdrawals for simultaneous tax minimization and rebalancing.

## Source of truth hierarchy
1. **Notion PRD workspace** — all product decisions, requirements, user journeys, design decisions
   - Root: https://www.notion.so/Vanguard-Sell-Rebalance-PRD-33edcac9574a808da907cc9decefb512
   - Always read the relevant Notion page BEFORE starting any task
   - Page IDs: 04 (user journeys), 05 (functional requirements), 06 (open questions), 07 (data model), 13 (PD decisions log), 14 (design system)
2. **Jira** — backlog and story tracking, project key VSR
3. **GitHub** — repo mcasey10/vanguard-ai-pipeline, Pages at mcasey10.github.io/vanguard-ai-pipeline

## Tool connections (MCP)
- Notion MCP: read/write PRD workspace
- Figma MCP: read/write Figma files via REST API (PAT configured in ~/.claude.json)
- Atlassian Rovo MCP: Jira issue creation and management

## Repo structure
```
vanguard-ai-pipeline/
├── CLAUDE.md          ← this file
├── pm/                ← PM phase artifacts
│   ├── CLAUDE.md      ← PM-specific context
│   └── [visual HTML artifacts hosted on GitHub Pages]
├── pd/                ← PD phase artifacts
│   ├── CLAUDE.md      ← PD-specific context
│   └── FIGMA_DESIGN_SYSTEM.md
└── dev/               ← Dev phase artifacts
    └── CLAUDE.md      ← Dev-specific context
```

## Critical rules
- ALWAYS read the relevant Notion page before starting any task — never rely on memory
- ALWAYS confirm what you are about to do before making changes to Figma, Notion, or Jira
- ALWAYS report what was created/changed after completing a task
- NEVER overwrite existing Figma files without explicit confirmation
- When in doubt about a design decision, read Notion page 13 (PD decisions log) first
