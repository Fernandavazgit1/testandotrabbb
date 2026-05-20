import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".",
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        recursos: resolve(__dirname, "recursos.html"),
        integrar: resolve(__dirname, "integrar.html"),
      },
    },
  },
});
