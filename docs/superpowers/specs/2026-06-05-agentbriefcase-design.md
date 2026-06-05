# AgentBriefcase Design

## Goal

AgentBriefcase is a zero-config CLI that scans a repository and writes a compact, source-grounded context pack for AI coding agents. The first release targets developers who use Codex, GitHub Copilot, Claude Code, Cursor, or similar tools and want agents to understand project facts without flooding the context window.

## Research Signal

The 2025 Stack Overflow Developer Survey shows high AI tool adoption but declining trust in AI output accuracy. GitHub and OpenAI both document repository-level instruction files for coding agents, while popular tools such as Repomix show demand for repository-to-context workflows. The market gap is a smaller, safer "context diet" tool: generate only the commands, structure, risks, and conventions that an agent needs before editing.

## Product Scope

The MVP provides one command:

```bash
npm exec --yes --package=https://github.com/luoowei/agentbriefcase/archive/refs/heads/main.tar.gz -c "agentbriefcase"
```

It scans the current repository and writes:

- `AGENTS.md`
- `.agentbriefcase/context.md`
- `.agentbriefcase/checks.md`
- `.agentbriefcase/risks.md`
- `.agentbriefcase/manifest.json`

It also supports:

- `--stdout` to preview generated files without writing.
- `--dry-run` to show target paths.
- `--json` to print the manifest.
- `--lang en|zh-CN|both` for generated document language.
- `--force` to overwrite existing generated files.

## Bilingual Documentation

The public repository documentation must be available in English and Simplified Chinese. The root `README.md` is English-first for international GitHub discovery and includes a language switch link to `docs/README.zh-CN.md`. The Chinese README links back to the English README. Both documents cover installation, usage, output files, design philosophy, examples, and launch positioning.

## Architecture

The CLI is split into focused units:

- `cli.ts` parses arguments, calls the scanner and generator, and handles output.
- `scanner.ts` gathers repository facts using Node filesystem APIs.
- `detect.ts` identifies package managers, frameworks, languages, scripts, test/build commands, and risk signals.
- `render.ts` turns a repository report into generated Markdown and JSON files.
- `writer.ts` handles overwrite safety, dry-run, stdout, and filesystem writes.

All runtime logic uses Node built-ins only. Development uses TypeScript and Vitest.

## Data Flow

1. Resolve the target repository path.
2. Walk files while ignoring `.git`, `node_modules`, common build outputs, and hidden cache folders.
3. Parse known manifest files such as `package.json`.
4. Produce a `RepositoryReport`.
5. Render a deterministic set of generated files.
6. Write files unless `--stdout`, `--json`, or `--dry-run` changes output behavior.

## Safety Rules

The CLI never deletes files. Existing output files are preserved unless `--force` is passed. Generated files include a marker comment so future versions can distinguish tool output from user-authored files.

## Testing

Tests cover:

- Package manager and script detection.
- Risk detection for missing README, missing tests, missing lockfile, and env files.
- Markdown rendering for English and Chinese modes.
- Writer behavior for dry-run, stdout, existing-file protection, and forced overwrite.
- CLI behavior on a fixture repository.

## Launch Assets

The repository includes:

- English and Chinese README files with language switch links.
- `examples/sample-output/` generated from a small fixture.
- `LAUNCH.md` with GitHub, Hacker News, Reddit, X, and Chinese community launch copy.
- MIT license.
