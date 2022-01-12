import * as vscode from "vscode";
import { ChangeReport } from "../test";
import { LibraryInterface } from "./libraryInterface";

export type FileReport = {
    filename: string,
    percent: number
};

export type LinesReport = {
    tested: number[],
    notTested: number[],
    notHandled: number[]
};

export abstract class LanguageInterface {
    public fileExtension: string = "";
    public testFileExtension: string = "";
    public languageLibrary: LibraryInterface[] = [];

    /**
     * Transform a string to it's equivalent in the good language convention.
     * ie. python_case for python, camelCase for javascript, etc...
     */
    abstract normalizeStringToConvention (s: string): string;

    selectRightLIbrary(rootPath: string): void {
        vscode.window.showQuickPick(
            this.languageLibrary.map(lib => ({ label: lib.name, value: lib }))
        ).then(res => {
            let lib = res?.value;
            if (!lib) { console.error("Can't pick right library."); return; }
            lib.addTestToFile(rootPath);
        });
    }

    getDefaultTestingLibrary (): LibraryInterface | null {
        if (this.languageLibrary.length === 0) {
            vscode.window.showWarningMessage("Can't load a default library ...");
            return null;
        }

        return this.languageLibrary[0];
    }
};