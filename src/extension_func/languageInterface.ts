import { ChangeReport } from "../test";

export type FileReport = {
    filename: string,
    percent: number
};

export type LinesReport = {
    tested: number[],
    notTested: number[],
    notHandled: number[]
};

export interface LanguageInterface {
    fileExtension: string;
    testFileExtension: string;

    /**
     * List of the different ways to import the libraries corresponding to the Language.
     * The first one will be used to import when necessary.
     */
    importLibraries: string[] | string;

    /**
     * Transform a string to it's equivalent in the good language convention.
     * ie. python_case for python, camelCase for javascript, etc...
     */
    normalizeStringToConvention (s: string): string


    /**
     * Get line by line coverage from html Data
     */
    extractLinesPercentages(htmlData: string): LinesReport

    /**
     * Get filename and percent from html data
     */
    extractFilesPercentages(htmlData: string): FileReport

    /**
     * Run the coverage report to generate the html files
     */
    runCoverageReport(dirpath: string, cwd: string): void

    /**
     * Create a test 
     */
     getTestFormat (testName: string, suiteName: string, data: string): ChangeReport

    /**
     * vscode implementation of commande 'Add Test to File'.
     */
    addTestToFile (rootPath: string): void

    /**
     * Return a list of the differents way to import a library.
     * Convert string to length one array.
     */
    getImportLibraries (): string[];
};