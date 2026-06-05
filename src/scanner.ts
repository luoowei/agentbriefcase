import { basename, join } from "node:path";
import { detectCommands, detectFrameworks, detectLanguages, detectPackageManagers, detectRisks } from "./detect.js";
import { readJsonFile, walkFiles } from "./fs-utils.js";
import type { RepositoryReport } from "./types.js";

const keyFileNames = new Set([
  "README.md",
  "package.json",
  "tsconfig.json",
  "vite.config.ts",
  "vite.config.js",
  "next.config.js",
  "next.config.mjs",
  "Dockerfile",
  "docker-compose.yml",
  ".github/workflows/ci.yml",
  ".github/workflows/test.yml"
]);

export async function scanRepository(root: string, now = new Date()): Promise<RepositoryReport> {
  const files = await walkFiles(root);
  const packageJson = await readJsonFile(join(root, "package.json"));
  const packageManagers = detectPackageManagers(files);
  const commands = detectCommands({ packageJson, files });

  return {
    root,
    name: packageName(packageJson) ?? basename(root),
    generatedAt: now.toISOString(),
    files,
    packageManagers,
    frameworks: detectFrameworks({ packageJson, files }),
    languages: detectLanguages(files),
    commands,
    risks: detectRisks({ files, commands, packageManagers }),
    keyFiles: detectKeyFiles(files.map((file) => file.path))
  };
}

function packageName(packageJson: Record<string, unknown> | undefined): string | undefined {
  return typeof packageJson?.name === "string" ? packageJson.name : undefined;
}

function detectKeyFiles(paths: string[]): string[] {
  const keyFiles = paths.filter((path) => keyFileNames.has(path) || path.startsWith(".github/workflows/"));
  return keyFiles.slice(0, 20);
}
