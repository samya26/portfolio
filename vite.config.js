import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2019',
    // fonts are embedded in the CSS so the site works on any host
    assetsInlineLimit: (file) => file.endsWith('.woff2') ? true : undefined,
    chunkSizeWarningLimit: 900,
  },
})
