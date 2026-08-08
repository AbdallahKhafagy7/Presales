export function normalizeSectionContent(content) {
    if (!content) return "";

    if (Array.isArray(content)) {
        const filtered = content
            .map(item => String(item).trim())
            .filter(Boolean);

        if (filtered.length === 0) return "";

        return filtered
            .map(item => `- ${item}`)
            .join("\n");
    }

    if (typeof content === "string") {
        return content.trim();
    }

    return String(content);
}