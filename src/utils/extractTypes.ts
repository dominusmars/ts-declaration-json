// Extracts type from text  EX: key: type;  extracts type
export function extractTypeFromString(nodeString: string) {
    // Use a regular expression to match the type
    const typeMatch = nodeString.match(/:\s*([^;]+);/);
    // If no match is found, return "any"
    // Change this if it causes  problems later
    if (!typeMatch) {
        return "any";
    }

    let match = typeMatch[1].trim();
    if (match.includes("|")) {
        let types = match.split("|");
        let result = types.map((value) => value.trim());
        return result;
    }

    return match;
}
