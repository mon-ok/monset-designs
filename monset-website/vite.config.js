import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // relative paths, so the build works from any folder or host, not just a domain root
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/[\/](react|react-dom|scheduler)[\/]/.test(id)) return "react";
          if (id.includes("motion")) return "motion";
          if (id.includes("animejs")) return "anime";
          if (id.includes("lenis")) return "lenis";
        },
      },
    },
  },
  // "@/..." is the import style Kokonut UI components expect
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
