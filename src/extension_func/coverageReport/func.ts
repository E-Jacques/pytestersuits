import { parse } from "node-html-parser";

export type FileReport = {
    filename: string,
    percent: number
};

export type LinesReport = {
    tested: number[],
    notTested: number[],
    notHandled: number[]
};

/**
 * Should work with pytest's index.html cover report file.
 */
export function extractFilesPercentages(data: string): FileReport[] {
    let filesReport: FileReport[] = [];
    let html = parse(data);
    let fileList = html.querySelectorAll("tr.file");

    for (let file of fileList) {
        let nameDOM = file.querySelector("td.name");
        let percentDOM = file.querySelector("td.right");
        if (nameDOM === null || percentDOM === null) {
            filesReport.push({
                filename: "ERROR",
                percent: -1
            });
            continue;
        }

        let fileReport = {
            filename: nameDOM.textContent,
            percent: Number.parseInt(percentDOM.textContent),
        };

        filesReport.push(fileReport);
    }

    return filesReport;
}

/**
 * Should work with pytest's individal file cover report.
 */
export function extractLinesPercentages(data: string): LinesReport {
    let linesReport: LinesReport = {
        tested: [],
        notTested: [],
        notHandled: []
    };

    let html = parse(data);
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

/**
 * Should work with pytest's individal file cover report.
 */
export function moveLinesPercentages(data: string, changeStartLine: number, changeEndLine: number): LinesReport {
    let linesReport = extractLinesPercentages(data);
    let diff = changeEndLine - changeStartLine;

    if (diff < 0) {
        throw new Error("End line couldn't be inferior to start line.");
    }

    let increment = ((a: number) => a >= changeStartLine ? a + diff : a);

    linesReport.tested = linesReport.tested.map(increment);
    linesReport.notTested = linesReport.notTested.map(increment);
    linesReport.notHandled = [...Array(diff).keys()].map(a => a + changeStartLine);

    return linesReport;
}
