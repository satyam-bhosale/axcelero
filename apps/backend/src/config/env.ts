import { configDotenv } from "dotenv";
import * as z from "zod";

if (!process.env.VERCEL) {
    configDotenv({ path: ".env" });
}


const ORIGIN_SCHEMA = z.string().refine(
    origin =>
        z.url().safeParse(origin).success ||
        /^https:\/\/[a-z0-9-]+\-\*\.vercel\.app$/i.test(origin),
    {
        error: "Must be a valid URL or a wildcard pattern (non-production only)"
    }
);

const envSchema = z.object({
    DATABASE_URL: z.url({ error: "DATABASE_URL is either missing or invalid" }),
    DATABASE_MIGRATION_URL: z.url({ error: "DATABASE_MIGRATION_URL is either missing or invalid" }),

    BETTER_AUTH_ALLOWED_HOSTS: z.string()
        .transform(val => val.split('')
            .map(host => host.trim())
            .filter(host => Boolean(host))),
    BETTER_AUTH_SECRET: z.string().regex(/[A-Za-z0-9]{32}$/, { error: "BETTER_AUTH_SECRET is either mising or invalid" }),

    GOOGLE_OAUTH_CLIENT_ID: z.string({error: "GOOGLE_OAUTH_CLIENT_ID is either missing or invalid"}).min(1, "GOOGLE_OAUTH_CLIENT_ID is missing"),
    GOOGLE_OAUTH_CLIENT_SECRET: z.string({error: "GOOGLE_OAUTH_CLIENT_SECRET is either missing or invalid"}).min(1, "GOOGLE_OAUTH_CLIENT_SECRET is missing"),

    UPSTASH_REDIS_REST_URL: z.url({ error: "UPSATSH_REDIS_REST_URL is either missing or invalid" }),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1, { error: "UPSATSH_REDIS_REST_TOKEN is either missing or invalid" }),

    RESEND_API_KEY: z.string({ error: "RESEND_API_KEY is either missing or invalid" })
        .min(1, "RESEND_API_KEY is missing")
        .regex(/^re_[A-Za-z0-9]+_[A-Za-z0-9]+$/, { error: "RESEND_API_KEY is invalid" }),
    SYSTEM_EMAIL_ID: z.email({error: "SYSTEM_EMAIL_ID is either missing or invalid"}),

    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    VERCEL_ENV: z.enum(['development', 'test', 'preview', 'production']).optional(),

    ALLOWED_ORIGINS: z.string()
        .transform(val => val.split(',')
            .map(origin => origin.trim())
            .filter(origin => Boolean(origin)))
        .pipe(z.array(ORIGIN_SCHEMA).nonempty("At least one valid origin is required")),
    PORT: z.coerce.number({ error: "PORT is either missing or invalid" }).default(3000)
});

const parsed = envSchema.safeParse(process.env);

if (parsed.error) {
    console.error("Failed to load env variables", z.treeifyError(parsed.error));
    console.error(parsed.error)
    process.exit(1);
}

const env = parsed.data;

export default env;