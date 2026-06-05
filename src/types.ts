export type LanguageMode = "en" | "zh-CN" | "both";

export interface FileEntry {
  path: string;
  size: number;
}

export interface ProjectCommand {
  name: string;
  command: string;
  confidence: "high" | "medium" | "low";
}

export interface RiskSignal {
  id: string;
  severity: "high" | "medium" | "low";
  title: string;
  detail: string;
}

export interface RepositoryReport {
  root: string;
  name: string;
  generatedAt: string;
  files: FileEntry[];
  packageManagers: string[];
  frameworks: string[];
  languages: string[];
  commands: ProjectCommand[];
  risks: RiskSignal[];
  keyFiles: string[];
}

export interface RenderedFile {
  path: string;
  content: string;
}
