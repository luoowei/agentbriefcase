#!/usr/bin/env node
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderFiles } from "./render.js";
import { scanRepository } from "./scanner.js";
import { writeRenderedFiles } from "./writer.js";
export async function runCli(argv) {
    const parsed = parseArgs(argv);
    if ("error" in parsed) {
        return { exitCode: 1, stdout: "", stderr: `${parsed.error}\n\n${usage()}` };
    }
    const options = parsed.options;
    if (options.help) {
        return { exitCode: 0, stdout: usage(), stderr: "" };
    }
    try {
        const report = await scanRepository(options.root);
        if (options.json) {
            return { exitCode: 0, stdout: `${JSON.stringify(report, null, 2)}\n`, stderr: "" };
        }
        const rendered = renderFiles(report, options.language);
        if (options.stdout) {
            return { exitCode: 0, stdout: renderStdout(rendered), stderr: "" };
        }
        const result = await writeRenderedFiles(options.root, rendered, {
            dryRun: options.dryRun,
            force: options.force
        });
        const action = options.dryRun ? "Would write" : "Wrote";
        const skipped = result.skipped.length > 0 ? ` Skipped ${result.skipped.length} existing/planned files.` : "";
        return {
            exitCode: 0,
            stdout: `${action} ${options.dryRun ? result.skipped.length : result.written.length} files to ${options.root}.${skipped}\n`,
            stderr: ""
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { exitCode: 1, stdout: "", stderr: `${message}\n` };
    }
}
function parseArgs(argv) {
    const options = {
        root: process.cwd(),
        language: "en",
        stdout: false,
        json: false,
        dryRun: false,
        force: false,
        help: false
    };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === "--help" || arg === "-h") {
            options.help = true;
        }
        else if (arg === "--root") {
            const value = argv[index + 1];
            if (!value)
                return { error: "--root requires a path" };
            options.root = resolve(value);
            index += 1;
        }
        else if (arg === "--lang") {
            const value = argv[index + 1];
            if (!isLanguageMode(value))
                return { error: `Unsupported language: ${value ?? ""}` };
            options.language = value;
            index += 1;
        }
        else if (arg === "--stdout") {
            options.stdout = true;
        }
        else if (arg === "--json") {
            options.json = true;
        }
        else if (arg === "--dry-run") {
            options.dryRun = true;
        }
        else if (arg === "--force") {
            options.force = true;
        }
        else {
            return { error: `Unknown option: ${arg}` };
        }
    }
    return { options };
}
function isLanguageMode(value) {
    return value === "en" || value === "zh-CN" || value === "both";
}
function renderStdout(files) {
    return files.map((file) => `## ${file.path}\n\n${file.content}`).join("\n---\n\n");
}
function usage() {
    return `AgentBriefcase - context diet CLI for AI coding agents.

Usage:
  agentbriefcase [--root <path>] [--lang en|zh-CN|both] [--force]
  agentbriefcase --stdout
  agentbriefcase --json
  agentbriefcase --dry-run

Options:
  --root <path>          Repository root. Defaults to the current directory.
  --lang <mode>          Generated context language: en, zh-CN, or both.
  --force                Overwrite existing generated targets.
  --stdout               Print generated files without writing.
  --json                 Print the repository manifest as JSON.
  --dry-run              Show what would be written without writing.
  -h, --help             Show this help.
`;
}
const entry = process.argv[1] ? fileURLToPath(import.meta.url) === resolve(process.argv[1]) : false;
if (entry) {
    runCli(process.argv.slice(2)).then((result) => {
        if (result.stdout)
            process.stdout.write(result.stdout);
        if (result.stderr)
            process.stderr.write(result.stderr);
        process.exitCode = result.exitCode;
    });
}
