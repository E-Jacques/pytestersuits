import { convertStringToCamelCase } from "../../../func";
import { LanguageInterface } from "../../languageInterface";
import { LibraryInterface } from "../../libraryInterface";
import { VSCTestLibrary } from "./VSCTestLibrary";

export default class TypescriptHandler extends LanguageInterface {
    public fileExtension = "ts";
    public testFileExtension = "test.ts";
    public languageLibrary: LibraryInterface[] = [
        new VSCTestLibrary(this)
    ];

    public normalizeStringToConvention(s: string): string {
        return convertStringToCamelCase(s);
    }
}