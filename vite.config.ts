import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  // Mantendo apenas os plugins essenciais para o build passar
  plugins: [react()],
  resolve: {
    alias: {
      // Se o processo estiver dentro de 'client', o src está aqui mesmo
      "@": path.resolve(import.meta.dirname, "src"),
      // O shared está um nível acima
      "@shared": path.resolve(import.meta.dirname, "../shared"),
      // O assets está um nível acima
      "@assets": path.resolve(import.meta.dirname, "../attached_assets"),
    },
  },
  // Na Vercel com Root Directory 'client', o root deve ser o diretório atual
  root: import.meta.dirname,
  build: {
    // Pasta padrão que a Vercel espera
    outDir: "../dist",
    emptyOutDir: true,
  },
});