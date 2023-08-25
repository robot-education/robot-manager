import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import ssrPlugin from "vite-plugin-ssr/plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin(), ssrPlugin()],
  server: {
    port: 3000,
    watch: {
      ignored: [
        "node_modules/"
      ]
    },
  },
  build: {
    outDir: "../server/src/dist",
    emptyOutDir: true,
    copyPublicDir: true,
  },
});
