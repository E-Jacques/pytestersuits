import { LanguageInterface } from "./extension_func/languageInterface";
import PythonHandler from "./extension_func/language/PythonHandler";
import JavascriptHandler from "./extension_func/language/JavascriptHandler";

interface HashTable {
    [key: string]: typeof PythonHandler | typeof JavascriptHandler;
}

let hashTable: HashTable = {};
hashTable["py"] = PythonHandler;
hashTable["js"] = JavascriptHandler;

export function getDefaultLanguage(): LanguageInterface {
    return new hashTable[Object.keys(hashTable)[0]]();
}

export function getLanguageFromExt(ext: string): LanguageInterface {
    if (Object.keys(hashTable).includes(ext)) {
        return new hashTable[ext]();
    }

    return getDefaultLanguage();
}