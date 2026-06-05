import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { writeRenderedFiles } from "../src/writer.js";
import type { RenderedFile } from "../src/types.js";

const rendered: RenderedFile[] = [
  { path: "AGENTS.md", content: "agents" },
  { path: ".agentbriefcase/context.md", content: "context" }
];

describe("writeRenderedFiles", () => {
  it("returns dry-run paths without writing files", async () => {
    const root = await mkdtemp(join(tmpdir(), "agentbriefcase-write-"));

    const result = await writeRenderedFiles(root, rendered, { dryRun: true, force: false });

    expect(result.written).toEqual([]);
    expect(result.skipped).toEqual(["AGENTS.md", ".agentbriefcase/context.md"]);
  });

  it("protects existing files unless force is enabled", async () => {
    const root = await mkdtemp(join(tmpdir(), "agentbriefcase-write-"));
    await writeFile(join(root, "AGENTS.md"), "user content");

    const result = await writeRenderedFiles(root, rendered, { dryRun: false, force: false });

    expect(result.written).toEqual([".agentbriefcase/context.md"]);
    expect(result.skipped).toEqual(["AGENTS.md"]);
    expect(await readFile(join(root, "AGENTS.md"), "utf8")).toBe("user content");
  });

  it("overwrites generated targets when force is enabled", async () => {
    const root = await mkdtemp(join(tmpdir(), "agentbriefcase-write-"));
    await writeFile(join(root, "AGENTS.md"), "user content");

    const result = await writeRenderedFiles(root, rendered, { dryRun: false, force: true });

    expect(result.written).toEqual(["AGENTS.md", ".agentbriefcase/context.md"]);
    expect(result.skipped).toEqual([]);
    expect(await readFile(join(root, "AGENTS.md"), "utf8")).toBe("agents");
  });
});
