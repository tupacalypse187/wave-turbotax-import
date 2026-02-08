import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8501
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    // Increase chunk size warning limit (Recharts is ~500kB minified)
    chunkSizeWarningLimit: 600
  },
  esbuild: {
    legalComments: 'none'
  }
})
