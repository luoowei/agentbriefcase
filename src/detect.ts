import type { FileEntry, ProjectCommand, RiskSignal } from "./types.js";

interface DetectionInput {
  packageJson?: Record<string, unknown>;
  files: FileEntry[];
}

interface RiskInput {
  files: FileEntry[];
  commands: ProjectCommand[];
  packageManagers: string[];
}

const extensionLanguages = new Map<string, string>([
  [".ts", "TypeScript"],
  [".tsx", "TypeScript"],
  [".js", "JavaScript"],
  [".jsx", "JavaScript"],
  [".mjs", "JavaScript"],
  [".cjs", "JavaScript"],
  [".md", "Markdown"],
  [".css", "CSS"],
  [".scss", "CSS"],
  [".py", "Python"],
  [".go", "Go"],
  [".rs", "Rust"],
  [".java", "Java"],
  [".rb", "Ruby"],
  [".php", "PHP"],
  [".cs", "C#"],
  [".cpp", "C++"],
  [".c", "C"],
  [".swift", "Swift"],
  [".kt", "Kotlin"]
]);

export function detectPackageManagers(files: FileEntry[]): string[] {
  const paths = new Set(files.map((file) => file.path));
  const managers: string[] = [];

  if (paths.has("package-lock.json")) managers.push("npm");
  if (paths.has("pnpm-lock.yaml")) managers.push("pnpm");
  if (paths.has("yarn.lock")) managers.push("yarn");
  if (paths.has("bun.lockb") || paths.has("bun.lock")) managers.push("bun");

  return managers;
}

export function detectCommands(input: DetectionInput): ProjectCommand[] {
  const scripts = readObject(input.packageJson?.scripts);
  const commands: ProjectCommand[] = [];

  if (typeof scripts.build === "string") {
    commands.push({ name: "build", command: "npm run build", confidence: "high" });
  }

  if (typeof scripts.test === "string") {
    commands.push({ name: "test", command: "npm test", confidence: "high" });
  }

  if (typeof scripts.lint === "string") {
    commands.push({ name: "lint", command: "npm run lint", confidence: "high" });
  }

  if (typeof scripts.format === "string") {
    commands.push({ name: "format", command: "npm run format", confidence: "high" });
  }

  if (commands.length === 0 && input.files.some((file) => /^vite\.config\.[cm]?[jt]s$/.test(file.path))) {
    commands.push({ name: "build", command: "npm run build", confidence: "low" });
  }

  return commands;
}

export function detectFrameworks(input: DetectionInput): string[] {
  const deps = {
    ...readObject(input.packageJson?.dependencies),
    ...readObject(input.packageJson?.devDependencies)
  };
  const paths = new Set(input.files.map((file) => file.path));
  const frameworks: string[] = [];

  addIf(frameworks, "Next.js", deps.next !== undefined || paths.has("next.config.js") || paths.has("next.config.mjs"));
  addIf(frameworks, "React", deps.react !== undefined);
  addIf(frameworks, "Vite", deps.vite !== undefined || [...paths].some((path) => /^vite\.config\.[cm]?[jt]s$/.test(path)));
  addIf(frameworks, "Express", deps.express !== undefined);
  addIf(frameworks, "Vitest", deps.vitest !== undefined || paths.has("vitest.config.ts"));
  addIf(frameworks, "Vue", deps.vue !== undefined);
  addIf(frameworks, "Svelte", deps.svelte !== undefined);
  addIf(frameworks, "Astro", deps.astro !== undefined || paths.has("astro.config.mjs"));
  addIf(frameworks, "Tailwind CSS", deps.tailwindcss !== undefined || paths.has("tailwind.config.js"));

  return frameworks;
}

export function detectLanguages(files: FileEntry[]): string[] {
  const counts = new Map<string, { count: number; firstSeen: number }>();

  for (const [index, file] of files.entries()) {
    const language = extensionLanguages.get(extensionOf(file.path));
    if (language) {
      const current = counts.get(language);
      counts.set(language, current ? { ...current, count: current.count + 1 } : { count: 1, firstSeen: index });
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1].count - a[1].count || a[1].firstSeen - b[1].firstSeen)
    .map(([language]) => language);
}

export function detectRisks(input: RiskInput): RiskSignal[] {
  const paths = new Set(input.files.map((file) => file.path));
  const risks: RiskSignal[] = [];

  if (!hasReadme(paths)) {
    risks.push({
      id: "missing-readme",
      severity: "medium",
      title: "README is missing",
      detail: "Agents and contributors do not have a stable project overview."
    });
  }

  if (!hasTests(input.files, input.commands)) {
    risks.push({
      id: "missing-tests",
      severity: "medium",
      title: "No obvious tests found",
      detail: "No test command or test files were detected, so agent changes are harder to verify."
    });
  }

  if (input.files.some((file) => /^\.env($|\.)/.test(file.path) && !file.path.endsWith(".example"))) {
    risks.push({
      id: "env-file-present",
      severity: "high",
      title: "Environment file may contain secrets",
      detail: "A real .env file is present. Do not paste secrets into AI chats or public issues."
    });
  }

  if (input.files.some((file) => file.size > 1_000_000)) {
    risks.push({
      id: "large-files",
      severity: "low",
      title: "Large files detected",
      detail: "Large files can waste context budget and may need explicit ignore rules."
    });
  }

  if (paths.has("package.json") && input.packageManagers.length === 0) {
    risks.push({
      id: "missing-lockfile",
      severity: "medium",
      title: "Package lockfile is missing",
      detail: "Without a lockfile, installs may differ across developers and agents."
    });
  }

  return risks;
}

function addIf(values: string[], value: string, condition: boolean): void {
  if (condition) values.push(value);
}

function extensionOf(path: string): string {
  const index = path.lastIndexOf(".");
  return index === -1 ? "" : path.slice(index).toLowerCase();
}

function hasReadme(paths: Set<string>): boolean {
  return [...paths].some((path) => /^readme(\.[a-z0-9-]+)?\.md$/i.test(path));
}

function hasTests(files: FileEntry[], commands: ProjectCommand[]): boolean {
  return (
    commands.some((command) => command.name === "test") ||
    files.some((file) => /(^|\/)(__tests__|tests?|spec)\//.test(file.path) || /\.(test|spec)\.[cm]?[jt]sx?$/.test(file.path))
  );
}

function readObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
