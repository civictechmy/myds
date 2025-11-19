import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Watch react package source for HMR
      ignored: ["!**/packages/react/src/**"],
    },
  },
});
