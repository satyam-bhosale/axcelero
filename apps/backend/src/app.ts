import { toTitleCase } from "@axcelero/utils";
import env from "@backend/src/config/env.js";
import { initLogger } from "@backend/src/config/logger.js";
import auth from "@backend/src/lib/auth.js";
import { honoLogger } from "@logtape/hono";
import { Hono } from "hono";
import { cors } from "hono/cors";

try {
	await initLogger();
} catch (error) {
	console.error("Failed to initialize the logger");
	process.exit(1);
}
const isProd = (env.NODE_ENV === 'production' || env.VERCEL_ENV === 'production');

const app = new Hono();

app.use("/auth/*", cors({
	origin: env.ALLOWED_ORIGINS,
	allowHeaders: ["Content-Type", "Authorization"],
	allowMethods: ["POST", "GET", "OPTIONS"],
	exposeHeaders: ["Content-Length"],
	maxAge: 600,
	credentials: true,
}),
);

app.use(honoLogger({
	category: ["app", "http"],
	level: isProd ? 'info' : 'debug',
	format: isProd ? "combined" : "dev",
	logRequest: true
}));

app.on(["POST", "GET"], "/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

app.get("/", (c) => {
    return c.text(toTitleCase("heLLo hOnO!"));
});

export default app;