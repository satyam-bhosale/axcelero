import env from "@backend/src/config/env.js";
import { configure, getConsoleSink, getJsonLinesFormatter, getLogger } from "@logtape/logtape";
import { getPrettyFormatter } from "@logtape/pretty";

export async function initLogger(){
    const lowestLevel = (env.NODE_ENV === 'production' || env.VERCEL_ENV === 'production') ? 'info' : 'debug';;
    await configure({
        sinks: {
            console: getConsoleSink({
                formatter:  (env.NODE_ENV === 'development' || env.VERCEL_ENV === 'development') ? getPrettyFormatter({
                    timestamp: "date-time-timezone",
                    timestampStyle: ["dim", "italic"],
                    categoryStyle: "dim",
                    categorySeparator: ".",
                    icons: false,
                    level: "FULL",
                    levelStyle: "bold"
                }) : getJsonLinesFormatter({
                    categorySeparator: "."
                })
            })
        },
        loggers: [
            {category: ["logtape", "meta"], sinks: ["console"], lowestLevel: "warning"},
            {category: ["drizzle-rom"], sinks: ["console"], lowestLevel: "info"},
            {category: ["app"], sinks: ["console"], lowestLevel}
        ]
    });
}

export const dbLogger = getLogger(["drizzle-orm"]);
export const appLogger = getLogger(["app"]);
export const authLogger = getLogger(["app", "auth"]);

