import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // MINAYSH_SPLIT_CHUNKS: split the code into 3 smaller files (libraries, product catalog, pages)
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
          if (/[\\/]src[\\/]data[\\/]/.test(id)) return 'catalog'
        },
      },
    },
  },
})
