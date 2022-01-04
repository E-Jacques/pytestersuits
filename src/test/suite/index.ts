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
			files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

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


export function createFile(filename: string) {
	access(filename, accessErr => {
		if (accessErr) {

			writeFile(filename, "", err => {
				if (err) { console.error(err); }
			});
		}
	});
}

export function createDir(dirpath: string) {
	access(dirpath, (accessErr) => {
		if (accessErr) {
			mkdir(dirpath, { recursive: true }, err => {
				if (err) { console.error(err); }
			});
		}
	});
}

export function createTestDir(dirName: string, filenames: string[], layerFilenames: string[]) {
	createDir(dirName);

	for (let filename of filenames) {
		createFile(join(dirName, filename));
	}

	createDir(join(dirName, "layer"));

	for (let filename of layerFilenames) {
		createFile(join(dirName, "layer", filename));
	}


}