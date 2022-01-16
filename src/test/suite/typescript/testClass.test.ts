import * as assert from "assert";
import { readFileSync, writeFileSync } from "fs";
import { before } from "mocha";
import { join } from "path";
import { createDir, createFile } from "..";
import TypescriptHandler from "../../../extension_func/language/typescript/TypescriptHandler";
import { VSCTestLibrary } from "../../../extension_func/language/typescript/VSCTestLibrary";
import { Test } from "../../../testingClass/test";
import { TestList } from "../../../testingClass/testList";

suite("Testing Test.appendToFile for typescript", () => {
    const testDir = join(__filename, "..", "..", "..", "test_env");

    before((done) => {
        createDir(testDir).then(async () => {
            await createFile(join(testDir, "testFirst.test.js"));
            await createFile(join(testDir, "testSecond.test.js"));
            await createFile(join(testDir, "testThird.test.js"));
            await createFile(join(testDir, "testFourth.test.js"));
            done();
        });
    });

    test("Should add the suite if not provided", () => {
        const filename = join(testDir, "testFirst.test.js");
        let test = new Test("firstTest", filename, new VSCTestLibrary(new TypescriptHandler()), "First suite");
        writeFileSync(filename, "", "utf-8");
        test.appendTestToFile();
        const shouldBe = "import * as assert from \"assert\";\n\n" +
            "suite(\"First suite\", () => {\n\n" +
            "\ttest.todo(\"firstTest\", () => {\n" +
            "\t\t// TODO\n" +
            "\t});\n\n" +
            "});";

        assert.strictEqual(readFileSync(filename, 'utf8'), shouldBe);
    });

    test("Shouldn't add a suite into a suite", () => {
        const filename = join(testDir, "testSecond.test.js");
        let test = new Test("secondTest", filename, new VSCTestLibrary(new TypescriptHandler()), "suite 2");
        writeFileSync(filename,
            "import * as assert from \"assert\";\n\n" +
            "suite(\"suite 2\", () => {});",
            { encoding: "utf8" });
        test.appendTestToFile();

        const shouldBe = "import * as assert from \"assert\";\n\n" +
            "suite(\"suite 2\", () => {\n" +
            "\ttest.todo(\"secondTest\", () => {\n" +
            "\t\t// TODO\n" +
            "\t});\n\n" +
            "});";

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });

    test("Shouldn't override other test when adding inside existing suite", () => {
        const filename = join(testDir, "testThird.test.js");
        let test = new Test("thirdTest", filename, new VSCTestLibrary(new TypescriptHandler()), "suite 2");
        writeFileSync(filename, "import * as assert from \"assert\";\n\n" +
            "suite(\"suite 2\", () => {\n" +
            "\ttest(\"secondTest\", () => {\n" +
            "\t\t// Blablabla\n" +
            "\t});\n" +
            "});",
            { encoding: "utf8" });
        test.appendTestToFile();

        const shouldBe = "import * as assert from \"assert\";\n\n" +
            "suite(\"suite 2\", () => {\n" +
            "\ttest(\"secondTest\", () => {\n" +
            "\t\t// Blablabla\n" +
            "\t});\n\n" +
            "\ttest.todo(\"thirdTest\", () => {\n" +
            "\t\t// TODO\n" +
            "\t});\n\n" +
            "});";

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });

    test("Should keep existing suite", () => {
        const filename = join(testDir, "testFourth.test.js");
        let test = new Test("forth Test", filename, new VSCTestLibrary(new TypescriptHandler()), "second");
        writeFileSync(filename, "import * as assert from \"assert\";\n\n" +
            "suite(\"first\", () => {\n" +
            "\ttest(\"secondTest\", () => {\n" +
            "\t\t// Blablabla\n" +
            "\t});\n" +
            "});", { encoding: "utf-8" });

        test.appendTestToFile();

        const shouldBe = "import * as assert from \"assert\";\n\n" +
            "suite(\"first\", () => {\n" +
            "\ttest(\"secondTest\", () => {\n" +
            "\t\t// Blablabla\n" +
            "\t});\n" +
            "});\n" +
            "suite(\"second\", () => {\n\n" +
            "\ttest.todo(\"forth Test\", () => {\n" +
            "\t\t// TODO\n" +
            "\t});\n\n" +
            "});";

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });
});

suite("Testing TestList class for VSCE test suit", () => {
    const testDir = join(__filename, "..", "..", "..", "test_env");

    before((done) => {
        createDir(testDir).then(async () => {
            createFile(join(testDir, "testFifth.test.js"));
            createFile(join(testDir, "testSixth.test.js"));
            done();
        });
    });

    test("Should do the same with one test", () => {
        const filename = join(testDir, "testFifth.test.js");
        writeFileSync(filename, "", { encoding: "utf8" });

        const testList = new TestList(filename, new VSCTestLibrary(new TypescriptHandler()), "my suite");
        testList.addTest("test");
        testList.addTestsToFile();

        const shouldBe = "import * as assert from \"assert\";\n\n" +
            "suite(\"my suite\", () => {\n\n" +
            "\ttest.todo(\"test\", () => {\n" +
            "\t\t// TODO\n" +
            "\t});\n\n" +
            "});";

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });

    test("Should also work with multiple tests", () => {
        const filename = join(testDir, "testSixth.test.js");
        writeFileSync(filename, "", { encoding: "utf8" });

        const testList = new TestList(filename, new VSCTestLibrary(new TypescriptHandler()), "my suite");
        testList.addTest("test1");
        testList.addTest("test2");
        testList.addTest("test3");
        testList.addTestsToFile();


        const shouldBe = "import * as assert from \"assert\";\n\n" +
            "suite(\"my suite\", () => {\n\n" +
            "\ttest.todo(\"test1\", () => {\n" +
            "\t\t// TODO\n" +
            "\t});\n\n\n" +
            "\ttest.todo(\"test2\", () => {\n" +
            "\t\t// TODO\n" +
            "\t});\n\n\n" +
            "\ttest.todo(\"test3\", () => {\n" +
            "\t\t// TODO\n" +
            "\t});\n\n" +
            "});";

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });
});