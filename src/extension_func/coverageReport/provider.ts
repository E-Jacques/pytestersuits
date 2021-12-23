import { CoverageReport } from "./coverageReport";
import * as vscode from "vscode";
import * as coverageReportFunc from "./func";
import { accessSync, readdirSync, readFileSync } from "fs";
import { isExtension } from "../../func";
import { join } from "path";

export class CoverageReportProvider implements vscode.TreeDataProvider<CoverageReport> {

    constructor(private coveragePath: string) { }

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
            return Promise.resolve([]);
        }

        let coverageReportList: CoverageReport[] = [];
        let htmlFiles = readdirSync(this.coveragePath).filter(f => isExtension(join(this.coveragePath, f), "html")).filter(f => f !== "index.html");

        for (let file of htmlFiles) {
            let filepath = join(this.coveragePath, file);
            let data = readFileSync(filepath, "utf-8");
            let originalFilenameMatch = data.match(/<title>(.*)<\/title>/);
            if (originalFilenameMatch === null) { throw new Error("Bad format for coverage report file."); }
            let originalFilename = originalFilenameMatch[1].replace(/\s+/g, '').split(":")[0].substring(11);

            let coverageReport = coverageReportFunc.extractLinesPercentages(data);

            let notTested = this.getNotTestedFiles(originalFilename, coverageReport);
            let notHandled = this.getNotHandledFiles(originalFilename, coverageReport);

            coverageReportList = coverageReportList.concat(notTested).concat(notHandled);
        }

        return Promise.resolve(coverageReportList);
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
