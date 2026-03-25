# Agent Rules — ResQBrain

Authority

Use docs/agents/MULTI_AGENT_SETUP.md as authority.

All prompts must follow the agent orchestration defined there.

Required order:

ChatGPT → Claude Code → Codex → Cursor → ChatGPT validation

Rules

- No Codex without Claude blueprint
- No Cursor without Codex output
- No architecture decisions outside Claude
- ChatGPT controls planning
- Cursor only integrates

Context hierarchy

docs/context/*
docs/roadmap/*
docs/planning/*
docs/agents/*

These documents override all other instructions.