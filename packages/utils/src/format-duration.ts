export type DurationFormatOptions = {
    format: "long" | "short" | "digital";
    includeZeroValues?: boolean;
}
export type ParsedDuration = {
    hours: number;
    minutes: number;
    seconds: number;
}

export function parseDuration(duration: number): ParsedDuration {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    return { hours, minutes, seconds };
}

export function formatDuration({ hours, minutes, seconds }: ParsedDuration, options: DurationFormatOptions) {
    const { format, includeZeroValues = false } = options
    switch (format) {
        case "short":
            const shortResult = [
                includeZeroValues || hours > 0 ? `${hours}h` : null,
                includeZeroValues || minutes > 0 ? `${minutes}m` : null,
                includeZeroValues || seconds > 0 ? `${seconds}s` : null,
            ]
                .filter(Boolean)
                .join(" ");
            return shortResult || "0s";

        case "long":
            const longResult = [
                includeZeroValues || hours > 0
                    ? `${hours} hour${hours !== 1 ? "s" : ""}`
                    : null,

                includeZeroValues || minutes > 0
                    ? `${minutes} minute${minutes !== 1 ? "s" : ""}`
                    : null,

                includeZeroValues || seconds > 0
                    ? `${seconds} second${seconds !== 1 ? "s" : ""}`
                    : null,
            ]
                .filter(Boolean)
                .join(" ");
            return longResult || "0 seconds";

        case "digital":
            return [
                (includeZeroValues || hours > 0) ? String(hours).padStart(2, "0") : null,
                String(minutes).padStart(2, "0"),
                String(seconds).padStart(2, "0"),
            ].filter(Boolean).join(":");
    }
} 