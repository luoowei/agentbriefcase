# AgentBriefcase

**Language:** English | [中文](docs/README.zh-CN.md)

Context diet CLI for AI coding agents. AgentBriefcase scans a repository and generates a small, source-grounded context pack so Codex, GitHub Copilot, Claude Code, Cursor, and other coding agents start with facts instead of guesswork.

```bash
npm exec --yes --package=https://github.com/luoowei/agentbriefcase/archive/refs/heads/main.tar.gz -c "agentbriefcase --lang both"
```

## Why

AI coding agents are powerful, but they often fail for boring reasons: stale project notes, missing test commands, unclear entry points, oversized context dumps, and hidden repo risks. AgentBriefcase does not try to pack your whole repository. It generates the smallest useful brief an agent should read before editing.

## What It Generates

- `AGENTS.md` - the agent-facing entry point.
- `.agentbriefcase/context.md` - repository shape, languages, frameworks, package managers, key files, and file overview.
- `.agentbriefcase/checks.md` - detected build, test, lint, and format commands.
- `.agentbriefcase/risks.md` - practical risks such as missing tests, missing lockfiles, real `.env` files, and large files.
- `.agentbriefcase/manifest.json` - machine-readable repository report.

Use `--lang both` to generate English and Simplified Chinese context files with language switch links.

## Install

Run directly from GitHub:

```bash
npm exec --yes --package=https://github.com/luoowei/agentbriefcase/archive/refs/heads/main.tar.gz -c "agentbriefcase"
```

Or install locally after cloning:

```bash
npm install
npm run build
npm link
agentbriefcase --help
```

## Usage

Generate the default English pack:

```bash
agentbriefcase
```

Generate bilingual output:

```bash
agentbriefcase --lang both
```

Preview without writing:

```bash
agentbriefcase --stdout
```

Inspect the manifest:

```bash
agentbriefcase --json
```

Show planned targets:

```bash
agentbriefcase --dry-run
```

Overwrite existing generated files:

```bash
agentbriefcase --force
```

Scan another repository:

```bash
agentbriefcase --root ../my-app --lang both
```

## Philosophy

AgentBriefcase is a context diet, not a context landfill.

- Prefer facts over prose.
- Prefer short generated files over giant prompt dumps.
- Prefer verification commands over vibes.
- Prefer safe defaults: existing files are not overwritten unless `--force` is passed.
- Prefer bilingual docs without making the GitHub front page noisy.

## Example

See [`examples/sample-output`](examples/sample-output) for a generated bilingual pack.

## Development

```bash
npm install
npm test
npm run build
```

The CLI runtime uses Node built-ins only. TypeScript and Vitest are development dependencies.

## Launch Notes

If this helps your agent make fewer wrong edits, star the repo and share the generated `AGENTS.md` pattern with your team. The launch copy and channel checklist live in [`LAUNCH.md`](LAUNCH.md).

## License

MIT
