import { dirname, parse } from "path";
import { TextDocument, TextDocumentChangeEvent } from "vscode";
import { getRootPath } from "../vscodefunc";
import { CoverageReportProvider } from "./coverageReport/provider";
import { getLanguageFromExt } from "../FileExtensionHashtable";

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
    const ext = parse(textDocument.uri.path).ext;
    const languageInterface = getLanguageFromExt(ext);
    const rootPath = getRootPath();
    if (rootPath === null) {
        return;
    }
    
    let libraryInterface = languageInterface.getDefaultTestingLibrary();
    if (!libraryInterface) { return; }
    libraryInterface.runCoverageReport(dirpath, rootPath);

    coverageReportTree.buildCoverageReportList();
    coverageReportTree.reload();
}