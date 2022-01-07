import { execSync } from "child_process";
import * as path from "path";
import * as vscode from "vscode";
import { addExtensionToEnd, convertStringToCamelCase, getFileWithExtension } from "../../func";
import { Test } from "../../test";
import { openDocumentToLine } from "../../vscodefunc";
import { FileReport, LanguageInterface, LinesReport } from "../languageInterface";

export class JavascriptHandler implements LanguageInterface {
    fileExtension = "js";
    testFileExtension = "test.js";
    importLibraries = "import * as assert from 'assert';";

    public normalizeStringToConvention(s: string): string {
        return convertStringToCamelCase(s);
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

    getTestFormat(testName: string, suiteName: string): string {
        return `\ntest.todo('${testName}', () => {\n\t// write test here\n});\n`;
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
                        let camelCaseValue = this.normalizeStringToConvention(quickPick.value);
                        let fileWithExt = addExtensionToEnd(camelCaseValue, this.testFileExtension);

                        quickPick.items = [{
                            label: quickPick.value,
                            detail: `Create file '${fileWithExt}'`
                        }, ...compatibleFiles.map(s => ({ label: s, details: s + " file" }))];
                    }
                }
            });

            quickPick.onDidAccept(() => {
                let { label } = quickPick.activeItems[0];

                if (path.parse(label).ext !== this.testFileExtension) {
                    let labelName = path.parse(label).name;
                    label = path.join(path.parse(label).dir, addExtensionToEnd(labelName, this.testFileExtension));
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
                    value = this.normalizeStringToConvention(value);
                }

                test.setFile(path.join(rootPath, value));
            }

            this.getSuiteName(test);
        });
    }

    addTestToFile(rootPath: string): void {
        let test = new Test("", "", this);
        let compatibleFiles = getFileWithExtension(rootPath, this.testFileExtension);
        let quickPickPromise = this.buildQuickPickPromise(compatibleFiles);

        quickPickPromise.then((value: string) => {
            if (!value) {
                test.setFile("");
                return;
            } else {
                if (!compatibleFiles.includes(value)) {
                    value = this.normalizeStringToConvention(value);
                }

                test.setFile(path.join(rootPath, value));
            }

            let testNameInputBox = vscode.window.showInputBox({ placeHolder: "Name of your test" });
            testNameInputBox.then(value => {
                if (!value) {
                    value = "";
                }

                return this.normalizeStringToConvention(value);
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