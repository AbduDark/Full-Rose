import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
  },
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // مفيد لـ WSL أو بيئات افتراضية
    },
  },
  optimizeDeps: {
    include: ["react-player", "tailwindcss"], // تحسين تبعيات react-player و tailwindcss
  },
});