import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    server: {
        allowedHosts: ['*', "82a8-117-213-95-158.ngrok-free.app"]
    },
    plugins: [react(), tailwindcss()],
})
