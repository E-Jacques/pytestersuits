import * as assert from "assert";
import { readFile, readFileSync, writeFileSync } from "fs";
import { before } from "mocha";
import { join } from "path";
import { createDir, createFile } from "../index";
import { PythonHandler } from "../../../extension_func/language/PythonHandler";

import { Test } from "../../../test";

suite("Testing Test.appendTestToFile", () => {
    const testDir = join(__filename, "..", "..", "..", "test_env");

    before(() => {
        return new Promise<void>((resolve) => {
            createDir(testDir).then(() => {
                createFile(join(testDir, "test_first.py")).then(() => {
                    createFile(join(testDir, "test_second.py"));
                }).then(() => {
                    resolve();
                });
            });
        });
    });

    test("Testing for one file", () => {
        const filename = join(testDir, "test_first.py");
        const testName = "first";

        let test = new Test(testName, filename, new PythonHandler());

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

        let test1 = new Test(testName1, filename, new PythonHandler());
        let test2 = new Test(testName2, filename, new PythonHandler());

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
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                createDir(testDir);
                createFile(join(testDir, "test_third.py"));
                resolve();
            }, 200);
        });
    });
    test("Correctly write to file", () => {
        const filename = join(testDir, "test_third.py");
        const testName = "first";

        let test = new Test(testName, filename, new PythonHandler());
        writeFileSync(filename, `import trucmuch
        from test import func

        def test_func():
            assert(func(5) == 0)
            assert(func(12) == 2)
            
        def test_func2():
            assert(func(3) == -62)`);
        test.importTestLibraryIfNeeded();
        let data = readFileSync(filename, "utf-8");
        assert.strictEqual(data, `import pytest
import trucmuch
        from test import func

        def test_func():
            assert(func(5) == 0)
            assert(func(12) == 2)
            
        def test_func2():
            assert(func(3) == -62)`);

    });
});

suite("Testing Test.fileContainsImport", () => {
    const testDir = join(__filename, "..", "..", "..", "test_env");

    before(() => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                createDir(testDir);
                createFile(join(testDir, "test_fourth.py"));
                createFile(join(testDir, "test_fifth.py"));
                resolve();
            }, 200);
        });
    });
    test("Should detect 'import pytest'", () => {
        const filename = join(testDir, "test_fourth.py");
        const testName = "first";

        let test = new Test(testName, filename, new PythonHandler());

        writeFileSync(filename, "import pytest");
        assert(test.fileContainsImport());

        writeFileSync(filename, "import pytest\n");
        assert(test.fileContainsImport());
    });

    test("Should detect when pytest is not imported", () => {
        const filename = join(testDir, "test_fifth.py");
        const testName = "first";

        let test = new Test(testName, filename, new PythonHandler());

        writeFileSync(filename, "");
        assert(!test.fileContainsImport());

        writeFileSync(filename, `def func(x: int) -> int:
        if x == 3:
            return x - 65
        elif x % 8 == 7:
            return 12
        else: 
            return x % 5`);
        assert(!test.fileContainsImport());

        writeFileSync(filename, `import trucmuch
        from test import func

        def test_func():
            assert(func(5) == 0)
            assert(func(12) == 2)
            
        def test_func2():
            assert(func(3) == -62)`);
        assert(!test.fileContainsImport());
    });
});