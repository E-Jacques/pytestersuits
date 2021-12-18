import { readFileSync } from "fs";
import * as vscode from "vscode";
import { getLineCount } from "./func";

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