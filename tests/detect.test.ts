import { describe, expect, it } from "vitest";
import {
  detectCommands,
  detectFrameworks,
  detectLanguages,
  detectPackageManagers,
  detectRisks
} from "../src/detect.js";
import type { FileEntry } from "../src/types.js";

const files = (paths: string[]): FileEntry[] =>
  paths.map((path) => ({ path, size: path.includes("large") ? 1_500_000 : 100 }));

describe("detectPackageManagers", () => {
  it("detects npm, pnpm, yarn, and bun lockfiles", () => {
    expect(
      detectPackageManagers(files(["package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lockb"]))
    ).toEqual(["npm", "pnpm", "yarn", "bun"]);
  });
});

describe("detectCommands", () => {
  it("maps package scripts into agent-safe commands", () => {
    const commands = detectCommands({
      packageJson: {
        scripts: {
          build: "vite build",
          test: "vitest run",
          lint: "eslint .",
          format: "prettier . --check"
        }
      },
      files: files(["package.json", "src/main.ts"])
    });

    expect(commands).toEqual([
      { name: "build", command: "npm run build", confidence: "high" },
      { name: "test", command: "npm test", confidence: "high" },
      { name: "lint", command: "npm run lint", confidence: "high" },
      { name: "format", command: "npm run format", confidence: "high" }
    ]);
  });

  it("falls back to low-confidence framework commands when scripts are absent", () => {
    expect(
      detectCommands({
        packageJson: {},
        files: files(["vite.config.ts", "src/App.tsx"])
      })
    ).toEqual([{ name: "build", command: "npm run build", confidence: "low" }]);
  });
});

describe("detectFrameworks", () => {
  it("detects common frontend and backend frameworks", () => {
    expect(
      detectFrameworks({
        packageJson: {
          dependencies: {
            next: "latest",
            react: "latest",
            express: "latest"
          },
          devDependencies: {
            vite: "latest",
            vitest: "latest"
          }
        },
        files: files(["next.config.js", "vite.config.ts"])
      })
    ).toEqual(["Next.js", "React", "Vite", "Express", "Vitest"]);
  });
});

describe("detectLanguages", () => {
  it("orders languages by file count", () => {
    expect(detectLanguages(files(["src/a.ts", "src/b.ts", "src/c.js", "README.md", "styles.css"]))).toEqual([
      "TypeScript",
      "JavaScript",
      "Markdown",
      "CSS"
    ]);
  });
});

describe("detectRisks", () => {
  it("flags missing README, missing tests, env files, oversized files, and package without lockfile", () => {
    const risks = detectRisks({
      files: files(["package.json", ".env", "assets/large.bin"]),
      commands: [],
      packageManagers: []
    });

    expect(risks.map((risk) => risk.id)).toEqual([
      "missing-readme",
      "missing-tests",
      "env-file-present",
      "large-files",
      "missing-lockfile"
    ]);
  });
});
