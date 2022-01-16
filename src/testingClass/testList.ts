import { LibraryInterface } from "../extension_func/libraryInterface";
import { Test } from "./test";

export class TestList {
    private testList: Test[];

    constructor(private file: string, private libraryInterface: LibraryInterface, private suiteName: string | null = null) {
        this.testList = [];
    }

    public getFile (): string {
        return this.file;
    }

    public setFile(file: string) {
        this.file = file;
    }

    public setSuite(suiteName: string) {
        this.suiteName = suiteName;
    }

    public addTest(name: string) {
        this.testList.push(new Test(name, this.file, this.libraryInterface, this.suiteName));
    }

    public addTestsToFile() {
        for (let test of this.testList) {
            test.appendTestToFile();
        }
    }

    public getLength(): number {
        return this.testList.length;
    }

    public extractTestsFromString(originalString: string, delimiter: string, formatFunction: (s: string) => string) {
        let stringList = originalString
            .split(delimiter)
            .map(s => s.trim())
            .map(formatFunction)
            .filter(s => s);

        for (let testString of stringList) {
            this.addTest(testString);
        }
    }

    /**
     * Don't use !
     * For test purposes only.
     */
    public getStringAt (idx: number): string {
        return this.testList[idx].toString();
    }

    public toString() {
        switch (this.testList.length) {
            case 0:
                return `No test to add to '${this.file}'` + (this.suiteName ? ` in '${this.suiteName}'.` : ".");
            case 1:
                return `Add '${this.testList[0]}' to '${this.file}'.`;
            default:
                const testStringList = this.testList.map(t => "'" + t.toString() + "'");
                let str = testStringList.filter((_, i) => i !== testStringList.length - 1).join(", ");
                str += " and " + testStringList[testStringList.length - 1];

                return `Add ${this.testList.length} tests (ie. ${str}) to '${this.file}'.`;
        }
    }
}