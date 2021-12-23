// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { join } from 'path';
import * as vscode from 'vscode';
import { addTestToFile } from './extension_func/addTestToFile';
import { CoverageReport } from './extension_func/coverageReport/coverageReport';
import { CoverageReportProvider } from './extension_func/coverageReport/provider';
import { handleTextDocumentChangeEvent, handleTextDocumentSaveEvent } from './extension_func/textDocumentChange';

// this method is called when your extension is activated
// your extension is activated the very first time the command is execute
export function activate(context: vscode.ExtensionContext) {

	vscode.commands.registerCommand('pytestersuits.addTestToFile', addTestToFile);
	const coverageReportProvider = new CoverageReportProvider(
		join((vscode.workspace.workspaceFolders || [{ uri: { path: "." } }])[0].uri.path, "htmlcov"));
	vscode.window.createTreeView("coverReport", {
		treeDataProvider: coverageReportProvider
	});
	vscode.commands.registerCommand("coverReport.goto", async (report: CoverageReport) => { await report.goto(); });
	vscode.workspace.onDidChangeTextDocument((ev) => handleTextDocumentChangeEvent(ev, coverageReportProvider));
	vscode.workspace.onDidSaveTextDocument((ev) => handleTextDocumentSaveEvent(ev, coverageReportProvider));
}

// this method is called when your extension is deactivated
export function deactivate() { }
