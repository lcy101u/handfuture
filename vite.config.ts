import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep ads.txt in root without hash
          if (assetInfo.name === 'ads.txt') {
            return '[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
