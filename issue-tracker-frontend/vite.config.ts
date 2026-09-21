import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true, // Fail if port 3000 is also taken, rather than trying 3001
    host: '127.0.0.1' // Force IPv4 to prevent the ::1 error
  }
})
