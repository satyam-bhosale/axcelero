import { toTitleCase } from "@axcelero/utils";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
    return c.text(toTitleCase("heLLo hOnO!"));
});

export default app;