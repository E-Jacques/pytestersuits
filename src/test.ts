import { accessSync, appendFileSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path = require("path");
import { LanguageInterface } from "./extension_func/languageInterface";

export type ChangeReport = {
    content: string
    encoding: "utf8" | "utf-8",
    appendToFile: boolean
};

export class Test {
    constructor(private name: string, private file: string, private languageInterface: LanguageInterface, private suiteName: string | null = null) {}

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

        for (let importLibraries of this.languageInterface.getImportLibraries()) {
            if (data.includes(importLibraries)) {
                return true;
            }
        }
        return false;
    }

    private getImport () {
        return this.languageInterface.getImportLibraries()[0] + "\n";
    }

    public importTestLibraryIfNeeded() {
        try {
            accessSync(this.file);
        } catch (err) {
            writeFileSync(this.file, this.getImport(), "utf-8");
            return;
        }

        if (!this.fileContainsImport()) {
            let data = readFileSync(this.file, "utf-8");
            writeFileSync(this.file, this.getImport() + data, "utf-8");
        }
    }

    public appendFile (changeReport: ChangeReport): void {
        if (changeReport.appendToFile) {
            appendFileSync(this.file, changeReport.content, {encoding: changeReport.encoding});
        } else {
            writeFileSync(this.file, changeReport.content, {encoding: changeReport.encoding});
        }
    }

    public appendTestToFile(): void {
        mkdirSync(path.parse(this.file).dir, {
            recursive: true
        });
        this.importTestLibraryIfNeeded();

        let data = readFileSync(this.file, "utf-8");
        let changeReport = this.languageInterface.getTestFormat(this.name, this.suiteName || "", data);
        this.appendFile(changeReport);        
    }
}