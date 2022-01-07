import { LanguageInterface } from "./extension_func/languageInterface";
import * as PythonHandler from "./extension_func/language/PythonHandler";
import * as JavascriptHandler from "./extension_func/language/JavascriptHandler";

interface HashTable {
    [key: string]: any;
}

let hashTable: HashTable = {};
hashTable["py"] = PythonHandler.PythonHandler;
hashTable["js"] = JavascriptHandler.JavascriptHandler;

export function getDefaultLanguage (): LanguageInterface {
    return hashTable[Object.keys(hashTable)[0]];
}

export function getLanguageFromExt(ext: string): LanguageInterface {
    if (Object.keys(hashTable).includes(ext)) {
        return hashTable[ext];
    }

    return getDefaultLanguage();
}