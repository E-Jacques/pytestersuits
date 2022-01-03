import * as assert from "assert";
import { readFile, readFileSync, unlink, writeFile, writeFileSync } from "fs";
import { PythonHandler } from "../../../extension_func/language/PythonHandler";

import { Test } from "../../../test";

suite("Testing Test.appendTestToFile", () => {

    test("Testing for one file", () => {
        const filename = "test_env/test_first.py";
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
        const filename = "test_env/test_second.py";
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
    test("Correctly write to file", () => {
        const filename = "test_env/test_third.py";
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
    test("Should detect 'import pytest'", () => {
        console.log(process.cwd());
        
        const filename = "test_env/test_fourth.py";
        const testName = "first";

        let test = new Test(testName, filename, new PythonHandler());

        writeFileSync(filename, "import pytest");
        assert(test.fileContainsImport());

        writeFileSync(filename, "import pytest\n");
        assert(test.fileContainsImport());
    });

    test("Should detect when pytest is not imported", () => {
        const filename = "test_env/test_fifth.py";
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