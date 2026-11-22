import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'en mí', short_name: 'en mí', lang: 'es', description: 'Un momento para volver a ti',
      display: 'standalone', orientation: 'portrait', start_url: '/', theme_color: '#4a2a63', background_color: '#4a2a63',
      icons: [192, 512].map(n => ({ src: `/icon-${n}.png`, sizes: `${n}x${n}`, type: 'image/png', purpose: 'any' }))
        .concat({ src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }),
    },
    workbox: { globPatterns: ['**/*.{js,css,html,png,svg,wav,woff2}'] },
  })],
})
