/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base can be overridden at build time for subpath hosting (e.g. GitHub Pages):
//   VITE_BASE=/repo/ npm run build
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
