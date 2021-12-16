import { accessSync, lstatSync, readdirSync, Stats } from "fs";
import { join } from "path";

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

export function camelCaseToPythonString (toTransform: string): string {
    const uppercase = "AZERTYUIOPQSDFGHJKLMWXCVBN";
    let res = "";

    for (let c of toTransform) {
        if (uppercase.includes(c)) {
            res += "_" + c.toLowerCase();
        } else {
            res += c;
        }
    }

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