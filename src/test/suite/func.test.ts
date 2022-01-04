import * as assert from "assert";

import { before } from 'mocha';
import { join } from 'path';
import * as func from "../../func";
import { createTestDir } from ".";

suite("getLineCount", () => {
	test("Empty string", () => {
		assert.strictEqual(1, func.getLineCount(""));
	});

	test("Not line return", () => {
		assert.strictEqual(1, func.getLineCount("Ceci est un premier test !"));
	});

	test("Some lines to be count", () => {
		assert.strictEqual(2, func.getLineCount(`Ceci est
		un test !`));
		assert.strictEqual(5, func.getLineCount(`Ceci est
		un simple
		test
		pour
		tester un test !`));
	});
});

suite("camelCaseToPythonString", () => {
	test("Don't change python string", () => {
		assert.strictEqual(func.camelCaseToPythonString("in_python_case"), "in_python_case");
		assert.strictEqual(func.camelCaseToPythonString("test"), "test");
	});

	test("Handle space and upperCase", () => {
		assert.strictEqual(func.camelCaseToPythonString("in space case"), "in_space_case");
		assert.strictEqual(func.camelCaseToPythonString("in space Case"), "in_space_case");
		assert.strictEqual(func.camelCaseToPythonString("in Space case"), "in_space_case");
		assert.strictEqual(func.camelCaseToPythonString("in Space Case"), "in_space_case");
		assert.strictEqual(func.camelCaseToPythonString("test this here and Now"), "test_this_here_and_now");
	});

	test("transform camelCase", () => {
		assert.strictEqual(func.camelCaseToPythonString("notInPythonCase"), "not_in_python_case");
	});
});

suite("isExtension", () => {
	test("Send false on wrong ext length", () => {
		assert(!func.isExtension("a.py", "abcdef"));
	});

	test("Dot before ext", () => {
		assert(!func.isExtension("apy", "py"));
		assert(func.isExtension("a.py", "py"));
	});

	test("Correctly act", () => {
		assert(func.isExtension("a.py", "py"));
		assert(func.isExtension("a.js", "js"));
		assert(func.isExtension("a.test.js", "js"));
	});
});

suite("isDirectory", () => {
	const testDir = join(__filename, "..", "..", "test_env", "test_tmp");

	before(() => {
		const filenames = ["test.py", "main.py", "wrong.piy", "wrong.exe", "a.py"];

		return new Promise<void>((resolve) => {
			createTestDir(testDir, filenames, filenames).then(() => {
				resolve();
			});
		});
	});

	test("Not a directory", () => {
		assert(!func.isDirectory(join(testDir, "test.py")));
		assert(!func.isDirectory(join(testDir, "layer", "test.py")));
		assert(!func.isDirectory(join(testDir, "wrong")));
	});

	test("Is a directory", () => {
		assert(func.isDirectory(testDir));
		console.log(join(testDir, "layer"));

		assert(func.isDirectory(join(testDir, "layer")));
	});
});

suite("getFileWithExtension", () => {
	const testDir = join(__filename, "..", "..", "test_env", "test_tmp");

	before(() => {
		const filenames = ["test.py", "main.py", "wrong.piy", "wrong.exe", "a.py"];

		return new Promise<void>((resolve) => {
			createTestDir(testDir, filenames, filenames).then(() => {
				resolve();
			});
		});
	});

	test("Throw Error on dir not found", () => {
		assert(func.getFileWithExtension("pytest", "py").length === 0);
	});

	test("Filter correctly", () => {
		let filteredArray = func.getFileWithExtension(testDir, "py");
		assert.strictEqual(6, filteredArray.length);

		filteredArray = func.getFileWithExtension(testDir, "piy");
		assert.strictEqual(2, filteredArray.length);
	});

	test("Send correct filenames", () => {
		let filteredArray = func.getFileWithExtension(testDir, "py");
		assert(filteredArray.includes("test.py"));
		assert(filteredArray.includes("main.py"));
		assert(filteredArray.includes("a.py"));
	});

	test("Get files Recursively", () => {
		let filteredArray = func.getFileWithExtension(testDir, "py");
		assert(filteredArray.includes(join("layer", "test.py")));
		assert(filteredArray.includes(join("layer", "main.py")));
		assert(filteredArray.includes(join("layer", "a.py")));
	});
});

suite("Testing addExtensionToEnd", () => {
	test("Should add the ext at the end of filename where there is no extension for the moment", () => {
		assert.strictEqual(func.addExtensionToEnd("a", "py"), "a.py");
		assert.strictEqual(func.addExtensionToEnd("b.test", "js"), "b.test.js");
		assert.strictEqual(func.addExtensionToEnd("b", "test.js"), "b.test.js");
	});

	test("Should add the ext at the end of the filename even if a part is already present", () => {
		assert.strictEqual(func.addExtensionToEnd("a.p", "py"), "a.py");
		assert.strictEqual(func.addExtensionToEnd("test.p", "py"), "test.py");
		assert.strictEqual(func.addExtensionToEnd("a.test", "js"), "a.test.js");
		assert.strictEqual(func.addExtensionToEnd("a", "test.js"), "a.test.js");
		assert.strictEqual(func.addExtensionToEnd("a.", "test.js"), "a.test.js");
	});

	test("Should stay the same when ext name is already present", () => {
		assert.strictEqual(func.addExtensionToEnd("a.py", "py"), "a.py");
		assert.strictEqual(func.addExtensionToEnd("test.py", "py"), "test.py");
		assert.strictEqual(func.addExtensionToEnd("b.test.js", "test.js"), "b.test.js");
	});
});

suite("Testing getMostFrequent", () => {
	test("Empty array should return null", () => {
		assert.strictEqual(func.getMostFrequent([]), null);
	});

	test("Should return correct one", () => {
		assert.strictEqual(func.getMostFrequent(["py", "py", "js"]), "py");
		assert.strictEqual(func.getMostFrequent(["py"]), "py");
	});

	test("Should return first one if same amount", () => {
		assert.strictEqual(func.getMostFrequent(["py", "js"]), "py");
	});
});

suite("Testing getMaxIndex", () => {
	test("Should throw error on empty array", () => {
		assert.throws(() => func.getMaxIndex([]), Error, "Can't get maximum value of an empty array.");
	});

	test("Should return correct index", () => {
		assert.strictEqual(func.getMaxIndex([1, 2, 5, 6]), 3);
		assert.strictEqual(func.getMaxIndex([5, 4, 2]), 0);
		assert.strictEqual(func.getMaxIndex([4, 5, 3]), 1);
	});

	test("First return first matching index", () => {
		assert.strictEqual(func.getMaxIndex([1, 3, 3, 2]), 1);
	});
});