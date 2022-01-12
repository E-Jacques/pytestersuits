import { execSync } from "child_process";
import { ChangeReport, Test } from "../../../test";
import { FileReport, LanguageInterface, LinesReport } from "../../languageInterface";
import { LibraryInterface } from "../../libraryInterface";
import { SuiteTester } from "../../suiteTester";
import TypescriptHandler from "./TypescriptHandler";
import * as vscode from "vscode";
import * as path from "path";
import { addExtensionToEnd, getFileWithExtension } from "../../../func";
import { openDocumentToLine } from "../../../vscodefunc";

type TestAddRegexGroup = {
    before: string,
    inside: string,
    after: string
};

export class VSCTestLibrary implements LibraryInterface, SuiteTester {
    public name = "VsCode Extension Test suite";
    public importLibraries = [
        "import * as assert from \"assert\";",
        "import * as assert from 'assert';",
        "import * as assert from 'assert'",
        "import * as assert from \"assert\""
    ];

    constructor (public parent: TypescriptHandler) {};

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

    private getTestName(test: Test): void {
        let testNameInputBox = vscode.window.showInputBox({ placeHolder: "Name of your test" });
        testNameInputBox.then(testName => {
            if (!testName) {
                vscode.window.showErrorMessage("You need to provide a suite name.");
                return;
            }
            test.setName(testName);
            test.appendTestToFile();
            openDocumentToLine(test.getFile(), -1);

            vscode.window.showInformationMessage("Test have been successfully added to " + test.getFile());
        });
    }

    private getSuiteName(test: Test): void {
        let testNameInputBox = vscode.window.showInputBox({ placeHolder: "Name of the suite in which you want to put your test" });
        testNameInputBox.then(suiteName => {
            if (!suiteName) {
                vscode.window.showErrorMessage("You need to provide a suite name.");
                return;
            }
            test.setSuite(suiteName);
            this.getTestName(test);
        });
    }

    private getFileName(test: Test, quickPickPromise: Promise<string>, compatibleFiles: string[], rootPath: string): void {
        quickPickPromise.then((value: string) => {
            if (!value) {
                test.setFile("");
                return;
            } else {
                if (!compatibleFiles.includes(value)) {
                    value = this.parent.normalizeStringToConvention(value);
                }

                test.setFile(path.join(rootPath, value));
            }

            this.getSuiteName(test);
        });
    }

    addTestToFile(rootPath: string): void {
        let test = new Test("", "", this);
        let compatibleFiles = getFileWithExtension(rootPath, this.parent.testFileExtension);
        let quickPickPromise = this.buildQuickPickPromise(compatibleFiles);

        quickPickPromise.then((value: string) => {
            if (!value) {
                test.setFile("");
                return;
            } else {
                if (!compatibleFiles.includes(value)) {
                    value = this.parent.normalizeStringToConvention(value);
                }

                test.setFile(path.join(rootPath, value));
            }

            let testNameInputBox = vscode.window.showInputBox({ placeHolder: "Name of your test" });
            testNameInputBox.then(value => {
                if (!value) {
                    value = "";
                }

                return this.parent.normalizeStringToConvention(value);
            }).then(normalizedStringValue => {
                test.setName(normalizedStringValue);
                test.appendTestToFile();
                openDocumentToLine(test.getFile(), -1);

                vscode.window.showInformationMessage("Test have been successfully added to " + test.getFile());
            });
        });
        this.getFileName(test, quickPickPromise, compatibleFiles, rootPath);
    }
}