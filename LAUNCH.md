# AgentBriefcase Launch Kit

## One-Line Pitch

AgentBriefcase is a context diet CLI for AI coding agents: one command generates a tiny AGENTS.md pack with repo facts, checks, and risks.

## GitHub Description

Context diet CLI for AI coding agents. Generate compact AGENTS.md, checks, risks, and bilingual repo context for Codex, Copilot, Claude Code, and Cursor.

## GitHub Topics

`ai`, `agents`, `codex`, `copilot`, `claude`, `cursor`, `context-engineering`, `agents-md`, `developer-tools`, `cli`

## X / Twitter

I built AgentBriefcase: a context diet CLI for AI coding agents.

Instead of dumping your whole repo into context, it generates a small AGENTS.md pack:

- repo facts
- test/build commands
- risk signals
- bilingual docs

Try:

```bash
npm exec --yes --package=https://github.com/luoowei/agentbriefcase/archive/refs/heads/main.tar.gz -c "agentbriefcase --lang both"
```

Repo: https://github.com/luoowei/agentbriefcase

## Hacker News

Title: Show HN: AgentBriefcase - context diet CLI for AI coding agents

Post:

AI coding agents often fail because they start with too much context, stale context, or no project-specific verification path.

I built AgentBriefcase, a tiny Node CLI that scans a repo and generates a compact context pack:

- AGENTS.md as the agent-facing entry point
- repo shape and key files
- detected test/build/lint/format commands
- practical risk signals such as missing tests, missing lockfile, real .env files, and large files
- English + Simplified Chinese docs via `--lang both`

It uses Node built-ins at runtime and avoids overwriting existing files unless `--force` is passed.

## Reddit

Title: I made a CLI that gives AI coding agents a smaller, safer repo brief

Body:

I kept seeing agents make avoidable mistakes because they read stale docs or huge prompt dumps. AgentBriefcase scans a repo and writes a compact AGENTS.md pack with facts, commands, and risks.

It is intentionally small: no runtime dependencies, no cloud service, no LLM call.

```bash
npm exec --yes --package=https://github.com/luoowei/agentbriefcase/archive/refs/heads/main.tar.gz -c "agentbriefcase --lang both"
```

I would love feedback on which repo signals should be detected next.

## 中文社区

标题：我做了一个给 AI 编程 Agent 用的“上下文减脂”CLI

正文：

Agent 经常不是不会写代码，而是开局上下文太乱：README 过期、测试命令不清楚、整个仓库被塞进 prompt。AgentBriefcase 会扫描仓库，生成一组小而准的上下文文件：

- `AGENTS.md`
- 仓库形态和关键文件
- 构建/测试/lint/format 命令
- 缺测试、缺 lockfile、真实 `.env`、大文件等风险提醒
- 支持中英双语：`--lang both`

运行：

```bash
npm exec --yes --package=https://github.com/luoowei/agentbriefcase/archive/refs/heads/main.tar.gz -c "agentbriefcase --lang both"
```

GitHub: https://github.com/luoowei/agentbriefcase

## Day-One Checklist

- Pin the repository on the GitHub profile.
- Add the topics listed above.
- Post to X with a screenshot of generated `AGENTS.md`.
- Submit to Hacker News as Show HN.
- Share in Reddit communities focused on AI coding and developer tools.
- Share in Chinese developer communities with the Chinese copy.
- Ask early users to paste the before/after of agent behavior, not just star the repo.

## One-Week Star Plan

- Day 1: Launch on GitHub, X, HN, Reddit, and Chinese communities.
- Day 2: Add badges and examples from 3 real frameworks.
- Day 3: Ship framework-specific risk rules for Next.js, Vite, Python, and Go.
- Day 4: Add GitHub Action mode that checks whether AGENTS.md is stale.
- Day 5: Publish short demo video.
- Day 6: Collect issues and label good-first-issue tasks.
- Day 7: Ship v0.2.0 and repost with concrete improvements.
