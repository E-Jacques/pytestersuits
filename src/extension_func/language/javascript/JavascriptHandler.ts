import * as vscode from "vscode";

import { convertStringToCamelCase } from "../../../func";
import { LanguageInterface } from "../../languageInterface";
import { LibraryInterface } from "../../libraryInterface";
import { JestLibrary } from "./JestLibrary";

export default class JavascriptHandler extends LanguageInterface {
    public fileExtension = "js";
    public testFileExtension = "test.js";
    public languageLibrary: LibraryInterface[] = [
        new JestLibrary(this)
    ];


    public normalizeStringToConvention(s: string): string {
        return convertStringToCamelCase(s);
    }

    public getConfigLibrary (): LibraryInterface | null {
        let config = vscode.workspace.getConfiguration("pytestersuits");
        let value = config.get<string>("javascriptDefaultTestLibrary");
        if (!value) { return null; }
        
        let idx = this.languageLibrary.map(a => a.name).indexOf(value);
        if (idx === -1) { return null; }
        return this.languageLibrary[idx];
    }
}