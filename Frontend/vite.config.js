import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Set the development server port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Target backend server
        changeOrigin: true,
        secure: false, // Set to false if your backend is on http
      }
    }
  },
  resolve: {
    alias: {
      "@": "/src", // Alias for easier imports
    },
  },
});