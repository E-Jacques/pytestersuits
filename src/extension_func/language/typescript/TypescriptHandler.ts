import * as vscode from "vscode";
import { convertStringToCamelCase } from "../../../func";
import { LanguageInterface } from "../../languageInterface";
import { LibraryInterface } from "../../libraryInterface";
import { VSCTestLibrary } from "./VSCTestLibrary";

export default class TypescriptHandler extends LanguageInterface {
    public fileExtension = "ts";
    public testFileExtension = "test.ts";
    public languageLibrary: LibraryInterface[] = [
        new VSCTestLibrary(this)
    ];

    public normalizeStringToConvention(s: string): string {
        return convertStringToCamelCase(s);
    }

    public getConfigLibrary (): LibraryInterface | null {
        let config = vscode.workspace.getConfiguration("pytestersuits");
        let value = config.get<string>("typescriptDefaultTestLibrary");
        if (!value) { return null; }
        
        let idx = this.languageLibrary.map(a => a.name).indexOf(value);
        if (idx === -1) { return null; }
        return this.languageLibrary[idx];
    }
}