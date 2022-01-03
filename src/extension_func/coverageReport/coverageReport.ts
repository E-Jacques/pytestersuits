import *  as vscode from "vscode";
import { join } from "path";
import { getRootPath } from "../../vscodefunc";

export class CoverageReport extends vscode.TreeItem {
  contextValue?: string | undefined;
  /**
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

    
    let imagePath = join(__filename, "..", "..", "..", "..", "rsc", "icons", `coverage_report_${this.state}.svg`);
    this.iconPath = { light: imagePath, dark: imagePath };
    this.contextValue = "lineCoverageReport";

    if (this.state === null) {
      this.iconPath = undefined;
      this.contextValue = "fileCoverageReport";
    }
  }

  public isFileReport() {
    return this.state === null;
  }

  public async goto () {
    const rootPath = getRootPath();

    if (rootPath === null) {
      vscode.window.showErrorMessage(`Couldn't open file ${join(this.filepath)}`);
      return;
    }

    let uri = vscode.Uri.file(join(rootPath, this.filepath));
    await vscode.commands.executeCommand("vscode.open", uri);
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const position = editor.selection.active;

    var newPosition = position.with(this.line - 1, 0);
    var newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
  }
}