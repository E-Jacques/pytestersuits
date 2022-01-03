import * as path from "path";
import *  as vscode from "vscode";

import { LanguageInterface } from "./languageInterface";

export function addTestToFile(rootPath: string | null, languageInterface: LanguageInterface) {
    if (!rootPath) {
        vscode.window.showErrorMessage("Can't find root path.");
        return;
    }
    
    languageInterface.addTestToFile(rootPath);    
}