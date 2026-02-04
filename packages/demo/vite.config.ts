import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Base path para GitHub Pages - ajuste o nome do repositório se necessário
  base:
    process.env.NODE_ENV === "production" ? "/react-html-content-editor/" : "/",
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    // Otimizações para produção
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
