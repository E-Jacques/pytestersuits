import { accessSync, lstatSync, readdirSync, Stats } from "fs";
import { join } from "path";

export function getLineCount(textToEvaluate: string): number {
    return textToEvaluate.split(/\r\n|\r|\n/).length;
}

export function addExtensionToEnd (filename: string, ext: string): string {
    if (ext[0] !== ".") { ext = "." + ext; }
    let extDotCount = ext.split(".").length - 1;
    let filenameDotCount = filename.split(".").length - 1;

    let idx = filename.length - 1;
    for (let _ = 0; _ < Math.min(extDotCount, filenameDotCount); _++ ) {
        idx = filename.lastIndexOf(".", idx - 1);
    }        

    if (idx >= 0 && ext.startsWith(filename.substring(idx))) {
        filename = filename.substring(0, idx);
    }

    if (filename[filename.length - 1] === ".") {
        filename = filename.substring(0, filename.length - 1);
    }    

    return filename + ext;
}

export function isDirectory(filepath: string): boolean {
    let fileStats: Stats;

    try {
        fileStats = lstatSync(filepath);
    } catch (error) {
        return false;
    }

    return fileStats.isDirectory();
}

export function isExtension(file: string, ext: string): boolean {
    let baseIndex = file.length - ext.length;
    if (baseIndex < 1) {
        return false;
    }

    if (file[baseIndex - 1] !== ".") {
        return false;
    }

    for (let i = 0; i < baseIndex; i++) {
        if (ext[i] !== file[baseIndex + i]) {
            return false;
        }
    }

    return true;
}

export function camelCaseToPythonString(toTransform: string): string {
    const uppercase = "AZERTYUIOPQSDFGHJKLMWXCVBN";
    let res = "";

    for (let i = 0; i < toTransform.length; i++) {
        let c = toTransform[i];
        if (uppercase.includes(c)) {
            if (i !== 0 && toTransform[i - 1] !== " ") {
                res += "_";
            }

            res += c.toLowerCase();
        } else {
            res += c;
        }
    }

    res = res.split(" ").join("_");

    return res;
}

export function getFileWithExtension(dirToScan: string, ext: string): string[] {
    try {
        accessSync(dirToScan);
    } catch (error) {
        return [];
    }

    let files = readdirSync(dirToScan);
    let filteredFiles = files.filter(f => { return isExtension(f, ext); });

    let dirs = files.filter(d => { return isDirectory(join(dirToScan, d)); });
    for (let dir of dirs) {
        let dirRes = getFileWithExtension(join(dirToScan, dir), ext);
        filteredFiles = filteredFiles.concat(dirRes.map(f => join(dir, f)));
    }

    return filteredFiles;
}