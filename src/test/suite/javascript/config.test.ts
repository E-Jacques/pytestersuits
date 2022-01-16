import * as vscode from "vscode";
import * as assert from "assert";
import JavascriptHandler from "../../../extension_func/language/javascript/JavascriptHandler";
import { after } from "mocha";

suite("Testing javascript's default library configuration", () => {
    after(async () => {
        const extensionConfig = vscode.workspace.getConfiguration("pytestersuits");
        let defaultValue = extensionConfig.inspect<string>("javascriptDefaultTestLibrary")?.defaultValue;
        await extensionConfig.update("javascriptDefaultTestLibrary", defaultValue, true);
    });

    test("Should return null by default", () => {
        const python = new JavascriptHandler();
        let lib = python.getConfigLibrary();
        assert.strictEqual(lib, null);
    });

    test("Should return jest", () => {
        let extensionConfig = vscode.workspace.getConfiguration("pytestersuits");
        extensionConfig.update("javascriptDefaultTestLibrary", "jest", true).then(() => {
            extensionConfig = vscode.workspace.getConfiguration("pytestersuits");
            let lib = new JavascriptHandler().getConfigLibrary();
            assert.strictEqual(lib?.name, "jest");
        });
    });
});