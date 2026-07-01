import app from "@backend/src/app.js";
import env from "@backend/src/config/env.js";
import { serve } from "@hono/node-server";

serve({
    fetch: app.fetch,
    port: env.PORT
}, (info) => console.info(`Server is running on http://localhost:${info.port}`));