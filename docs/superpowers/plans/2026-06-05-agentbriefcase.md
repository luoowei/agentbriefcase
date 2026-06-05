# AgentBriefcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a zero-config CLI that generates compact AI-agent context packs for repositories.

**Architecture:** A TypeScript Node CLI scans repository facts, renders deterministic Markdown/JSON outputs, and writes them safely. Runtime code uses Node built-ins only; tests use Vitest fixtures and temporary directories.

**Tech Stack:** Node.js, TypeScript, Vitest, GitHub CLI.

---

### Task 1: Project Scaffold And Tests

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `src/types.ts`
- Create: `tests/detect.test.ts`

- [ ] Create the Node package metadata with build, test, and CLI scripts.
- [ ] Add TypeScript and Vitest configuration.
- [ ] Define repository report types.
- [ ] Write failing detection tests for package managers, commands, languages, and risks.
- [ ] Run `npm test` and verify the tests fail because detection modules do not exist.

### Task 2: Scanner And Detection

**Files:**
- Create: `src/fs-utils.ts`
- Create: `src/detect.ts`
- Create: `src/scanner.ts`
- Modify: `tests/detect.test.ts`

- [ ] Implement ignored-directory walking and safe JSON reading.
- [ ] Implement framework, package manager, command, language, and risk detection.
- [ ] Implement repository scanning into a `RepositoryReport`.
- [ ] Run `npm test` and verify detection tests pass.

### Task 3: Rendering

**Files:**
- Create: `src/render.ts`
- Create: `tests/render.test.ts`

- [ ] Write failing render tests for English, Chinese, and bilingual generated files.
- [ ] Implement Markdown and manifest rendering.
- [ ] Run `npm test` and verify render tests pass.

### Task 4: Writer And CLI

**Files:**
- Create: `src/writer.ts`
- Create: `src/cli.ts`
- Create: `tests/writer.test.ts`
- Create: `tests/cli.test.ts`

- [ ] Write failing tests for dry-run, stdout, JSON, existing-file protection, and forced overwrite.
- [ ] Implement safe file writing and CLI argument parsing.
- [ ] Run `npm test` and verify writer and CLI tests pass.

### Task 5: Documentation And Launch Materials

**Files:**
- Create: `README.md`
- Create: `docs/README.zh-CN.md`
- Create: `LAUNCH.md`
- Create: `LICENSE`
- Create: `examples/sample-output/`

- [ ] Write English README with a language switch entry.
- [ ] Write Chinese README with a language switch entry.
- [ ] Generate sample output from a fixture repository.
- [ ] Write launch copy and channel checklist.
- [ ] Run `npm run build` and `npm test`.

### Task 6: GitHub Release

**Files:**
- Modify: repository git state

- [ ] Commit the implementation.
- [ ] Create a public GitHub repository under the authenticated account.
- [ ] Push the repository.
- [ ] Verify the GitHub URL is accessible through `gh repo view --web=false`.
