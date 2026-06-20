import app from "@backend/src/app.js";
import { serve } from "@hono/node-server";

serve({
    fetch: app.fetch,
    port: 3000
}, (info) => console.info(`Server is running on http://localhost:${info.port}`));