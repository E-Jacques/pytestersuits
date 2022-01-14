import * as assert from "assert";
import { readFile, readFileSync, writeFileSync } from "fs";
import { before } from "mocha";
import { join } from "path";
import { createDir, createFile } from "../index";
import {Pytest} from "../../../extension_func/language/python/PytestLibrary";

import { Test } from "../../../testingClass/test";
import PythonHandler from "../../../extension_func/language/python/PythonHandler";
import { TestList } from "../../../testingClass/testList";

suite("Testing Test.appendTestToFile", () => {
    const testDir = join(__filename, "..", "..", "..", "test_env");

    before(() => {
        return new Promise<void>(async (resolve) => {
            await createDir(testDir);
            await createFile(join(testDir, "test_first.py"));
            await createFile(join(testDir, "test_second.py"));
            resolve();
        });
    });

    test("Testing for one file", () => {
        const filename = join(testDir, "test_first.py");
        const testName = "first";

        let test = new Test(testName, filename, new Pytest(new PythonHandler()));

        writeFileSync(filename, "");
        test.appendTestToFile();

        readFile(filename, "utf8", (err, data) => {
            if (err) { console.error(err); }

            assert.strictEqual(data, `import pytest\n\n@pytest.mark.skip(reason="generated automaticly")\ndef test_${testName}():\n\tpass\n`);
        });
    });

    test("Testing for a second file", () => {
        const filename = join(testDir, "test_second.py");
        const testName1 = "first";
        const testName2 = "second";

        let test1 = new Test(testName1, filename, new Pytest(new PythonHandler()));
        let test2 = new Test(testName2, filename, new Pytest(new PythonHandler()));

        writeFileSync(filename, "");

        test1.appendTestToFile();
        test2.appendTestToFile();

        readFile(filename, "utf8", (err, data) => {
            if (err) { console.error(err); }
            assert.strictEqual(data, `import pytest\n\n@pytest.mark.skip(reason="generated automaticly")\ndef test_${testName1}():\n\tpass\n\n@pytest.mark.skip(reason="generated automaticly")\ndef test_${testName2}():\n\tpass\n`);
        });
    });
});

suite("Testing Test.importTestLibraryIfNeeded", () => {
    const testDir = join(__filename, "..", "..", "..", "test_env");

    before(() => {
        return new Promise<void>(async (resolve) => {
            await createDir(testDir);
            await createFile(join(testDir, "test_third.py"));
            resolve();
        });
    });

    test("Correctly write to file", () => {
        const filename = join(testDir, "test_third.py");
        const testName = "first";

        let test = new Test(testName, filename, new Pytest(new PythonHandler()));
        writeFileSync(filename, "import trucmuch\n" +
            "from test import func\n\n" +

            "def test_func():\n" +
            "\tassert(func(5) == 0)\n" +
            "\tassert(func(12) == 2)\n\n" +

            "def test_func2():\n" +
            "\tassert(func(3) == -62)");
        test.importTestLibraryIfNeeded();
        let data = readFileSync(filename, "utf-8");
        assert.strictEqual(data, "import pytest\n" +
            "import trucmuch\n" +
            "from test import func\n\n" +

            "def test_func():\n" +
            "\tassert(func(5) == 0)\n" +
            "\tassert(func(12) == 2)\n\n" +

            "def test_func2():\n" +
            "\tassert(func(3) == -62)");

    });
});

suite("Testing Test.fileContainsImport", () => {
    const testDir = join(__filename, "..", "..", "..", "test_env");

    before(() => {
        return new Promise<void>(async (resolve) => {
            await createDir(testDir);
            await createFile(join(testDir, "test_fourth.py"));
            await createFile(join(testDir, "test_fifth.py"));
            resolve();
        });
    });
    test("Should detect 'import pytest'", () => {
        const filename = join(testDir, "test_fourth.py");
        const testName = "first";

        let test = new Test(testName, filename, new Pytest(new PythonHandler()));

        writeFileSync(filename, "import pytest");
        assert(test.fileContainsImport());

        writeFileSync(filename, "import pytest\n");
        assert(test.fileContainsImport());
    });

    test("Should detect when pytest is not imported", () => {
        const filename = join(testDir, "test_fifth.py");
        const testName = "first";

        let test = new Test(testName, filename, new Pytest(new PythonHandler()));

        writeFileSync(filename, "");
        assert(!test.fileContainsImport());

        writeFileSync(filename,
            "def func(x: int) -> int:\n" +
            "\tif x == 3:\n" +
            "\t\treturn x - 65\n" +
            "\telif x % 8 == 7:\n" +
            "\t\treturn 12\n" +
            "\telse:\n" +
            "\t\treturn x % 5\n");
        assert(!test.fileContainsImport());

        writeFileSync(filename,
            "import trucmuch\n" +
            "from test import func\n\n" +

            "def test_func():\n" +
            "\tassert(func(5) == 0)\n" +
            "\tassert(func(12) == 2)\n\n" +

            "def test_func2():\n" +
            "\tassert(func(3) == -62)");
        assert(!test.fileContainsImport());
    });
});

suite("Testing TestList class for pytest", () => {
    const testDir = join(__filename, "..", "..", "..", "test_env");

    before(() => {
        return new Promise<void>(async (resolve) => {
            await createDir(testDir);
            await createFile(join(testDir, "test_sixth.py"));
            await createFile(join(testDir, "test_seventh.py"));
            resolve();
        });
    });

    test("Should do the same with one test", () => {
        const filename = join(testDir, "test_sixth.py");
        writeFileSync(filename, "", { encoding: "utf8" });
        
        const testList = new TestList(filename, new Pytest(new PythonHandler()),null);
        testList.addTest("test1");
        testList.addTestsToFile();

        const shouldBe = `import pytest\n\n@pytest.mark.skip(reason="generated automaticly")\ndef test_test1():\n\tpass\n`;

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });

    test("Should also work with multiple tests", () => {
        const filename = join(testDir, "test_seventh.py");
        writeFileSync(filename, "", { encoding: "utf8" });

        const testList = new TestList(filename, new Pytest(new PythonHandler()), null);
        testList.addTest("test1");
        testList.addTest("test2");
        testList.addTestsToFile();


        const shouldBe = `import pytest\n\n@pytest.mark.skip(reason="generated automaticly")\ndef test_test1():\n\tpass\n\n@pytest.mark.skip(reason="generated automaticly")\ndef test_test2():\n\tpass\n`

        assert.strictEqual(readFileSync(filename, "utf-8"), shouldBe);
    });
});