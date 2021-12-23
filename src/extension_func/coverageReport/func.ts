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
export function moveLinesPercentages(linesReport: LinesReport, changeStartLine: number, changeEndLine: number): LinesReport {
    let diff = changeEndLine - changeStartLine;

    let increment = ((a: number) => a >= changeStartLine ? a + diff : a);

    linesReport.notHandled = [...Array(diff + 1).keys()].map(a => a + changeStartLine);
    linesReport.tested = linesReport.tested.map(increment).filter(a => !linesReport.notHandled.includes(a));
    linesReport.notTested = linesReport.notTested.map(increment).filter(a => !linesReport.notHandled.includes(a));

    return linesReport;
}
