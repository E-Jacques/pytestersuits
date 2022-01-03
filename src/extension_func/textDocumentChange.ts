import { execSync } from "child_process";
import { basename, dirname } from "path";
import { TextDocument, TextDocumentChangeEvent, workspace } from "vscode";
import { getRootPath } from "../vscodefunc";
import { CoverageReportProvider } from "./coverageReport/provider";

export function handleTextDocumentChangeEvent(ev: TextDocumentChangeEvent, coverageReportTree: CoverageReportProvider) {
    let textDocument = ev.document;
    ev.contentChanges.forEach(change => {
        let { start, end } = change.range;
        let startLine = start.line;
        let endLine = end.line;
        
        if (change.text.match(/\r\n|\r|\n/)) {
            endLine++;
        }

        coverageReportTree.actOnChange(textDocument.uri.fsPath, startLine, endLine);
    });
}

export function handleTextDocumentSaveEvent(textDocument: TextDocument, coverageReportTree: CoverageReportProvider) {
    let dirpath = dirname(textDocument.uri.path);
    const rootPath = getRootPath();
    if (rootPath === null) {
        return;
    }
     
    execSync("pytest --cov-report html --cov=" + dirpath, {
        cwd: rootPath
    });

    coverageReportTree.buildCoverageReportList();
    coverageReportTree.reload();
}