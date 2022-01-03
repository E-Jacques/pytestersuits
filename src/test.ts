import { accessSync, appendFile, mkdirSync, readFileSync, writeFileSync } from "fs";
import path = require("path");
import { LanguageInterface } from "./extension_func/languageInterface";

export class Test {
    constructor(private name: string, private file: string, private languageInterface: LanguageInterface) {}

    public setFile(file: string) {
        this.file = file;
    }

    public getFile(): string {
        return this.file;
    }

    public setName(name: string) {
        this.name = name;
    }

    public fileContainsImport(): boolean {
        let data = readFileSync(this.file, "utf-8");
        return data.includes(this.languageInterface.importLibraries);
    }

    private getImport () {
        return this.languageInterface.importLibraries + "\n";
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

    public appendTestToFile() {
        mkdirSync(path.parse(this.file).dir, {
            recursive: true
        });
        this.importTestLibraryIfNeeded();

        let testString = this.languageInterface.getTestFormat(this.name);

        appendFile(this.file, testString, err => {
            if (err) { console.error(err); }
        });
    }
}