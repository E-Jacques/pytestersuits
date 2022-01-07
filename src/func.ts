import { accessSync, lstatSync, readdirSync, Stats } from "fs";
import { join } from "path";

export function getLineCount(textToEvaluate: string): number {
    return textToEvaluate.split(/\r\n|\r|\n/).length;
}

export function getMaxIndex (arr: number[]): number {
    if (arr.length === 0) { throw new Error("Can't get maximum value of an empty array."); }
    let maxIndex = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[maxIndex] < arr[i]) {
            maxIndex = i;
        }
    }

    return maxIndex;
}

export function getMostFrequent(arr: string[]): string | null {
    if (arr.length === 0) { return null; }
    let counts: number[] = [];
    let keys: string[] = [];

    for (let s of arr) {
        if (!keys.includes(s)) {
            counts.push(1);
            keys.push(s);
            continue;
        }

        let idx = keys.indexOf(s);
        counts[idx]++;
    }

    let idx = getMaxIndex(counts);
    return keys[idx];
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

export function convertStringToCamelCase(toConvert: string): string {
    const forbidChars = [" ", "_"];
    let correctToConvert = toConvert[0].toLowerCase() + toConvert.substring(1);
    let res = "";
    for (let i = 0; i < correctToConvert.length; i++) {
        let c = correctToConvert[i];
        if (!forbidChars.includes(c)) {
            if (i > 0 && forbidChars.includes(correctToConvert[i-1])) {
                res += c.toUpperCase();
            } else {
                res += c;
            }
        }
    }
    return res;
}

export function getAllFiles (dirToScan: string): string[] {
    try {
        accessSync(dirToScan);
    } catch (error) {
        return [];
    }

    let files = readdirSync(dirToScan);
    let dirs = files.filter(f => isDirectory(f));
    for (let dir of dirs) {
        files.concat(getAllFiles(dir));
    }
    
    return files;
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