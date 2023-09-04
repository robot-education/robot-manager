import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import viteTsconfigPaths from "vite-tsconfig-paths";
// Support for svg image react components
import svgrPlugin from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig((env) => {
  const isProduction = env.mode === "production";
  return {
    plugins: [react(), svgrPlugin()],
    server: {
      // https only in development, since GCP doesn't need https
      https: !isProduction,
      strictPort: true,
    },
    build: {
      outDir: "src/server/dist",
      emptyOutDir: true,
      copyPublicDir: true,
    },
  };
});
