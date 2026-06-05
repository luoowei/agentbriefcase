import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
export async function writeRenderedFiles(root, files, options) {
    const result = { written: [], skipped: [] };
    for (const file of files) {
        const target = join(root, file.path);
        if (options.dryRun) {
            result.skipped.push(file.path);
            continue;
        }
        if (!options.force && (await exists(target))) {
            result.skipped.push(file.path);
            continue;
        }
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, file.content, "utf8");
        result.written.push(file.path);
    }
    return result;
}
async function exists(path) {
    try {
        await access(path);
        return true;
    }
    catch {
        return false;
    }
}
