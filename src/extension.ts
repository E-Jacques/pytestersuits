// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { join } from 'path';
import * as vscode from 'vscode';
import { addTestToFile } from './extension_func/addTestToFile';
import { CoverageReportProvider } from './extension_func/coverageReport/provider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is execute
export function activate(context: vscode.ExtensionContext) {

	let addTestToFileDisposable = vscode.commands.registerCommand('pytestersuits.addTestToFile', addTestToFile);
	let coverageReportDisposable = vscode.window.createTreeView("coverReport", {
		treeDataProvider: new CoverageReportProvider(
			join((vscode.workspace.workspaceFolders || [{ uri: { path: "." } }])[0].uri.path, "htmlcov"))
	});


	context.subscriptions.push(addTestToFileDisposable, coverageReportDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
