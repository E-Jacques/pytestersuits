import { accessSync, appendFile, mkdirSync, readFileSync, writeFileSync } from "fs";
import path = require("path");

export class Test {
    private todo: boolean;

    constructor(private name: string, private file: string) {
        this.todo = true;
    }

    public setFile(file: string) {
        this.file = file;
    }

    public getFile(): string {
        return this.file;
    }

    public setName(name: string) {
        this.name = name;
    }

    public fileContainsImport (): boolean {
        let data = readFileSync(this.file, "utf-8");        
        return data.includes("import pytest");
    }

    public importTestLibraryIfNeeded() {
        try {
            accessSync(this.file);
        } catch (err) {
            writeFileSync(this.file, "import pytest\n", "utf-8");
            return;
        }
        
        if (!this.fileContainsImport()) {
            let data = readFileSync(this.file, "utf-8");
            writeFileSync(this.file, "import pytest\n" + data, "utf-8");
        }
    }

    public appendTestToFile() {               
        mkdirSync(path.parse(this.file).dir, {
            recursive: true
        });
        this.importTestLibraryIfNeeded();
        
        let testString = "";
        if (this.todo) { testString += "\n@pytest.mark.skip(reason=\"generated automaticly\")\n"; }
        testString += `def test_${this.name}():\n\tpass\n`;

        appendFile(this.file, testString, err => {
            if (err) { console.error(err); }
        });
    }
}