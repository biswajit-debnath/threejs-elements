import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sphere: resolve(__dirname, 'sphere.html')
      }
    }
  },

  plugins: [tailwindcss()],
})
