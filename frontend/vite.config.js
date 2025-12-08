import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        { from: /^\/$/, to: '/index.html' },
        { from: /^\/tech/, to: '/index.html' },
        { from: /^\/clothes/, to: '/index.html' },
        { from: /^\/all/, to: '/index.html' },
        { from: /./, to: '/index.html' } 
      ]
    },
  }
})