import env from "@backend/src/config/env.js";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sqlClient = neon(env.DATABASE_URL);
const db = drizzle({ client: sqlClient });

export default db;