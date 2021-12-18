import * as assert from "assert";
import { readFile, unlink, writeFile } from "fs";

import { Test } from "../../test";

suite("Testing Test class", () => {
    
    test("Testing for one file", () => {
        const filename = "test_first.py";
        const testName = "first";

        let test = new Test(testName, filename);
        
        writeFile(filename, "", (err) => {
            if (err) { console.error(err); }
        });
        test.appendTestToFile();

        readFile(filename, "utf8",(err, data) => {
            if (err) { console.error(err); }

            assert.strictEqual(data, `@pytest.mark.skip(reason="generated automaticly")\ndef test_${testName}:\n\tpass\n\n`);
        });

        unlink(filename, err => {
            if (err) { console.error(err); }
        });
    });

    test("Testing for a second file", () => {
        const filename = "test_first.py";
        const testName1 = "first";
        const testName2 = "second";

        let test1 = new Test(testName1, filename);
        let test2 = new Test(testName2, filename);
        
        writeFile(filename, "", (err) => {
            if (err) { console.error(err); }
        });

        test1.appendTestToFile();
        test2.appendTestToFile();

        readFile(filename, "utf8", (err, data) => {
            if (err) { console.error(err); }
            assert.strictEqual(data, `@pytest.mark.skip(reason="generated automaticly")\ndef test_${testName1}:\n\tpass\n\n@pytest.mark.skip(reason="generated automaticly")\ndef test_${testName2}:\n\tpass\n\n`);
        });

        unlink(filename, err => {
            if (err) { console.error(err); }
        });
    });
});