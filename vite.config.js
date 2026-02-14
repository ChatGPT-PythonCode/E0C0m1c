import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom domain (eoguides.com): keep base '/'
// github.io/<repo>/ (project pages): set base to '/dddd/'
export default defineConfig({
  plugins: [react()],
  base: '/'
})
