"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectIncludes = objectIncludes;
exports.searchObjectForAllKeys = searchObjectForAllKeys;
function objectIncludes(o, targetKey, lightSearch = true) {
    function search(subObject) {
        for (let k in subObject) {
            if (lightSearch) {
                if (k.includes(targetKey))
                    return true;
            }
            else if (k === targetKey)
                return true;
            if (typeof subObject[k] == "object" && search(subObject[k]))
                return true;
        }
        return false;
    }
    return search(o);
}
function searchObjectForAllKeys(o, targetKeys, lightSearch = true) {
    for (let k of targetKeys) {
        let result = objectIncludes(o, k, lightSearch);
        if (!result)
            return false;
    }
    return true;
}
