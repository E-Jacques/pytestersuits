import { LanguageInterface } from "./extension_func/languageInterface";
import PythonHandler from "./extension_func/language/PythonHandler";
import TypescriptHandler from "./extension_func/language/TypescriptHandler";

interface HashTable {
    [key: string]: typeof PythonHandler | typeof TypescriptHandler;
}

let hashTable: HashTable = {};
hashTable["py"] = PythonHandler;
hashTable["ts"] = TypescriptHandler;

export function getDefaultLanguage(): LanguageInterface {
    return new hashTable[Object.keys(hashTable)[0]]();
}

export function getLanguageFromExt(ext: string): LanguageInterface {
    if (Object.keys(hashTable).includes(ext)) {
        return new hashTable[ext]();
    }

    return getDefaultLanguage();
}