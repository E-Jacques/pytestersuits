import { LibraryInterface } from "./libraryInterface";

export interface CustomImportFunction {
    importTestLibrary(filename: string, data: string, encoding: "utf-8"): void;
}

export function isCustomImportFunctionImplementation(classToTest: LibraryInterface): boolean {
    return "importTestLibrary" in (classToTest as any);
}