import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths"; // Import the plugin

export default defineConfig({
  plugins: [
    react(), 
    tsconfigPaths() // Add it here
  ],
  resolve: {
    // Manually defining it as a backup is also safe
    alias: {
      "~": "/src",
      "@": "/src"
    }
  }
});