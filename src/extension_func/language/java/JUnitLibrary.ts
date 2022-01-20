import * as path from "path";
import * as vscode from "vscode";
import { addExtensionToEnd, getFileWithExtension, stringToPascalCase } from "../../../func";
import { ChangeReport } from "../../../testingClass/test";
import { TestList } from "../../../testingClass/testList";
import { openDocumentToLine } from "../../../vscodefunc";
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
                        let PascalCaseValue = stringToPascalCase(quickPick.value);
                        let fileWithExt = addExtensionToEnd(PascalCaseValue, this.parent.testFileExtension);

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
        let testNameInputBox = vscode.window.showInputBox({ placeHolder: "Names of your tests (pass multiple tests by delimitating them with '" + delimiter + "')" });
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
        const suiteName = stringToPascalCase(testList.getFile());
        testList.setSuite(path.parse(suiteName).name);
        
        this.getTestName(testList);
    }

    private getFileName(testList: TestList, quickPickPromise: Promise<string>, compatibleFiles: string[], rootPath: string): void {
        quickPickPromise.then((value: string) => {
            if (!value) {
                testList.setFile("");
                return;
            } else {
                if (!compatibleFiles.includes(value)) {
                    value = stringToPascalCase(value);
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

    getImportLibraries(): string[] {
        return this.importLibraries;
    }
}