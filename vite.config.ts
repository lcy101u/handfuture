import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const mediapipeHandsEsmInterop = () => ({
  name: "mediapipe-hands-esm-interop",
  enforce: "pre" as const,
  transform(code: string, id: string) {
    const [filePath] = id.split("?")
    if (!filePath.endsWith("/node_modules/@mediapipe/hands/hands.js")) {
      return null
    }

    return {
      code: `${code}\nexport const Hands = globalThis.Hands;`,
      map: null,
    }
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [mediapipeHandsEsmInterop(), react()],
  optimizeDeps: {
    exclude: ["@mediapipe/hands"],
  },
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
