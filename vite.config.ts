import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Détecter si on est sur Replit
const isReplit = !!process.env.REPL_ID || !!process.env.REPLIT_DOMAINS;

// Plugins de base
const plugins: any[] = [react()];

// Ajouter les plugins Replit uniquement si on est sur Replit
if (isReplit) {
  try {
    const runtimeErrorOverlay = (
      await import("@replit/vite-plugin-runtime-error-modal")
    ).default;
    plugins.push(runtimeErrorOverlay());

    if (process.env.NODE_ENV !== "production") {
      const { cartographer } = await import("@replit/vite-plugin-cartographer");
      const { devBanner } = await import("@replit/vite-plugin-dev-banner");
      plugins.push(cartographer(), devBanner());
    }
  } catch (e) {
    console.log("Replit plugins not available, skipping...");
  }
}

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
