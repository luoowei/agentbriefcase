# AgentBriefcase

**语言：** [English](../README.md) | 中文

面向 AI 编程 Agent 的“上下文减脂”CLI。AgentBriefcase 会扫描仓库，生成一组小而准、基于真实源码的上下文文件，让 Codex、GitHub Copilot、Claude Code、Cursor 等工具先读事实，再开始改代码。

```bash
npx github:luoowei/agentbriefcase --lang both
```

## 为什么需要它

AI 编程 Agent 很强，但经常输在一些朴素问题上：项目说明过期、测试命令不清楚、入口文件不明确、上下文一次塞太多、仓库风险没人提醒。AgentBriefcase 不会把整个仓库打包成巨型提示词，而是生成 Agent 开始工作前最该读的简报。

## 会生成什么

- `AGENTS.md`：Agent 入口说明。
- `.agentbriefcase/context.md`：仓库形态、语言、框架、包管理器、关键文件和文件概览。
- `.agentbriefcase/checks.md`：检测到的构建、测试、lint、format 命令。
- `.agentbriefcase/risks.md`：缺测试、缺 lockfile、真实 `.env` 文件、大文件等风险信号。
- `.agentbriefcase/manifest.json`：机器可读的仓库报告。

使用 `--lang both` 可以生成英文和简体中文文件，并带语言切换入口。

## 安装

直接从 GitHub 运行：

```bash
npx github:luoowei/agentbriefcase
```

克隆后本地安装：

```bash
npm install
npm run build
npm link
agentbriefcase --help
```

## 用法

生成默认英文上下文包：

```bash
agentbriefcase
```

生成中英双语输出：

```bash
agentbriefcase --lang both
```

只预览，不写文件：

```bash
agentbriefcase --stdout
```

输出 JSON 报告：

```bash
agentbriefcase --json
```

查看将写入哪些文件：

```bash
agentbriefcase --dry-run
```

覆盖已有生成文件：

```bash
agentbriefcase --force
```

扫描其他仓库：

```bash
agentbriefcase --root ../my-app --lang both
```

## 设计理念

AgentBriefcase 是上下文减脂，不是上下文堆填。

- 用事实代替长篇口号。
- 用短文件代替巨型 prompt dump。
- 用验证命令代替感觉。
- 默认安全：除非传入 `--force`，不会覆盖已有文件。
- 双语友好，但保持 GitHub 首屏干净。

## 示例

查看 [`examples/sample-output`](../examples/sample-output) 中生成的双语上下文包。

## 开发

```bash
npm install
npm test
npm run build
```

CLI 运行时只使用 Node 内置模块。TypeScript 和 Vitest 仅用于开发。

## 许可证

MIT
