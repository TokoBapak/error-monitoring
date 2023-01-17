import {resolve, dirname} from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            provider: "c8"
        },
        alias: {
            "~": resolve(dirname(fileURLToPath(import.meta.url)))
        }
    },
});