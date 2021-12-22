import * as assert from "assert";

import { after, before } from 'mocha';
import { mkdir, rmdirSync, writeFile } from 'fs';
import { join } from 'path';
import * as func from "../../func";

function createTestDir(dirName: string, filenames: string[], layerFilenames: string[]) {
	mkdir(dirName, err => {
		if (err) { console.error(err); }
	});

	for (let filename of filenames) {
		writeFile(join(dirName, filename), "", err => {
			if (err) { console.error(err); }
		});
	}

	mkdir(join(dirName, "layer"), err => {
		if (err) { console.error(err); }
	});

	for (let filename of layerFilenames) {
		writeFile(join(dirName, "layer", filename), "", err => {
			if (err) { console.error(err); }
		});
	}
}

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
	const testDir = "test_tmp";

	before(() => {
		const filenames = ["test.py", "main.py", "wrong.piy", "wrong.exe", "wrong", "a.py"];
		createTestDir(testDir, filenames, filenames);
	});

	after(() => {
		rmdirSync(testDir, { recursive: true });
	});

	test("Not a directory", () => {
		assert(!func.isDirectory(join(testDir, "test.py")));
		assert(!func.isDirectory(join(testDir, "layer", "test.py")));
		assert(!func.isDirectory(join(testDir, "wrong")));
	});

	test("Is a directory", () => {
		assert(func.isDirectory(testDir));
		assert(func.isDirectory(join(testDir, "layer")));
	});
});

suite("getFileWithExtension", () => {
	const testDir = "test_tmp";

	before(() => {
		const filenames = ["test.py", "main.py", "wrong.piy", "wrong.exe", "a.py"];
		createTestDir(testDir, filenames, filenames);
	});

	after(() => {
		rmdirSync(testDir, { recursive: true });
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
		assert(filteredArray.includes("layer/test.py"));
		assert(filteredArray.includes("layer/main.py"));
		assert(filteredArray.includes("layer/a.py"));
	});
});
