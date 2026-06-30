import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    target: ["esnext"],
    format: ["esm"],
    sourcemap: true,
    outDir: "dist",
    minify: true,
    dts: true,
    treeshake: true
})