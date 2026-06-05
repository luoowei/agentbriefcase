import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { runCli } from "../src/cli.js";

async function fixtureRepo(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "agentbriefcase-cli-"));
  await writeFile(join(root, "package.json"), JSON.stringify({ scripts: { test: "vitest run" } }));
  await writeFile(join(root, "README.md"), "# Fixture");
  return root;
}

describe("runCli", () => {
  it("prints rendered files to stdout without writing when --stdout is passed", async () => {
    const root = await fixtureRepo();
    const result = await runCli(["--root", root, "--stdout"]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("## AGENTS.md");
    expect(result.stdout).toContain("# Agent Briefcase");
  });

  it("prints only the manifest when --json is passed", async () => {
    const root = await fixtureRepo();
    const result = await runCli(["--root", root, "--json"]);
    const parsed = JSON.parse(result.stdout);

    expect(result.exitCode).toBe(0);
    expect(parsed.name).toContain("agentbriefcase-cli-");
    expect(parsed.files.length).toBe(2);
  });

  it("writes bilingual files with --lang both", async () => {
    const root = await fixtureRepo();
    const result = await runCli(["--root", root, "--lang", "both"]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Wrote 9 files");
    expect(await readFile(join(root, "AGENTS.md"), "utf8")).toContain("Language:");
    expect(await readFile(join(root, ".agentbriefcase", "AGENTS.zh-CN.md"), "utf8")).toContain("语言：");
  });

  it("returns a usage error for invalid languages", async () => {
    const root = await fixtureRepo();
    const result = await runCli(["--root", root, "--lang", "fr"]);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Unsupported language");
  });
});
