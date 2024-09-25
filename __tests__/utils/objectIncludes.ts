export function objectIncludes(o: { [key: string]: any }, targetKey: string, lightSearch: boolean = true) {
    function search(subObject: { [key: string]: any }) {
        for (let k in subObject) {
            if (lightSearch) {
                if (k.includes(targetKey)) return true;
            } else if (k === targetKey) return true;

            if (typeof subObject[k] == "object" && search(subObject[k])) return true;
        }
        return false;
    }
    return search(o);
}
export function searchObjectForAllKeys(o: { [key: string]: any }, targetKeys: string[], lightSearch: boolean = true) {
    for (let k of targetKeys) {
        let result = objectIncludes(o, k, lightSearch);
        if (!result) return false;
    }
    return true;
}
