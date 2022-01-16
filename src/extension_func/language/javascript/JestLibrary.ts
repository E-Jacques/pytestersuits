import { ChangeReport } from "../../../testingClass/test";
import { SuitTester } from "../../suiteTester";
import { FileReport, LanguageInterface, LinesReport } from "../../languageInterface";
import { LibraryInterface } from "../../libraryInterface";
import { TestAddRegexGroup } from "../typescript/VSCTestLibrary";

export class JestLibrary implements LibraryInterface, SuitTester {
    public importLibraries = [];
    public name = "jest";
    public coverageReportUI = false;

    constructor(public parent: LanguageInterface) { }


    /**
     * @todo
     */
    public extractFilesPercentages(htmlData: string): FileReport {
        return {
            filename: "",
            percent: 0
        };
    }

    /**
     * @todo
     */
    public extractLinesPercentages(htmlData: string): LinesReport {
        return {
            notHandled: [],
            notTested: [],
            tested: []
        };
    }

    /**
     * @todo
     */
    public runCoverageReport(dirpath: string, cwd: string): void {
        
    }

    public getTestFormat(testName: string, suiteName: string, data: string): ChangeReport {
        const testString = `\n\ttest.todo(\"${testName}\");\n`;
        let res = data;

        if (!this.containsSuite(data, suiteName)) {
            res += `\ndescribe("${suiteName}", () => {\n});`;
        }

        res = this.insertIntoSuite(res, testString, suiteName);

        return {
            content: res,
            encoding: "utf-8",
            appendToFile: false
        };
    }

    public addTestToFile(rootPath: string): void {
        
    }

    public getImportLibraries(): string[] {
        return this.importLibraries;
    }

    public containsSuite(data: string, suiteName: string): boolean {
        let regex = new RegExp(`describe\\\(\\\"${suiteName}\\\",.*}\\\);*`, "s");
        return regex.test(data);
    }

    public insertIntoSuite(data: string, testFormat: string, suiteName: string): string {
        const regex = new RegExp(`(?<before>.*)describe\\\(\\\"${suiteName}\\\",(?<inside>.*)}\\\);*(?<after>.*)`, "gsm");
        const linesBreakRegex = /\n|\r|\t| /;
        let { before, inside, after } = regex.exec(data)?.groups as TestAddRegexGroup;

        if (before.replace(linesBreakRegex, "") === "") { before = ""; }
        if (after.replace(linesBreakRegex, "") === "") { after = ""; }

        return before + `describe(\"${suiteName}\",${inside}${testFormat}
});` + after;
    }
}