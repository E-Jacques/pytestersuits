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
    extractFilesPercentages(htmlData: string): FileReport[]

    /**
     * Run the coverage report to generate the html files
     */
    runCoverageReport(dirpath: string, cwd: string): void
};