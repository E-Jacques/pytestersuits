import { CoverageReport } from "./coverageReport";
import * as vscode from "vscode";
import * as coverageReportFunc from "./func";
import { accessSync, readdirSync, readFileSync } from "fs";
import { isExtension } from "../../func";
import { join, relative } from "path";
import { FileReport, LanguageInterface, LinesReport } from "../languageInterface";
import { getRootPath } from "../../vscodefunc";

type FullCoverageReport = {
    fileReport: FileReport,
    linesReport: LinesReport
};

export class CoverageReportProvider implements vscode.TreeDataProvider<CoverageReport> {

    private coverageReportList: FullCoverageReport[];
    private _onDidChangeTreeData: vscode.EventEmitter<CoverageReport | undefined | void> = new vscode.EventEmitter<CoverageReport | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<CoverageReport | undefined | void> = this._onDidChangeTreeData.event;

    constructor(private coveragePath: string, private languageInterface: LanguageInterface) {
        this.coverageReportList = [];
        this.buildCoverageReportList();
    }

    public reload() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: CoverageReport): vscode.TreeItem {
        return element;
    }

    getChildren(element?: CoverageReport): Thenable<CoverageReport[]> {
        try {
            accessSync(this.coveragePath);
        }
        catch {
            vscode.window.showErrorMessage("No coverage report folder found ...");
            return Promise.resolve([]);
        }

        if (element) {
            if (!element.isFileReport()) {
                return Promise.resolve([]);
            }

            let filename = element.filepath;
            let linesReport = this.getLinesReport(filename);
            if (linesReport === null) { return Promise.resolve([]); }

            let notTested = this.getNotTestedFiles(filename, linesReport);
            let notHandled = this.getNotHandledFiles(filename, linesReport);

            let res = notTested.concat(notHandled);
            return Promise.resolve(res);
        }

        let res = this.coverageReportList.map(r => r.fileReport).map(r => this.getFileReport(r));
        return Promise.resolve(res);
    }

    public buildCoverageReportList() {
        this.coverageReportList = [];
        let htmlFiles = readdirSync(this.coveragePath).filter(f => isExtension(join(this.coveragePath, f), "html")).filter(f => f !== "index.html");

        for (let file of htmlFiles) {
            let filepath = join(this.coveragePath, file);
            let data = readFileSync(filepath, "utf-8");

            let fileReport = this.languageInterface.extractFilesPercentages(data);
            let linesReport: LinesReport = this.languageInterface.extractLinesPercentages(data);
            this.coverageReportList.push({
                fileReport,
                linesReport
            });
        }
    }

    public actOnChange(filename: string, start: number, end: number) {
        const rootPath = getRootPath();
        if (rootPath === null) { return; }

        let relativeFilename = relative(rootPath, filename);
        let linesReport = this.getLinesReport(relativeFilename);
        if (linesReport === null) { return; }


        let newLinesReport = coverageReportFunc.moveLinesPercentages(linesReport, start, end);

        this.setNewLinesReport(filename, newLinesReport);
        this._onDidChangeTreeData.fire();
    }

    private getFileReport(coverageReport: FileReport): CoverageReport {
        let collapse = vscode.TreeItemCollapsibleState.Collapsed;
        if (coverageReport.percent === 100) { collapse = vscode.TreeItemCollapsibleState.None; }
        
        return new CoverageReport(coverageReport.filename, coverageReport.percent, null, collapse);
    }

    private getLinesReport(filename: string): LinesReport | null {
        let filtered = this.coverageReportList.filter(r => r.fileReport.filename === filename);

        if (filtered.length === 0) {
            return null;
        }

        return filtered[0].linesReport;
    }

    private setNewLinesReport(filename: string, newLinesReport: LinesReport) {
        let filtered = this.coverageReportList.filter(r => r.fileReport.filename === filename);

        if (filtered.length === 0) {
            return;
        }

        filtered[0].linesReport = newLinesReport;
    }

    private getNotTestedFiles(orignalFilename: string, coverageReport: LinesReport): CoverageReport[] {
        let res: CoverageReport[] = [];

        for (let line of coverageReport.notTested) {
            res.push(new CoverageReport(orignalFilename, line, "NT", vscode.TreeItemCollapsibleState.None));
        }

        return res;
    }

    private getNotHandledFiles(orignalFilename: string, coverageReport: LinesReport): CoverageReport[] {
        let res: CoverageReport[] = [];

        for (let line of coverageReport.notHandled) {
            res.push(new CoverageReport(orignalFilename, line, "NH", vscode.TreeItemCollapsibleState.None));
        }

        return res;
    }
}
