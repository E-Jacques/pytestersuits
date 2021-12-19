import *  as vscode from "vscode";

import * as func from '../func';
import { Test } from '../test';
import { openDocumentToLine } from '../vscodefunc';

export function addTestToFile () {
    let pyFilesInDir = func.getFileWithExtension(".", "py");
    let test = new Test("", "");
    let fileNameInputBox = vscode.window.showQuickPick(pyFilesInDir);

    fileNameInputBox.then(value => {
        if (!value) {
            test.setFile("");
            vscode.window.showErrorMessage("You need to select a file to continue !");
            throw new Error("Need to select a file");
        } else {
            test.setFile(value);
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