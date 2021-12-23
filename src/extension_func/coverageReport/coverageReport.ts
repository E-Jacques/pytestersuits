import *  as vscode from "vscode";
import { join } from "path";

export class CoverageReport extends vscode.TreeItem {
  /**
   * 
   * @param state null when that coverage report for a file
   */
  constructor(
    public readonly filepath: string,
    private line: number,
    private state: ("NH" | "NT") | null,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(filepath, collapsibleState);
    this.tooltip = `Go to ${this.filepath}:${this.line}`;
    this.description = this.state === null ? `${this.line}%` : `l:${this.line}`;
    let imagePath = join(__filename, "..", "..", "..", "rsc", "icons", `coverage_report_${this.state}.svg`);
    this.iconPath = { light: imagePath, dark: imagePath };

    if (this.state === null) {
      this.iconPath = undefined;
    }
  }

  public isFileReport() {
    return this.state === null;
  }
}