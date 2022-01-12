import { execSync } from "child_process";
import parse from "node-html-parser";
import { addExtensionToEnd, getFileWithExtension } from "../../../func";
import { ChangeReport, Test } from "../../../test";
import { FileReport, LinesReport } from "../../languageInterface";
import { LibraryInterface } from "../../libraryInterface";
import PythonHandler from "./PythonHandler";
import * as vscode from "vscode";
import { openDocumentToLine } from "../../../vscodefunc";
import * as path from "path";

export class Pytest implements LibraryInterface {
    public importLibraries = "import pytest";
    public name = "pytest";

    constructor(public parent: PythonHandler) {}

    public runCoverageReport(dirpath: string, cwd: string): void {
        execSync("pytest --cov-report html --cov=" + dirpath, {
            cwd
        });
    }

    public getImportLibraries(): string[] {
        return [this.importLibraries];
    }

    public extractFilesPercentages(htmlData: string): FileReport {
        let originalFilenameMatch = htmlData.match(/<title>(.*)<\/title>/);
        if (originalFilenameMatch === null) { throw new Error("Bad format for coverage report file."); }
        let originalFilename = originalFilenameMatch[1].replace(/\s+/g, '').split(":")[0].substring(11);

        return {
            filename: originalFilename,
            percent: Number.parseInt(originalFilenameMatch[1].replace(/\s+/g, '').split(":")[1])
        };
    }

    public extractLinesPercentages(htmlData: string): LinesReport {
        let linesReport: LinesReport = {
            tested: [],
            notTested: [],
            notHandled: []
        };

        let html = parse(htmlData);
        let testedDOM = html.querySelectorAll("p.run");
        let notTestedDOM = html.querySelectorAll("p.mis");

        for (let t of testedDOM) {
            let lineDOM = t.querySelector("span.n");
            if (lineDOM === null) { continue; }
            linesReport.tested.push(Number.parseInt(lineDOM.innerText));
        }

        for (let nt of notTestedDOM) {
            let lineDOM = nt.querySelector("span.n");
            if (lineDOM === null) { continue; }
            linesReport.notTested.push(Number.parseInt(lineDOM.innerText));
        }

        return linesReport;
    }

    public getTestFormat(testName: string, _suiteName: string, _data: string): ChangeReport {
        let testString = "";
        testString += "\n@pytest.mark.skip(reason=\"generated automaticly\")\n";
        testString += `def test_${testName}():\n\tpass\n`;
        return { content: testString, encoding: "utf-8", appendToFile: true };
    }

    public addTestToFile(rootPath: string): void {
        let compatibleFiles = getFileWithExtension(rootPath, this.parent.testFileExtension);
        let test = new Test("", "", this);
        let quickPickPromise = new Promise<string>(resolve => {
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
    }
}