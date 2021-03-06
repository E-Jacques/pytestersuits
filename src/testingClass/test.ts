import { accessSync, appendFileSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import * as path from "path";
import { CustomImportFunction, isCustomImportFunctionImplementation } from "../extension_func/customImportFunc";
import { LibraryInterface } from "../extension_func/libraryInterface";

export type ChangeReport = {
    content: string
    encoding: "utf8" | "utf-8",
    appendToFile: boolean
};

export class Test {
    constructor(private name: string, private file: string, private libraryInterface: LibraryInterface, private suiteName: string | null = null) { }

    public setFile(file: string) {
        this.file = file;
    }

    public setSuite(suiteName: string) {
        this.suiteName = suiteName;
    }

    public getFile(): string {
        return this.file;
    }

    public setName(name: string) {
        this.name = name;
    }

    public fileContainsImport(): boolean {
        let data = readFileSync(this.file, "utf-8");

        for (let importLibraries of this.libraryInterface.getImportLibraries()) {
            if (data.includes(importLibraries as string)) {
                return true;
            }
        }
        return false;
    }

    public toString() {
        if (this.suiteName) {
            return `${this.name} [${this.suiteName}]`;
        }

        return this.name;
    }

    private getImport(): string | null {
        if (this.libraryInterface.getImportLibraries().length === 0) { return null; }
        return this.libraryInterface.getImportLibraries()[0] + "\n";
    }

    public importTestLibraryIfNeeded() {
        try {
            accessSync(this.file);
        } catch (err) {
            writeFileSync(this.file, this.getImport() || "", "utf-8");
            return;
        }

        if (!this.fileContainsImport() && this.libraryInterface.importLibraries.length > 0) {
            let data = readFileSync(this.file, "utf-8");

            if (isCustomImportFunctionImplementation(this.libraryInterface)) {
                (this.libraryInterface as any).importTestLibrary(this.file, data, "utf-8");
            } else {
                writeFileSync(this.file, this.getImport() + data, "utf-8");
            }
        }
    }

    public appendFile(changeReport: ChangeReport): void {
        if (changeReport.appendToFile) {
            appendFileSync(this.file, changeReport.content, { encoding: changeReport.encoding });
        } else {
            writeFileSync(this.file, changeReport.content, { encoding: changeReport.encoding });
        }
    }

    public appendTestToFile(): void {
        mkdirSync(path.parse(this.file).dir, {
            recursive: true
        });
        this.importTestLibraryIfNeeded();

        let data = readFileSync(this.file, "utf-8");
        let changeReport = this.libraryInterface.getTestFormat(this.name, this.suiteName || "", data);
        this.appendFile(changeReport);
    }
}