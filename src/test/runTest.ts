import * as path from 'path';

import { runTests } from '@vscode/test-electron';
import { rmdirSync } from 'fs';

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		// The path to test runner
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		// Download VS Code, unzip it and run the integration test
		await runTests({ extensionDevelopmentPath, extensionTestsPath });

		// Delete all files used to test
		rmdirSync(
			path.join(__dirname, "test_env"),
			{ recursive: true }
		);
	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();
