import { execSync } from "child_process";
import parse from "node-html-parser";
import { camelCaseToPythonString } from "../../func";
import { FileReport, LanguageInterface, LinesReport } from "../languageInterface";

export class PythonHandler implements LanguageInterface {
    public fileExtension = "py";
    public testFileExtension = "py";
    public importLibraries = "import pytest"; 

    public runCoverageReport(dirpath: string, cwd: string): void {
        execSync("pytest --cov-report html --cov=" + dirpath, {
            cwd
        });
    }

    public normalizeStringToConvention(s: string): string {
        return camelCaseToPythonString(s);
    }

    public extractFilesPercentages(htmlData: string): FileReport {
        let originalFilenameMatch = htmlData.match(/<title>(.*)<\/title>/);
        if (originalFilenameMatch === null) { throw new Error("Bad format for coverage report file."); }
        let originalFilename = originalFilenameMatch[1].replace(/\s+/g, '').split(":")[0].substring(11);

        return {
            filename: originalFilename,
            percent: Number.parseInt(originalFilenameMatch[1].replace(/\s+/g, '').split(":")[1])
        };
    }

    public extractLinesPercentages(htmlData: string): LinesReport {
        let linesReport: LinesReport = {
            tested: [],
            notTested: [],
            notHandled: []
        };
    
        let html = parse(htmlData);
        let testedDOM = html.querySelectorAll("p.run");
        let notTestedDOM = html.querySelectorAll("p.mis");
    
        for (let t of testedDOM) {
            let lineDOM = t.querySelector("span.n");
            if (lineDOM === null) { continue; }
            linesReport.tested.push(Number.parseInt(lineDOM.innerText));
        }
    
        for (let nt of notTestedDOM) {
            let lineDOM = nt.querySelector("span.n");
            if (lineDOM === null) { continue; }
            linesReport.notTested.push(Number.parseInt(lineDOM.innerText));
        }
    
        return linesReport;
    }

    public addTest(testName: string): string {
        let testString = "";
        testString += "\n@pytest.mark.skip(reason=\"generated automaticly\")\n";
        testString += `def test_${testName}():\n\tpass\n`;
        return testString;
    }
} 