import { ChangeReport } from "../../../testingClass/test";
import { FileReport, LanguageInterface, LinesReport } from "../../languageInterface";
import { LibraryInterface } from "../../libraryInterface";

export class JestLibrary implements LibraryInterface {
    public importLibraries = [];
    public name = "Jest";
    public coverageReportUI = false;

    constructor(public parent: LanguageInterface) { }

    public extractFilesPercentages(htmlData: string): FileReport {
        return {
            filename: "",
            percent: 0
        };
    }

    public extractLinesPercentages(htmlData: string): LinesReport {
        return {
            notHandled: [],
            notTested: [],
            tested: []
        };
    }

    public runCoverageReport(dirpath: string, cwd: string): void {
        
    }

    public getTestFormat(testName: string, suiteName: string, data: string): ChangeReport {
        return {
            content: "",
            encoding: "utf-8",
            appendToFile: true
        };
    }

    public addTestToFile(rootPath: string): void {
        
    }

    public getImportLibraries(): string[] {
        return this.importLibraries;
    }

}