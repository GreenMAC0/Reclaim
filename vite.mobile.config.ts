import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// A client-only bundle for Capacitor. The Cloudflare build stays in vite.config.ts.
export default defineConfig({
  root: "mobile",
  publicDir: "../public",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  define: { "import.meta.env.VITE_NATIVE_BUILD": JSON.stringify("true") },
  build: { outDir: "../dist-mobile", emptyOutDir: true },
});
