import { PythonHandler } from "./extension_func/language/PythonHandler";
import { LanguageInterface } from "./extension_func/languageInterface";

interface HashTable {
    [key: string]: LanguageInterface;
}

let hashTable: HashTable = {};
hashTable["py"] = new PythonHandler();

export default hashTable;

export function getDefaultLanguage (): LanguageInterface {
    return hashTable[Object.keys(hashTable)[0]];
}

export function getLanguageFromExt(ext: string): LanguageInterface {
    if (Object.keys(hashTable).includes(ext)) {
        return hashTable[ext];
    }

    return getDefaultLanguage();
}