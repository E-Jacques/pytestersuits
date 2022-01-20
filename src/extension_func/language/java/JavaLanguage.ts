import * as vscode from "vscode";

import { convertStringToCamelCase } from "../../../func";
import { LanguageInterface } from "../../languageInterface";
import { LibraryInterface } from "../../libraryInterface";

export default class JavaLanguage extends LanguageInterface {
    public fileExtension = "java";
    public testFileExtension = "java";
    public languageLibrary = [
    
    ];

    /**
     * Transform a string to it's equivalent in the good language convention.
     * ie. python_case for python, camelCase for javascript, etc...
     */
    normalizeStringToConvention (s: string): string {
        return convertStringToCamelCase(s);
    }

    getConfigLibrary (): LibraryInterface | null {
        let config = vscode.workspace.getConfiguration("pytestersuits");
        let value = config.get<string>("javaDefaultTestLibrary");
        if (!value) { return null; }

        let idx = this.languageLibrary.map(a => a.name).indexOf(value);
        if (idx === -1) { return null; }
        return this.languageLibrary[idx];
    }
}