import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*"],
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/test/**"],
    }),
  ],
  build: {
    lib: {
      // "monaco" is a separate entry so that importing the main one never pulls
      // in the optional @monaco-editor/react / monaco-editor peers.
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        monaco: resolve(__dirname, "src/monaco/index.ts"),
      },
      name: "ReactHTMLContentEditor",
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        `${entryName}.${format === "es" ? "mjs" : "cjs"}`,
      // Keep the published CSS asset name stable (Vite 8 otherwise names it
      // after the package): consumers import "…/dist/style.css".
      cssFileName: "style",
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@monaco-editor/react",
        "monaco-editor",
        "lucide-react",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime",
          "@monaco-editor/react": "MonacoEditor",
          "monaco-editor": "monaco-editor",
          "lucide-react": "LucideReact",
        },
      },
    },
    sourcemap: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    testTimeout: 15000, // Increase timeout for property-based tests
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test/", "**/*.test.ts", "**/*.test.tsx"],
    },
  },
});
