import { PythonHandler } from "./extension_func/language/PythonHandler";
import { LanguageInterface } from "./extension_func/languageInterface";

interface HashTable {
    [key: string]: LanguageInterface;
}

let hashTable: HashTable = {};
hashTable["py"] = new PythonHandler();

export default hashTable;