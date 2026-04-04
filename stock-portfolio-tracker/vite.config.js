import { resolve } from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "src",

  plugins: [tailwindcss()],

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        "stock-details": resolve(__dirname, "src/stock-details/index.html"),
      },
    },
  },
});
