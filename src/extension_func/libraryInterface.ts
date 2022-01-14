import { ChangeReport } from "../test";
import { FileReport, LanguageInterface, LinesReport } from "./languageInterface";

export interface LibraryInterface {
    /**
     * List of the different ways to import the libraries corresponding to the Language.
     * The first one will be used to import when necessary.
     */
    importLibraries: string[] | string;

    /**
     * The parent LanguageInterface.
     */
    parent: LanguageInterface;

    /**
     * The name of the library.
     */
    name: string;

    /**
     * `True` if library can process coverage report. 
     */
    coverageReportUI: boolean;

    /**
     * Get line by line coverage from html Data
     */
    extractLinesPercentages(htmlData: string): LinesReport;

    /**
     * Get filename and percent from html data
     */
    extractFilesPercentages(htmlData: string): FileReport;

    /**
     * Run the coverage report to generate the html files
     */
    runCoverageReport(dirpath: string, cwd: string): void;


    /**
     * Create a test 
     */
    getTestFormat(testName: string, suiteName: string, data: string): ChangeReport;

    /**
     * vscode implementation of commande 'Add Test to File'.
     */
    addTestToFile(rootPath: string): void;

    /**
     * Return a list of the differents way to import a library.
     * Convert string to length one array.
     */
    getImportLibraries(): string[];
}