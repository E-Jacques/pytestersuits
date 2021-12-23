import { CoverageReport } from "./coverageReport";
import * as vscode from "vscode";
import * as coverageReportFunc from "./func";
import { accessSync, readdirSync, readFileSync } from "fs";
import { isExtension } from "../../func";
import { join, relative } from "path";

type FullCoverageReport = {
    fileReport: coverageReportFunc.FileReport,
    linesReport: coverageReportFunc.LinesReport
};

export class CoverageReportProvider implements vscode.TreeDataProvider<CoverageReport> {

    private coverageReportList: FullCoverageReport[];
    private _onDidChangeTreeData: vscode.EventEmitter<CoverageReport | undefined | void> = new vscode.EventEmitter<CoverageReport | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<CoverageReport | undefined | void> = this._onDidChangeTreeData.event;

    constructor(private coveragePath: string) {
        this.coverageReportList = [];
        this.buildCoverageReportList();
    }

    public reload () {
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

    public buildCoverageReportList () {
        this.coverageReportList = [];
        let htmlFiles = readdirSync(this.coveragePath).filter(f => isExtension(join(this.coveragePath, f), "html")).filter(f => f !== "index.html");

        for (let file of htmlFiles) {
            let filepath = join(this.coveragePath, file);
            let data = readFileSync(filepath, "utf-8");
            let originalFilenameMatch = data.match(/<title>(.*)<\/title>/);
            if (originalFilenameMatch === null) { throw new Error("Bad format for coverage report file."); }
            let originalFilename = originalFilenameMatch[1].replace(/\s+/g, '').split(":")[0].substring(11);

            let fileReport: coverageReportFunc.FileReport = {
                filename: originalFilename,
                percent: Number.parseInt(originalFilenameMatch[1].replace(/\s+/g, '').split(":")[1])
            };
            let linesReport: coverageReportFunc.LinesReport = coverageReportFunc.extractLinesPercentages(data);
            this.coverageReportList.push({
                fileReport,
                linesReport
            });
        }
    }

    public actOnChange(filename: string, start: number, end: number) {
        const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
            ? vscode.workspace.workspaceFolders[0].uri.fsPath : null;
        if (rootPath === null) { return; }
        
        let relativeFilename = relative(rootPath, filename);
        let linesReport = this.getLinesReport(relativeFilename);
        if (linesReport === null) { return; }


        let newLinesReport = coverageReportFunc.moveLinesPercentages(linesReport, start, end);
        console.log(newLinesReport);
        
        this.setNewLinesReport(filename, newLinesReport);
        this._onDidChangeTreeData.fire();        
    }

    private getFileReport(coverageReport: coverageReportFunc.FileReport): CoverageReport {
        return new CoverageReport(coverageReport.filename, coverageReport.percent, null, vscode.TreeItemCollapsibleState.Collapsed);
    }

    private getLinesReport(filename: string): coverageReportFunc.LinesReport | null {
        let filtered = this.coverageReportList.filter(r => r.fileReport.filename === filename);

        if (filtered.length === 0) {
            return null;
        }

        return filtered[0].linesReport;
    }

    private setNewLinesReport(filename: string, newLinesReport: coverageReportFunc.LinesReport) {
        let filtered = this.coverageReportList.filter(r => r.fileReport.filename === filename);

        if (filtered.length === 0) {
            return;
        }

        filtered[0].linesReport = newLinesReport;
    }

    private getNotTestedFiles(orignalFilename: string, coverageReport: coverageReportFunc.LinesReport): CoverageReport[] {
        let res: CoverageReport[] = [];

        for (let line of coverageReport.notTested) {
            res.push(new CoverageReport(orignalFilename, line, "NT", vscode.TreeItemCollapsibleState.None));
        }

        return res;
    }

    private getNotHandledFiles(orignalFilename: string, coverageReport: coverageReportFunc.LinesReport): CoverageReport[] {
        let res: CoverageReport[] = [];

        for (let line of coverageReport.notHandled) {
            res.push(new CoverageReport(orignalFilename, line, "NH", vscode.TreeItemCollapsibleState.None));
        }

        return res;
    }
}
