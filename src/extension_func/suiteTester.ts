export interface SuitTester {
    containsSuite (data: string, suiteName: string): boolean;
    insertIntoSuite(data: string, testFormat: string, suiteName: string): string;
}