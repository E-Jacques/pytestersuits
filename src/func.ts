import { accessSync, lstatSync, readdirSync, Stats } from "fs";
import { join } from "path";

export function getLineCount(textToEvaluate: string): number {
    return textToEvaluate.split(/\r\n|\r|\n/).length;
}

export function isDirectory(filepath: string): boolean {
    let fileStats: Stats;

    try {
        fileStats = lstatSync(filepath);
    } catch (error) {
        return false;
    }

    // console.log(`${filepath}: ${fileStats.isDirectory()}`);
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