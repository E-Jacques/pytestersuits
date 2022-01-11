import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';
import { access, mkdir, writeFile } from 'fs';
import { join } from 'path';

export function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
		glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
			if (err) {
				return e(err);
			}

			// Add files to the test suite
			files.filter(f => !f.includes("test_env")).forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

			try {
				// Run the mocha test
				mocha.run(failures => {
					if (failures > 0) {
						e(new Error(`${failures} tests failed.`));
					} else {
						c();
					}
				});
			} catch (err) {
				console.error(err);
				e(err);
			}
		});
	});
}

/**
 * Use to create tests file in mocha environment.
 * @async
 */
export async function createFile(filename: string): Promise<void> {
	return new Promise<void>((resolve) => {
		access(filename, accessErr => {
			if (accessErr) {
				writeFile(filename, "", err => {
					// if (err) { console.error(err); }
				});
			}

			resolve();
		});
	});
}

/**
 * Use to create tests directory in mocha environment.
 * @async
 */
export async function createDir(dirpath: string): Promise<void> {
	return new Promise<void>((resolve, _reject) => {
		access(dirpath, (accessErr) => {
			if (accessErr) {
				mkdir(dirpath, { recursive: true }, err => {
					// if (err) { console.error(err); }
				});
			}

			resolve();
		});
	});
}

export function createTestDir(dirName: string, filenames: string[], layerFilenames: string[]): Promise<void> {
	return new Promise<void>(async (resolve) => {
		await createDir(dirName);
		for (let filename of filenames) {
			await createFile(join(dirName, filename));
		}

		await createDir(join(dirName, "layer"));
		for (let filename of filenames) {
			await createFile(join(dirName, "layer", filename));
		}

		resolve();
	});
}