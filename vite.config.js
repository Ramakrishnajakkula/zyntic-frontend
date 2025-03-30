import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"/zyntic-frontend",
  server: {
    port: 5173,    
  },
  proxy: {
    '/api': {
      target: 'http://zyntic-backend.vercel.app/',
      changeOrigin: true,
      secure: false,
    },
  },
  
})
