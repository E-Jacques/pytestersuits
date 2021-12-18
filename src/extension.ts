// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as func from './func';
import { Test } from './test';
import { openDocumentToLine } from './vscodefunc';

// this method is called when your extension is activated
// your extension is activated the very first time the command is execute
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pytestersuits" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('pytestersuits.addTestToFile', () => {
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
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
