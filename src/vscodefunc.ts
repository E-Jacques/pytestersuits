import { readFileSync } from "fs";
import { parse } from "path";
import * as vscode from "vscode";
import { LanguageInterface } from "./extension_func/languageInterface";
import FileExtensionHashtable from "./FileExtensionHashtable";
import { getAllFiles, getLineCount, getMostFrequent } from "./func";

export function openDocumentToLine(filepath: string, line: number) {
    let fileUri = vscode.Uri.file(filepath);

    if (line < 0) {
        let data = readFileSync(filepath, { encoding: "utf-8" });
        let lineCount = getLineCount(data);
        line = lineCount + 1 - Math.abs(line);
    }

    vscode.workspace.openTextDocument(fileUri)
        .then(doc => {
            vscode.window.showTextDocument(doc)
                .then(editor => {
                    let pos = new vscode.Position(line, 1);
                    editor.selections = [new vscode.Selection(pos, pos)];

                    let range = new vscode.Range(pos, pos);
                    editor.revealRange(range);
                });
        });
}

export function getCurrentCodeLanguage(): LanguageInterface {
    let filename = vscode.window.activeTextEditor?.document.fileName;
    let ext;
    if (!filename) {
        const rootPath = getRootPath();
        if (rootPath === null) {
            throw new Error("Can't find root path.");
        }

        let files: string[] = getAllFiles(rootPath);
        ext = getMostFrequent(files.map(f => parse(f).ext)) || "";
    } else {
        ext = parse(filename).ext;
    }

    if (!Object.keys(FileExtensionHashtable).includes(ext)) {
        throw new Error("Unknown Extension for FileExtensionHashtable.");
    }

    return FileExtensionHashtable[ext];
}

export function getRootPath(): string | null {
    return (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
        ? vscode.workspace.workspaceFolders[0].uri.fsPath : null;
}