import { LinesReport } from "../languageInterface";

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
