import * as vscode from "vscode";
import * as assert from "assert";
import PythonHandler from "../../../extension_func/language/python/PythonHandler";
import { after } from "mocha";

suite("Testing python's default library configuration", () => {
    after(async () => {
        const extensionConfig = vscode.workspace.getConfiguration("pytestersuits");
        let defaultValue = extensionConfig.inspect<string>("pythonDefaultTestLibrary")?.defaultValue;
        await extensionConfig.update("pythonDefaultTestLibrary", defaultValue, true);
    });

    test("Should return null by default", () => {
        const python = new PythonHandler();
        let lib = python.getConfigLibrary();
        assert.strictEqual(lib, null);
    });

    test("Should return pytest", () => {
        let extensionConfig = vscode.workspace.getConfiguration("pytestersuits");
        extensionConfig.update("pythonDefaultTestLibrary", "pytest", true).then(() => {
            extensionConfig = vscode.workspace.getConfiguration("pytestersuits");
            let lib = new PythonHandler().getConfigLibrary();
            assert.strictEqual(lib?.name, "pytest");
        });
    });
});