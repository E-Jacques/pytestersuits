import { appendFile } from "fs";

export class Test {
    private name: string;
    private file: string;
    private todo: boolean;

    constructor(name: string, file: string) {
        this.name = name;
        this.file = file;
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

    public appendTestToFile() {
        let testString = "";
        if (this.todo) { testString += "@pytest.mark.skip(reason=\"generated automaticly\")\n"; }
        testString += `def test_${this.name}:\n\tpass\n\n`;
        
        appendFile(this.file, testString, err => {
            if (err) { console.error(err); }
        });
    }
}