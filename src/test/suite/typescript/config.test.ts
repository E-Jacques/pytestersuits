import * as vscode from "vscode";
import * as assert from "assert";
import TypescriptHandler from "../../../extension_func/language/typescript/TypescriptHandler";
import { after } from "mocha";

suite ("Testing typescript's default library configuration", () => {
    after(async () => {
        const extensionConfig = vscode.workspace.getConfiguration("pytestersuits");
        let defaultValue = extensionConfig.inspect<string>("typescriptDefaultTestLibrary")?.defaultValue;
        await extensionConfig.update("typescriptDefaultTestLibrary", defaultValue, true);
    });

    test("Should return null by default", () => {
        let python = new TypescriptHandler();
        let lib = python.getConfigLibrary();
        assert.strictEqual(lib, null);
    });

    test("Should return 'Vscode Extension Test suit'", async () => {
        let extensionConfig = vscode.workspace.getConfiguration("pytestersuits");
        await extensionConfig.update("typescriptDefaultTestLibrary", "Vscode Extension Test suit", true);

        extensionConfig = vscode.workspace.getConfiguration("pytestersuits");
        let lib = new TypescriptHandler().getConfigLibrary();
        assert.strictEqual(lib?.name, "Vscode Extension Test suit");
    });
});