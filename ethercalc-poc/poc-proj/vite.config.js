import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createProxyMiddleware } from 'http-proxy-middleware'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/ethercalc': {
        target: process.env.VITE_ETHERCALC_URL || 'https://ethercalc.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ethercalc/, '')
      }
    }
  }
})