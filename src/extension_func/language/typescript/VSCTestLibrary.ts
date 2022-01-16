import { execSync } from "child_process";
import { ChangeReport, Test } from "../../../testingClass/test";
import { FileReport, LanguageInterface, LinesReport } from "../../languageInterface";
import { LibraryInterface } from "../../libraryInterface";
import { SuitTester } from "../../suiteTester";
import TypescriptHandler from "./TypescriptHandler";
import * as vscode from "vscode";
import * as path from "path";
import { addExtensionToEnd, getFileWithExtension } from "../../../func";
import { openDocumentToLine } from "../../../vscodefunc";
import { TestList } from "../../../testingClass/testList";

export type TestAddRegexGroup = {
    before: string,
    inside: string,
    after: string
};

export class VSCTestLibrary implements LibraryInterface, SuitTester {
    public name = "Vscode Extension Test suit";
    public coverageReportUI = false;
    public importLibraries = [
        "import * as assert from \"assert\";",
        "import * as assert from 'assert';",
        "import * as assert from 'assert'",
        "import * as assert from \"assert\""
    ];

    constructor(public parent: TypescriptHandler) { };

    public getImportLibraries(): string[] {
        return this.importLibraries;
    }

    /**
     * @todo
     */
    extractFilesPercentages(htmlData: string): FileReport {
        return {
            filename: "",
            percent: 0,
        };
    }

    /**
     * @todo
     */
    extractLinesPercentages(htmlData: string): LinesReport {
        return {
            tested: [],
            notHandled: [],
            notTested: []
        };
    }

    runCoverageReport(dirpath: string, cwd: string): void {
        execSync("nyc --reporter=html mocha " + dirpath, {
            cwd
        });
    }

    insertIntoSuite(data: string, testFormat: string, suiteName: string) {
        const regex = new RegExp(`(?<before>.*)suite\\\(\\\"${suiteName}\\\",(?<inside>.*)}\\\);*(?<after>.*)`, "gsm");
        const { before, inside, after } = regex.exec(data)?.groups as TestAddRegexGroup;

        return before + `suite(\"${suiteName}\",${inside}${testFormat}
});` + after;
    }

    containsSuite(data: string, suiteName: string): boolean {
        let regex = new RegExp(`suite\\\(\\\"${suiteName}\\\",.*}\\\);*`, "s");
        return regex.test(data);
    }

    getTestFormat(testName: string, suiteName: string, data: string): ChangeReport {
        const testString = `\n\ttest.todo(\"${testName}\", () => {\n\t\t// TODO\n\t});\n`;
        let res = data;

        if (!this.containsSuite(data, suiteName)) {
            res += `\nsuite("${suiteName}", () => {\n});`;
        }

        res = this.insertIntoSuite(res, testString, suiteName);

        return {
            content: res,
            encoding: "utf-8",
            appendToFile: false
        };
    }

    private buildQuickPickPromise(compatibleFiles: string[]): Promise<string> {
        return new Promise<string>(resolve => {
            const quickPick = vscode.window.createQuickPick();
            quickPick.items = compatibleFiles.map(s => ({ label: s }));
            quickPick.title = "Choose a file";

            quickPick.onDidChangeValue(() => {
                if (!compatibleFiles.includes(quickPick.value)) {
                    if (quickPick.value === "") {
                        quickPick.items = compatibleFiles.map(s => ({ label: s, detail: s + " file" }));
                    } else {
                        let camelCaseValue = this.parent.normalizeStringToConvention(quickPick.value);
                        let fileWithExt = addExtensionToEnd(camelCaseValue, this.parent.testFileExtension);

                        quickPick.items = [{
                            label: quickPick.value,
                            detail: `Create file '${fileWithExt}'`
                        }, ...compatibleFiles.map(s => ({ label: s, details: s + " file" }))];
                    }
                }
            });

            quickPick.onDidAccept(() => {
                let { label } = quickPick.activeItems[0];

                if (path.parse(label).ext !== this.parent.testFileExtension) {
                    let labelName = path.parse(label).name;
                    label = path.join(path.parse(label).dir, addExtensionToEnd(labelName, this.parent.testFileExtension));
                }
                resolve(label);
                quickPick.hide();
            });

            quickPick.show();
        });
    }

    private getTestName(testList: TestList): void {
        const delimiter = vscode.workspace.getConfiguration("pytestersuits").get<string>("separator") || ";";
        let testNameInputBox = vscode.window.showInputBox({ placeHolder: "Names of your tests (pass multiple tests by delimitating them with '"+ delimiter +"')" });
        testNameInputBox.then(testName => {
            if (!testName) {
                vscode.window.showErrorMessage("You need to provide a test name.");
                return;
            }

            testList.extractTestsFromString(testName, delimiter, (s: string) => s);
            testList.addTestsToFile();
            openDocumentToLine(testList.getFile(), -1);

            vscode.window.showInformationMessage("Test have been successfully added to " + testList.getFile());
        });
    }

    private getSuiteName(testList: TestList): void {
        let testNameInputBox = vscode.window.showInputBox({ placeHolder: "Name of the suite in which you want to put your test" });
        testNameInputBox.then(suiteName => {
            if (!suiteName) {
                vscode.window.showErrorMessage("You need to provide a suite name.");
                return;
            }
            testList.setSuite(suiteName);
            this.getTestName(testList);
        });
    }

    private getFileName(testList: TestList, quickPickPromise: Promise<string>, compatibleFiles: string[], rootPath: string): void {
        quickPickPromise.then((value: string) => {
            if (!value) {
                testList.setFile("");
                return;
            } else {
                if (!compatibleFiles.includes(value)) {
                    value = this.parent.normalizeStringToConvention(value);
                }

                testList.setFile(path.join(rootPath, value));
            }

            this.getSuiteName(testList);
        });
    }

    addTestToFile(rootPath: string): void {
        let test = new TestList("", this);
        let compatibleFiles = getFileWithExtension(rootPath, this.parent.testFileExtension);
        let quickPickPromise = this.buildQuickPickPromise(compatibleFiles);

        this.getFileName(test, quickPickPromise, compatibleFiles, rootPath);
    }
}