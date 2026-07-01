import * as z from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_BACKEND_URL: z.url({ error: "NEXT_PUBLIC_BACKEND_URL is either missing or invalid" }),
    NEXT_PUBLIC_AUTH_BASE_PATH: z
        .string()
        .startsWith("/", {
            error: "NEXT_PUBLIC_AUTH_BASE_PATH must start with '/'",
        }),
});

const parsed = envSchema.safeParse({
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_AUTH_BASE_PATH: process.env.NEXT_PUBLIC_AUTH_BASE_PATH,
});

if (!parsed.success) {
    console.error(parsed.error)
    throw new Error("Invalid environment variables");
}

const env = parsed.data;

export default env;