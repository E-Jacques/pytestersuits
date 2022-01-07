import * as assert from "assert";
import { readFileSync, writeFileSync } from "fs";
import { before } from "mocha";
import { join } from "path";
import { createDir, createFile } from "..";
import { JavascriptHandler } from "../../../extension_func/language/JavascriptHandler";
import { Test } from "../../../test";

suite("Testing Test.appendToFile for javascript", () => {
    const testDir = join(__filename, "..", "..", "test_env");

    before(() => {
        return new Promise<void>((resolve) => {
            createDir(testDir).then(() => {
                createFile(join(testDir, "testFirst.test.js")).then(async () => {
                    await createFile(join(testDir, "testSecond.test.js"));
                    await createFile(join(testDir, "testThird.test.js"));
                }).then(() => {
                    resolve();
                });
            });
        });
    });

    test("Should add the suite if not provided", () => {
        let test = new Test("firstTest", join(testDir, "testFirst.test.js"), new JavascriptHandler(), "First suit");
        test.appendTestToFile();
        const shoudlBe = `import * as assert from "assert"
suite("First suit", () => {

    test.todo("firstTest", () => {
        // TODO
    });

});
`;

        assert.strictEqual(readFileSync(join(testDir, "test_first.test.js"), 'utf8'), shoudlBe);
    });

    test("Shouldn't add a suite into a suite", () => {
        const filename = join(testDir, "secondTest.test.js");
        let test = new Test("secondTest", filename, new JavascriptHandler(), "suite 2");
        writeFileSync(filename, `import * as assert from "assert"
suite("suite 2", () => {

});`,
            { encoding: "utf8" });
        test.appendTestToFile();

        const shouldBe = `import * as assert from "assert"
suite("suite 2", () => {

    test.todo("secondTest", () => {
        // TODO
    });

});`;

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });

    test("Shouldn't override other test when adding inside existing suite", () => {
        const filename = join(testDir, "secondTest.test.js");
        let test = new Test("secondTest", filename, new JavascriptHandler(), "suite 2");
        writeFileSync(filename, `import * as assert from "assert"
suite("suite 2", () => {
    test("secondTest", () => {
        // Blablabla
    });
});`,
            { encoding: "utf8" });
        test.appendTestToFile();

        const shouldBe = `import * as assert from "assert"
suite("suite 2", () => {
    test("secondTest", () => {
        // Blablabla
    });

    test.todo("thirdTest", () => {
        // TODO
    });

});`;

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });
});