import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        proxy: {
            "/api": "http://127.0.0.1:30000/",

            "/broadcast": {
                target: "ws://127.0.0.1:30000",
                changeOrigin: true,
                ws: true,
            },
        },
    },
});
