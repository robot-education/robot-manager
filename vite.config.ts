import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Support for svg image react components
import svgrPlugin from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgrPlugin()],
    build: {
        outDir: "src/server/dist",
        emptyOutDir: true,
        copyPublicDir: true,
    },
    server: {
        strictPort: true,
        hmr: {
            host: "localhost",
            protocol: "ws",
        },
    },
});
