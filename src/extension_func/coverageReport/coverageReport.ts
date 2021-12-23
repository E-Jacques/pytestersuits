import *  as vscode from "vscode";
import { join } from "path";

export class CoverageReport extends vscode.TreeItem {
    constructor(
        public readonly filepath: string,
        private line: number,
        private state: ("NH" | "NT"),
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
      ) {
        super(filepath, collapsibleState);
        this.tooltip = `Go to ${this.filepath}:${this.line}`;
        this.description = `l:${this.line}`;
        this.iconPath = join(__dirname, "rsc", "icons", `coverage_report_${this.state}.svg`);
    }
}