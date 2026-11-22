import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' keeps asset URLs relative, so the build works under https://<user>.github.io/SpotWise/
// app.html is a second HTML entry so Vite bundles its bento script in dev and in the build.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
        app: path.resolve(import.meta.dirname, 'app.html')
      }
    }
  }
})
