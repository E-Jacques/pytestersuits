import * as vscode from "vscode";
import { camelCaseToPythonString } from "../../../func";
import { LanguageInterface } from "../../languageInterface";
import { LibraryInterface } from "../../libraryInterface";
import { Pytest } from "./PytestLibrary";

export default class PythonHandler extends LanguageInterface {
    public fileExtension = "py";
    public testFileExtension = "py";
    public languageLibrary: LibraryInterface[] = [
        new Pytest(this)
    ];

    public normalizeStringToConvention(s: string): string {
        return camelCaseToPythonString(s);
    }

    public getConfigLibrary(): LibraryInterface | null {
        let config = vscode.workspace.getConfiguration("pytestersuits");
        let value = config.get<string>("pythonDefaultTestLibrary");
        if (!value) { return null; }
        console.log(value);

        let idx = this.languageLibrary.map(a => a.name).indexOf(value);
        if (idx === -1) { return null; }
        return this.languageLibrary[idx];
    }
}
