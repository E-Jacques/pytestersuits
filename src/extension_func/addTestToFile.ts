import * as path from "path";
import *  as vscode from "vscode";

import * as func from '../func';
import { Test } from '../test';
import { openDocumentToLine } from '../vscodefunc';

export function addTestToFile(rootPath: string | null) {
    if (!rootPath) {
        vscode.window.showErrorMessage("Can't find root path.");
        return;
    }

    let pyFilesInDir = func.getFileWithExtension(rootPath, "py");
    let test = new Test("", "");
    let quickPickPromise = new Promise<string>(resolve => {
        const quickPick = vscode.window.createQuickPick();
        quickPick.items = pyFilesInDir.map(s => ({ label: s }));
        quickPick.title = "Choose a file";

        quickPick.onDidChangeValue(() => {
            if (!pyFilesInDir.includes(quickPick.value)) {
                if (quickPick.value === "") {
                    quickPick.items = pyFilesInDir.map(s => ({ label: s, detail: s + " file" }));
                } else {
                    quickPick.items = [{
                        label: quickPick.value,
                        detail: `Create file '${func.camelCaseToPythonString(quickPick.value)}.py'`
                    }, ...pyFilesInDir.map(s => ({ label: s, details: s + " file" }))];
                }
            }
        });

        quickPick.onDidAccept(() => {
            let { label } = quickPick.activeItems[0];
            
            if (path.parse(label).ext !== "py") {
                label = path.join(path.parse(label).dir, path.parse(label).name + ".py");
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
            if (!pyFilesInDir.includes(value)) {                              
                value = func.camelCaseToPythonString(value);
            }

            test.setFile(path.join(rootPath, value));
        }

        let testNameInputBox = vscode.window.showInputBox({ placeHolder: "Name of your test" });
        testNameInputBox.then(value => {
            if (!value) {
                value = "";
            }

            return func.camelCaseToPythonString(value);
        }).then(pythonStringValue => {
            test.setName(pythonStringValue);
            test.appendTestToFile();
            openDocumentToLine(test.getFile(), -1);

            vscode.window.showInformationMessage("Test have been successfully added to " + test.getFile());
        });
    });
}