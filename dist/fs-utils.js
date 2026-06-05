import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";
const ignoredDirectories = new Set([
    ".git",
    ".hg",
    ".svn",
    "node_modules",
    "dist",
    "build",
    ".next",
    ".nuxt",
    ".svelte-kit",
    "coverage",
    ".turbo",
    ".cache",
    ".agentbriefcase"
]);
export async function walkFiles(root) {
    const entries = [];
    await walk(root, root, entries);
    return entries.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
}
export async function readJsonFile(path) {
    try {
        const raw = await readFile(path, "utf8");
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : undefined;
    }
    catch {
        return undefined;
    }
}
async function walk(root, current, entries) {
    const children = await readdir(current, { withFileTypes: true });
    for (const child of children) {
        if (child.isDirectory() && ignoredDirectories.has(child.name)) {
            continue;
        }
        const absolute = join(current, child.name);
        if (child.isDirectory()) {
            await walk(root, absolute, entries);
            continue;
        }
        if (child.isFile()) {
            const info = await stat(absolute);
            entries.push({
                path: normalizePath(relative(root, absolute)),
                size: info.size
            });
        }
    }
}
function normalizePath(path) {
    return path.split(sep).join("/");
}
