import * as assert from "assert";
import { readFileSync, writeFileSync } from "fs";
import { before } from "mocha";
import { join } from "path";
import { createDir, createFile } from "..";
import JavascriptHandler from "../../../extension_func/language/javascript/JavascriptHandler";
import { JestLibrary } from "../../../extension_func/language/javascript/JestLibrary";
import { Test } from "../../../testingClass/test";
import { TestList } from "../../../testingClass/testList";

suite("Testing Test.appendToFile for jest", () => {
    const testDir = join(__filename, "..", "..", "..", "test_env");

    before((done) => {
        createDir(testDir).then(async () => {
            await createFile(join(testDir, "testFirstJest.test.js"));
            await createFile(join(testDir, "testSecondJest.test.js"));
            await createFile(join(testDir, "testThirdJest.test.js"));
            await createFile(join(testDir, "testFourthJest.test.js"));
            done();
        });
    });

    test("Should add the suite if not provided", () => {
        const filename = join(testDir, "testFirstJest.test.js");
        let test = new Test("firstTest", filename, new JestLibrary(new JavascriptHandler()), "First suite");
        writeFileSync(filename, "", "utf-8");
        test.appendTestToFile();
        const shouldBe =
            "describe(\"First suite\", () => {\n\n" +
            "\ttest.todo(\"firstTest\");\n\n" +
            "});";

        assert.strictEqual(readFileSync(filename, 'utf8'), shouldBe);
    });

    test("Shouldn't add a suite into a suite", () => {
        const filename = join(testDir, "testSecondJest.test.js");
        let test = new Test("secondTest", filename, new JestLibrary(new JavascriptHandler()), "suite 2");
        writeFileSync(filename,
            "describe(\"suite 2\", () => {});",
            { encoding: "utf8" });
        test.appendTestToFile();

        const shouldBe = 
            "describe(\"suite 2\", () => {\n" +
            "\ttest.todo(\"secondTest\");\n\n" +
            "});";

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });

    test("Shouldn't override other test when adding inside existing suite", () => {
        const filename = join(testDir, "testThirdJest.test.js");
        let test = new Test("thirdTest", filename, new JestLibrary(new JavascriptHandler()), "suite 2");
        writeFileSync(filename,  "describe(\"suite 2\", () => {\n" +
            "\ttest(\"secondTest\", () => {\n" +
            "\t\t// Blablabla\n" +
            "\t});\n" +
            "});",
            { encoding: "utf8" });
        test.appendTestToFile();

        const shouldBe = "describe(\"suite 2\", () => {\n" +
            "\ttest(\"secondTest\", () => {\n" +
            "\t\t// Blablabla\n" +
            "\t});\n\n" +
            "\ttest.todo(\"thirdTest\");\n\n" +
            "});";

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });

    test("Should keep existing suite", () => {
        const filename = join(testDir, "testFourthJest.test.js");
        let test = new Test("forth Test", filename, new JestLibrary(new JavascriptHandler()), "second");
        writeFileSync(filename, "describe(\"first\", () => {\n" +
            "\ttest(\"secondTest\", () => {\n" +
            "\t\t// Blablabla\n" +
            "\t});\n" +
            "});", { encoding: "utf-8" });

        test.appendTestToFile();

        const shouldBe = 
            "describe(\"first\", () => {\n" +
            "\ttest(\"secondTest\", () => {\n" +
            "\t\t// Blablabla\n" +
            "\t});\n" +
            "});\n" +
            "describe(\"second\", () => {\n\n" +
            "\ttest.todo(\"forth Test\");\n\n" +
            "});";

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });
});

suite("Testing TestList class for Jest test suit", () => {
    const testDir = join(__filename, "..", "..", "..", "test_env");

    before((done) => {
        createDir(testDir).then(async () => {
            createFile(join(testDir, "testFifthJest.test.js"));
            createFile(join(testDir, "testSixthJest.test.js"));
            done();
        });
    });

    test("Should do the same with one test", () => {
        const filename = join(testDir, "testFifthJest.test.js");
        writeFileSync(filename, "", { encoding: "utf8" });

        const testList = new TestList(filename, new JestLibrary(new JavascriptHandler()), "my suite");
        testList.addTest("test");
        testList.addTestsToFile();

        const shouldBe = 
            "describe(\"my suite\", () => {\n\n" +
            "\ttest.todo(\"test\");\n\n" +
            "});";

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });

    test("Should also work with multiple tests", () => {
        const filename = join(testDir, "testSixthJest.test.js");
        writeFileSync(filename, "", { encoding: "utf8" });

        const testList = new TestList(filename, new JestLibrary(new JavascriptHandler()), "my suite");
        testList.addTest("test1");
        testList.addTest("test2");
        testList.addTest("test3");
        testList.addTestsToFile();

        const shouldBe = 
            "describe(\"my suite\", () => {\n\n" +
            "\ttest.todo(\"test1\");\n\n\n" +
            "\ttest.todo(\"test2\");\n\n\n" +
            "\ttest.todo(\"test3\");\n\n" +
            "});";

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });
});