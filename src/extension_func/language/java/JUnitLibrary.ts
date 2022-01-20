import { ChangeReport } from "../../../testingClass/test";
import { FileReport, LanguageInterface, LinesReport } from "../../languageInterface";
import { LibraryInterface } from "../../libraryInterface";
import { SuitTester } from "../../suiteTester";

type TestAddRegexGroup = {
    before: string,
    inside: string
};

export class JUnitLibrary implements LibraryInterface, SuitTester {
    importLibraries = [
        "import org.junit.jupiter.api.Test;\n"
    ];
    name = "JUnit";
    coverageReportUI = false;

    constructor(public parent: LanguageInterface) { }

    extractLinesPercentages(htmlData: string): LinesReport {
        return {
            tested: [],
            notHandled: [],
            notTested: []
        };
    }

    extractFilesPercentages(htmlData: string): FileReport {
        return {
            filename: '',
            percent: 100
        };
    }

    runCoverageReport(dirpath: string, cwd: string): void { }

    containsSuite(data: string, suiteName: string): boolean {
        const regex = new RegExp(`class ${suiteName} \\\{.*\\\}`, "s");

        return regex.test(data);
    }

    insertIntoSuite(data: string, testFormat: string, suiteName: string): string {
        const regex = new RegExp(`(?<before>.*)class ${suiteName} \\\{(?<inside>.*)\\\}`, "gsm");
        const linesBreakRegex = /\n|\r|\t| /;
        let { before, inside } = regex.exec(data)?.groups as TestAddRegexGroup;

        if (before.replace(linesBreakRegex, "") === "") { before = ""; }
        
        return before + `class ${suiteName} {${inside}${testFormat}
}`;
    }

    getTestFormat(testName: string, suiteName: string, data: string): ChangeReport {
        const testString = "\t@Test\n\tvoid " + testName + "() {\n" +
            "\t\t// TODO\n" +
            "\t}\n";

        let res = data;
        if (!this.containsSuite(data, suiteName)) {
            res += "class " + suiteName + " {\n\n}";
        }

        res = this.insertIntoSuite(res, testString, suiteName);

        return {
            content: res,
            encoding: "utf-8",
            appendToFile: false
        };
    }

    addTestToFile(rootPath: string): void {

    }

    getImportLibraries(): string[] {
        return this.importLibraries;
    }
}