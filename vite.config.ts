import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/mainnet-api': {
        target: 'https://mainnet-internal-api.explorer.app5.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mainnet-api/, ''),
      },
      '/testnet-api': {
        target: 'https://testnet-internal-api.explorer.app5.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/testnet-api/, ''),
      },
    },
  }
})