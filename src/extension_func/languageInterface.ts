import * as vscode from "vscode";
import { ChangeReport } from "../testingClass/test";
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

    abstract getConfigLibrary (): LibraryInterface | null;

    selectRightLIbrary(rootPath: string): void {
        let defaultLib = this.getConfigLibrary();
        if (defaultLib) {
            defaultLib.addTestToFile(rootPath);
            return;
        }

        vscode.window.showQuickPick(
            this.languageLibrary.map(lib => ({ label: lib.name, value: lib }))
        ).then(res => {
            let lib = res?.value;
            if (!lib) { return; }
            lib.addTestToFile(rootPath);
        });
    }

    getDefaultTestingLibrary (): LibraryInterface | null {
        let defaultLib = this.getConfigLibrary();
        if (defaultLib) { return defaultLib; }

        if (this.languageLibrary.length === 0) {
            vscode.window.showWarningMessage("Can't load a default library ...");
            return null;
        }

        return this.languageLibrary[0];
    }
};