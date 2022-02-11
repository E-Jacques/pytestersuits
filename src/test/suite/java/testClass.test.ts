import * as assert from "assert";
import { readFileSync, writeFileSync } from "fs";
import { before } from "mocha";
import { join } from "path";
import { createDir, createFile } from "..";
import JavaHandler from "../../../extension_func/language/java/JavaHandler";
import { JUnitLibrary } from "../../../extension_func/language/java/JUnitLibrary";
import { Test } from "../../../testingClass/test";
import { TestList } from "../../../testingClass/testList";


suite("Testing Test.appendToFile for JUnit", () => {
    const testDir = join(__filename, "..", "..", "..", "test_env");

    before((done) => {
        createDir(testDir).then(async () => {
            await createFile(join(testDir, "TestFirstJUnit.java"));
            await createFile(join(testDir, "TestSecondJUnit.java"));
            await createFile(join(testDir, "TestThirdJUnit.java"));
            await createFile(join(testDir, "TestFourthJUnit.java"));
            await createFile(join(testDir, "TestTenthJUnit.java"));
            await createFile(join(testDir, "TestEleventhJUnit.java"));
            await createFile(join(testDir, "TestNinethJUnit.java"));
            done();
        });
    });

    test("Should correctly put test", () => {
        const filename = join(testDir, "TestFirstJUnit.java");
        let test = new Test("firstTest", filename, new JUnitLibrary(new JavaHandler()), "TestFirstJUnit");
        writeFileSync(filename, "class TestFirstJUnit {\n\n}", "utf-8");
        test.appendTestToFile();
        const shouldBe =
            "import org.junit.*;\n\n" +
            "class TestFirstJUnit {\n\n" +
            "\t@Test\n" +
            "\tvoid firstTest() {\n" +
            "\t\t// TODO\n" +
            "\t}\n\n" +
            "}";

        assert.strictEqual(readFileSync(filename, 'utf8'), shouldBe);
    });

    test("Should put class stuff correctly", () => {
        const filename = join(testDir, "TestSecondJUnit.java");
        let test = new Test("firstTest", filename, new JUnitLibrary(new JavaHandler()), "TestSecondJUnit");
        writeFileSync(filename, "", "utf-8");
        test.appendTestToFile();
        const shouldBe =
            "import org.junit.*;\n\n" +
            "class TestSecondJUnit {\n\n" +
            "\t@Test\n" +
            "\tvoid firstTest() {\n" +
            "\t\t// TODO\n" +
            "\t}\n\n" +
            "}";

        assert.strictEqual(readFileSync(filename, 'utf8'), shouldBe);
    });

    test("Shouldn't override other test when adding inside existing suite", () => {
        const filename = join(testDir, "TestThirdJUnit.java");
        let test = new Test("thirdTest", filename, new JUnitLibrary(new JavaHandler()), "TestThirdJUnit");
        writeFileSync(filename,
            "import org.junit.*;\n\n" +
            "class TestThirdJUnit {\n\n" +
            "\t@Test\n" +
            "\tvoid firstTest() {\n" +
            "\t\t// TODO\n" +
            "\t}\n\n" +
            "}",
            { encoding: "utf8" });
        test.appendTestToFile();

        const shouldBe = "import org.junit.*;\n\n" +
            "class TestThirdJUnit {\n\n" +
            "\t@Test\n" +
            "\tvoid firstTest() {\n" +
            "\t\t// TODO\n" +
            "\t}\n\n" +
            "\t@Test\n" +
            "\tvoid thirdTest() {\n" +
            "\t\t// TODO\n" +
            "\t}\n\n" +
            "}";

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });

    test("Shouldn't remove package keyword from the top", () => {
        const filename = join(testDir, "TestTenthJUnit.java");
        let test = new Test("tenthTest", filename, new JUnitLibrary(new JavaHandler()), "TestTenthJUnit");
        writeFileSync(filename,
            "package mypackage;\n" +
            "class TestTenthJUnit {\n\n" +
            "}", { encoding: "utf-8" });
        test.appendTestToFile();
        const shouldBe = "package mypackage;\n" +
            "import org.junit.*;\n\n" +
            "class TestTenthJUnit {\n\n" +
            "\t@Test\n" +
            "\tvoid tenthTest() {\n" +
            "\t\t// TODO\n" +
            "\t}\n\n" +
            "}";

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });

    test("Shouldn't remove package keyword from the top without overwriting datas", () => {
        const filename = join(testDir, "TestNinethJUnit.java");
        let test = new Test("tenthTest", filename, new JUnitLibrary(new JavaHandler()), "TestNinethJUnit");
        writeFileSync(filename,
            "package mypackage;\n" +
            "class TestNinethJUnit {\n\n" +
            "}", { encoding: "utf-8" });
        test.appendTestToFile();
        const shouldBe = "package mypackage;\n" +
            "import org.junit.*;\n\n" +
            "class TestNinethJUnit {\n\n" +
            "\t@Test\n" +
            "\tvoid tenthTest() {\n" +
            "\t\t// TODO\n" +
            "\t}\n\n" +
            "}";

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });

    test("Shouldn't import when an import contains JUnit", () => {
        const filename = join(testDir, "TestEleventhJUnit.java");
        let test = new Test("thirdTest", filename, new JUnitLibrary(new JavaHandler()), "TestEleventhJUnit");
        writeFileSync(filename,
            "import org.java.junit.*;\n\n" +
            "class TestEleventhJUnit {\n\n" +
            "\t@Test\n" +
            "\tvoid firstTest() {\n" +
            "\t\t// TODO\n" +
            "\t}\n\n" +
            "}", { encoding: "utf-8" });
        test.appendTestToFile();
        const shouldBe = "import org.java.junit.*;\n\n" +
            "class TestEleventhJUnit {\n\n" +
            "\t@Test\n" +
            "\tvoid firstTest() {\n" +
            "\t\t// TODO\n" +
            "\t}\n\n" +
            "\t@Test\n" +
            "\tvoid thirdTest() {\n" +
            "\t\t// TODO\n" +
            "\t}\n\n" +
            "}";

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });
});

suite("Testing TestList class for Jest test suit", () => {
    const testDir = join(__filename, "..", "..", "..", "test_env");

    before((done) => {
        createDir(testDir).then(async () => {
            createFile(join(testDir, "TestFifthJUnit.java"));
            createFile(join(testDir, "TestSixthJUnit.java"));
            done();
        });
    });

    test("Should do the same with one test", () => {
        const filename = join(testDir, "TestFifthJUnit.java");
        writeFileSync(filename, "", { encoding: "utf8" });

        const testList = new TestList(filename, new JUnitLibrary(new JavaHandler()), "TestFifthJUnit");
        testList.addTest("test");
        testList.addTestsToFile();

        const shouldBe =
            "import org.junit.*;\n\n" +
            "class TestFifthJUnit {\n\n" +
            "\t@Test\n" +
            "\tvoid test() {\n" +
            "\t\t// TODO\n" +
            "\t}\n\n" +
            "}";

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });

    test("Should also work with multiple tests", () => {
        const filename = join(testDir, "TestSixthJUnit.java");
        writeFileSync(filename, "", { encoding: "utf8" });

        const testList = new TestList(filename, new JUnitLibrary(new JavaHandler()), "TestSixthJUnit");
        testList.addTest("test1");
        testList.addTest("test2");
        testList.addTest("test3");
        testList.addTestsToFile();

        const shouldBe =
            "import org.junit.*;\n\n" +
            "class TestSixthJUnit {\n\n" +
            "\t@Test\n" +
            "\tvoid test1() {\n" +
            "\t\t// TODO\n" +
            "\t}\n\n" +
            "\t@Test\n" +
            "\tvoid test2() {\n" +
            "\t\t// TODO\n" +
            "\t}\n\n" +
            "\t@Test\n" +
            "\tvoid test3() {\n" +
            "\t\t// TODO\n" +
            "\t}\n\n" +
            "}";

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });
});