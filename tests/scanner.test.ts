import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { scanRepository } from "../src/scanner.js";

describe("scanRepository", () => {
  it("builds a repository report while ignoring dependency and git folders", async () => {
    const root = await mkdtemp(join(tmpdir(), "agentbriefcase-scan-"));
    await mkdir(join(root, "src"), { recursive: true });
    await mkdir(join(root, "node_modules", "ignored"), { recursive: true });
    await mkdir(join(root, ".git"), { recursive: true });
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({
        scripts: { build: "tsc", test: "vitest run" },
        dependencies: { react: "latest" },
        devDependencies: { vite: "latest" }
      })
    );
    await writeFile(join(root, "package-lock.json"), "{}");
    await writeFile(join(root, "README.md"), "# Fixture");
    await writeFile(join(root, "src", "main.ts"), "export const value = 1;");
    await writeFile(join(root, "node_modules", "ignored", "index.js"), "ignored");
    await writeFile(join(root, ".git", "config"), "ignored");

    const report = await scanRepository(root, new Date("2026-06-05T00:00:00.000Z"));

    expect(report.name).toContain("agentbriefcase-scan-");
    expect(report.files.map((file) => file.path)).toEqual([
      "README.md",
      "package-lock.json",
      "package.json",
      "src/main.ts"
    ]);
    expect(report.packageManagers).toEqual(["npm"]);
    expect(report.frameworks).toEqual(["React", "Vite"]);
    expect(report.languages).toEqual(["Markdown", "TypeScript"]);
    expect(report.commands).toEqual([
      { name: "build", command: "npm run build", confidence: "high" },
      { name: "test", command: "npm test", confidence: "high" }
    ]);
    expect(report.risks).toEqual([]);
    expect(report.generatedAt).toBe("2026-06-05T00:00:00.000Z");
  });
});
