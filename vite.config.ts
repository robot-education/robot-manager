import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
// import viteTsconfigPaths from "vite-tsconfig-paths";
// Support for svg image react components
import svgrPlugin from "vite-plugin-svgr";
import http from "http";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // const isProduction = mode === "production";
  const env = loadEnv(mode, process.cwd(), "");
  // const server = http.createServer().listen();
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
        port: 24678,
        // clientPort: env.PORT ? parseInt(env.PORT) : 3000,
        // server: server
      }
    },
    build: {
      outDir: "src/dist",
      emptyOutDir: true,
      copyPublicDir: true,
    },
  };
});
