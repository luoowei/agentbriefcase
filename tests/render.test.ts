import { describe, expect, it } from "vitest";
import { renderFiles } from "../src/render.js";
import type { RepositoryReport } from "../src/types.js";

const report: RepositoryReport = {
  root: "/repo/agentbriefcase",
  name: "agentbriefcase",
  generatedAt: "2026-06-05T00:00:00.000Z",
  files: [
    { path: "README.md", size: 100 },
    { path: "package.json", size: 100 },
    { path: "src/cli.ts", size: 100 }
  ],
  packageManagers: ["npm"],
  frameworks: ["Vite", "Vitest"],
  languages: ["TypeScript", "Markdown"],
  commands: [
    { name: "build", command: "npm run build", confidence: "high" },
    { name: "test", command: "npm test", confidence: "high" }
  ],
  risks: [
    {
      id: "missing-lockfile",
      severity: "medium",
      title: "Package lockfile is missing",
      detail: "Without a lockfile, installs may differ."
    }
  ],
  keyFiles: ["README.md", "package.json"]
};

describe("renderFiles", () => {
  it("renders the default English context pack", () => {
    const rendered = renderFiles(report, "en");

    expect(rendered.map((file) => file.path)).toEqual([
      "AGENTS.md",
      ".agentbriefcase/context.md",
      ".agentbriefcase/checks.md",
      ".agentbriefcase/risks.md",
      ".agentbriefcase/manifest.json"
    ]);
    expect(rendered[0].content).toContain("# Agent Briefcase");
    expect(rendered[0].content).toContain("Language: English");
    expect(rendered[0].content).not.toContain(".agentbriefcase/AGENTS.zh-CN.md");
    expect(rendered[1].content).toContain("## Repository Shape");
    expect(rendered[2].content).toContain("npm test");
    expect(rendered[3].content).toContain("Package lockfile is missing");
  });

  it("renders Chinese output when requested", () => {
    const rendered = renderFiles(report, "zh-CN");

    expect(rendered[0].content).toContain("# Agent 简报箱");
    expect(rendered[0].content).toContain("语言：中文");
    expect(rendered[0].content).not.toContain(".agentbriefcase/AGENTS.en.md");
    expect(rendered[1].content).toContain("## 仓库形态");
  });

  it("renders both language entry files when requested", () => {
    const rendered = renderFiles(report, "both");

    expect(rendered.map((file) => file.path)).toEqual([
      "AGENTS.md",
      ".agentbriefcase/AGENTS.zh-CN.md",
      ".agentbriefcase/context.md",
      ".agentbriefcase/context.zh-CN.md",
      ".agentbriefcase/checks.md",
      ".agentbriefcase/checks.zh-CN.md",
      ".agentbriefcase/risks.md",
      ".agentbriefcase/risks.zh-CN.md",
      ".agentbriefcase/manifest.json"
    ]);
    expect(rendered[0].content).toContain("Language: [English](AGENTS.md) | [中文](.agentbriefcase/AGENTS.zh-CN.md)");
    expect(rendered[1].content).toContain("语言：[English](../AGENTS.md) | [中文](AGENTS.zh-CN.md)");
  });
});
