import * as path from "path";
import *  as vscode from "vscode";

import * as func from '../func';
import { Test } from '../test';
import { openDocumentToLine } from '../vscodefunc';
import { LanguageInterface } from "./languageInterface";

export function addTestToFile(rootPath: string | null, languageInterface: LanguageInterface) {
    if (!rootPath) {
        vscode.window.showErrorMessage("Can't find root path.");
        return;
    }
    
    languageInterface.addTestToFile(rootPath);    
}