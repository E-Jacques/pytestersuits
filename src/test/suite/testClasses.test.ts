import * as assert from "assert";
import { Pytest } from "../../extension_func/language/python/PytestLibrary";
import PythonHandler from "../../extension_func/language/python/PythonHandler";
import { camelCaseToPythonString } from "../../func";
import { Test } from "../../testingClass/test";
import { TestList } from "../../testingClass/testList";

suite("Testing Test.toString", () => {
    test("No suite", () => {
        let test = new Test("test1", "f", new Pytest(new PythonHandler()), null);
        assert.strictEqual(test.toString(), "test1");

        test.setName("i'm sure it work");
        assert.strictEqual(test.toString(), "i'm sure it work");
    });

    test("With suiteName", () => {
        let test = new Test("test1", "f", new Pytest(new PythonHandler()), "test2");
        assert.strictEqual(test.toString(), "test1 [test2]");

        test.setName("name with space");
        assert.strictEqual(test.toString(), "name with space [test2]");

        test.setSuite("suite with space");
        assert.strictEqual(test.toString(), "name with space [suite with space]");

        test.setName("noSpaceName");
        assert.strictEqual(test.toString(), "noSpaceName [suite with space]");
    });
});

suite("Testing TestList.toString", () => {
    test("With empty testList", () => {
        const testList = new TestList("my_file.file", new Pytest(new PythonHandler()), null);
        assert.strictEqual(testList.toString(), "No test to add to 'my_file.file'.");

        testList.setSuite("my suite");
        assert.strictEqual(testList.toString(), "No test to add to 'my_file.file' in 'my suite'.");
    });

    test("With only one test", () => {
        let testList = new TestList("my_file.file", new Pytest(new PythonHandler()), null);
        testList.addTest("test1");
        assert.strictEqual(testList.toString(), "Add 'test1' to 'my_file.file'.");

        testList = new TestList("my_file.file", new Pytest(new PythonHandler()), "suite");
        testList.addTest("test1");
        assert.strictEqual(testList.toString(), "Add 'test1 [suite]' to 'my_file.file'.");
    });

    test("With multiple tests", () => {
        let testList = new TestList("my_file.file", new Pytest(new PythonHandler()), null);
        testList.addTest("test1");
        testList.addTest("test2");
        testList.addTest("test3");
        assert.strictEqual(testList.toString(), "Add 3 tests (ie. 'test1', 'test2' and 'test3') to 'my_file.file'.");

        testList = new TestList("my_file.file", new Pytest(new PythonHandler()), "my suite");
        testList.addTest("test1");
        testList.addTest("test2");
        testList.addTest("test3");
        assert.strictEqual(testList.toString(), "Add 3 tests (ie. 'test1 [my suite]', 'test2 [my suite]' and 'test3 [my suite]') to 'my_file.file'.");
    });
});

suite ("Testing TestList.extractTestsFromString", () => {
    test("Should return one if no delimiter in input", () => {
        const testList = new TestList("f", new Pytest(new PythonHandler()), null);
        testList.extractTestsFromString("ceci est un Test", ";", camelCaseToPythonString);
        assert.strictEqual(testList.getLength(), 1);
        assert.strictEqual(testList.getStringAt(0), "ceci_est_un_test");
    });

    test("Should return the exact number of test", () => {
        const testList = new TestList("f", new Pytest(new PythonHandler()), null);
        testList.extractTestsFromString("ceci est un Test; celui ci aussi;    mais lui aussi enfait;oui", ";", camelCaseToPythonString);
        assert.strictEqual(testList.getLength(), 4);
        assert.strictEqual(testList.getStringAt(0), "ceci_est_un_test");
        assert.strictEqual(testList.getStringAt(1), "celui_ci_aussi");
        assert.strictEqual(testList.getStringAt(2), "mais_lui_aussi_enfait");
        assert.strictEqual(testList.getStringAt(3), "oui");
    });
});