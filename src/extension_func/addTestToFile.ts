import * as path from "path";
import *  as vscode from "vscode";

import * as func from '../func';
import { Test } from '../test';
import { openDocumentToLine } from '../vscodefunc';
import { LanguageInterface } from "./languageInterface";

export function addTestToFile(rootPath: string | null, languageInterface: LanguageInterface) {
    if (!rootPath) {
        vscode.window.showErrorMessage("Can't find root path.");
        return;
    }

    let compatibleFiles = func.getFileWithExtension(rootPath, languageInterface.testFileExtension);
    let test = new Test("", "", languageInterface);
    let quickPickPromise = new Promise<string>(resolve => {
        const quickPick = vscode.window.createQuickPick();
        quickPick.items = compatibleFiles.map(s => ({ label: s }));
        quickPick.title = "Choose a file";

        quickPick.onDidChangeValue(() => {
            if (!compatibleFiles.includes(quickPick.value)) {
                if (quickPick.value === "") {
                    quickPick.items = compatibleFiles.map(s => ({ label: s, detail: s + " file" }));
                } else {
                    let camelCaseValue = languageInterface.normalizeStringToConvention(quickPick.value);
                    let fileWithExt = func.addExtensionToEnd(camelCaseValue, languageInterface.testFileExtension);
                    
                    quickPick.items = [{
                        label: quickPick.value,
                        detail: `Create file '${fileWithExt}'`
                    }, ...compatibleFiles.map(s => ({ label: s, details: s + " file" }))];
                }
            }
        });

        quickPick.onDidAccept(() => {
            let { label } = quickPick.activeItems[0];
            
            if (path.parse(label).ext !== languageInterface.testFileExtension) {
                let labelName = path.parse(label).name;
                label = path.join(path.parse(label).dir, func.addExtensionToEnd(labelName, languageInterface.testFileExtension));
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
                value = languageInterface.normalizeStringToConvention(value);
            }

            test.setFile(path.join(rootPath, value));
        }

        let testNameInputBox = vscode.window.showInputBox({ placeHolder: "Name of your test" });
        testNameInputBox.then(value => {
            if (!value) {
                value = "";
            }

            return languageInterface.normalizeStringToConvention(value);
        }).then(normalizedStringValue => {
            test.setName(normalizedStringValue);
            test.appendTestToFile();
            openDocumentToLine(test.getFile(), -1);

            vscode.window.showInformationMessage("Test have been successfully added to " + test.getFile());
        });
    });
}