import { addExtensionToEnd, camelCaseToPythonString, getFileWithExtension } from "../../../func";
import { FileReport, LanguageInterface, LinesReport } from "../../languageInterface";
import { LibraryInterface } from "../../libraryInterface";
import { Pytest } from "./PytestLibrary";

export default class PythonHandler extends LanguageInterface {
    public fileExtension = "py";
    public testFileExtension = "py";
    public languageLibrary: LibraryInterface[] = [
        new Pytest(this)
    ];

    public normalizeStringToConvention(s: string): string {
        return camelCaseToPythonString(s);
    }
} 