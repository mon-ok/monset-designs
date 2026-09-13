import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard Vite + React setup. The large .glb lives in /public so it is
// served as a static asset (fetched at runtime, not bundled).
export default defineConfig({
  plugins: [react()],
  server: { host: true, open: true },
});
