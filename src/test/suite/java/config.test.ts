import * as vscode from "vscode";
import * as assert from "assert";
import JavaHandler from "../../../extension_func/language/java/JavaHandler";
import { after } from "mocha";

suite("Testing java's default library configuration", () => {
    after(async () => {
        const extensionConfig = vscode.workspace.getConfiguration("pytestersuits");
        let defaultValue = extensionConfig.inspect<string>("javaDefaultTestLibrary")?.defaultValue;
        await extensionConfig.update("javaDefaultTestLibrary", defaultValue, true);
    });

    test("Should return null by default", () => {
        const java = new JavaHandler();
        let lib = java.getConfigLibrary();
        assert.strictEqual(lib, null);
    });

    test("Should return JUnit", () => {
        let extensionConfig = vscode.workspace.getConfiguration("pytestersuits");
        extensionConfig.update("javaDefaultTestLibrary", "JUnit", true).then(() => {
            extensionConfig = vscode.workspace.getConfiguration("pytestersuits");
            let lib = new JavaHandler().getConfigLibrary();
            assert.strictEqual(lib?.name, "JUnit");
        });
    });
});