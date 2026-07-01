import env from "@backend/src/config/env.js";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schemas/**/*.ts",
    out: "./src/db/migrations/",
    dbCredentials: {
        url: env.DATABASE_MIGRATION_URL
    }
});