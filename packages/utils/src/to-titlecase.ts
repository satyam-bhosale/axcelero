export function toTitleCase(str: string) {
    if (!str) return "";

    const result = str.split(/\s+/)
        .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

    return result;
}