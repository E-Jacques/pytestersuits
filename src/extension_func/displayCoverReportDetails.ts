export type FilesReport = {
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
export function extractFilesPercentages (data: string): FilesReport[] {
    let filesReport: FilesReport[] = [];
    
    return filesReport;
}

/**
 * Should work with pytest's individal file cover report.
 */
export function extractLinesPercentages (data: string): LinesReport {
    let linesReport: LinesReport = {
        tested: [],
        notTested: [],
        notHandled: []
    };

    return linesReport;
}

/**
 * Should work with pytest's individal file cover report.
 */
export function moveLinesPercentages (data: string, changeStartLine: number, changeEndLine: number): LinesReport {
    let linesReport = extractLinesPercentages(data);

    return linesReport;
}