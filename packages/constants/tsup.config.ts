import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    target: ["esnext"],
    format: ["esm"],
    outDir: "dist",
    sourcemap: true,
    minify: true,
    dts: true
})