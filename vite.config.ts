import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
// Support for svg image react components
import svgrPlugin from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // const isProduction = mode === "production";
  // const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), svgrPlugin()],
    server: {
      strictPort: true,
      cors: {
        origin: true,
        credentials: true,
      },
      hmr: {
        host: "localhost",
        protocol: "ws",
        port: 24678
      }
    },
    build: {
      outDir: "src/server/dist",
      emptyOutDir: true,
      copyPublicDir: true,
    },
  };
});
