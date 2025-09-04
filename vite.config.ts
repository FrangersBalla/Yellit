import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Yellit',
        short_name: 'Yellit',
        description: 'Say it like you mean it!',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
          // WINDOWS ICONS
          { src: 'windows11/SmallTile.scale-100.png', sizes: '71x71', type: 'image/png', purpose: 'any' },
          { src: 'windows11/SmallTile.scale-125.png', sizes: '89x89', type: 'image/png', purpose: 'any' },
          { src: 'windows11/SmallTile.scale-150.png', sizes: '107x107', type: 'image/png', purpose: 'any' },
          { src: 'windows11/SmallTile.scale-200.png', sizes: '142x142', type: 'image/png', purpose: 'any' },
          { src: 'windows11/SmallTile.scale-400.png', sizes: '284x284', type: 'image/png', purpose: 'any' },
          { src: 'windows11/Square150x150Logo.scale-100.png', sizes: '150x150', type: 'image/png', purpose: 'any' },
          { src: 'windows11/Square150x150Logo.scale-125.png', sizes: '188x188', type: 'image/png', purpose: 'any' },
          { src: 'windows11/Square150x150Logo.scale-150.png', sizes: '225x225', type: 'image/png', purpose: 'any' },
          { src: 'windows11/Square150x150Logo.scale-200.png', sizes: '300x300', type: 'image/png', purpose: 'any' },
          { src: 'windows11/Square150x150Logo.scale-400.png', sizes: '600x600', type: 'image/png', purpose: 'any' },
          { src: 'windows11/Wide310x150Logo.scale-100.png', sizes: '310x150', type: 'image/png', purpose: 'any' },
          { src: 'windows11/Wide310x150Logo.scale-125.png', sizes: '388x188', type: 'image/png', purpose: 'any' },
          { src: 'windows11/Wide310x150Logo.scale-150.png', sizes: '465x225', type: 'image/png', purpose: 'any' },
          { src: 'windows11/Wide310x150Logo.scale-200.png', sizes: '620x300', type: 'image/png', purpose: 'any' },
          { src: 'windows11/Wide310x150Logo.scale-400.png', sizes: '1240x600', type: 'image/png', purpose: 'any' },
          { src: 'windows11/LargeTile.scale-100.png', sizes: '310x310', type: 'image/png', purpose: 'any' },
          { src: 'windows11/LargeTile.scale-125.png', sizes: '388x388', type: 'image/png', purpose: 'any' },
          { src: 'windows11/LargeTile.scale-150.png', sizes: '465x465', type: 'image/png', purpose: 'any' },
          { src: 'windows11/LargeTile.scale-200.png', sizes: '620x620', type: 'image/png', purpose: 'any' },
          { src: 'windows11/LargeTile.scale-400.png', sizes: '1240x1240', type: 'image/png', purpose: 'any' },
          { src: 'windows11/SplashScreen.scale-100.png', sizes: '620x300', type: 'image/png', purpose: 'any' },
          { src: 'windows11/SplashScreen.scale-125.png', sizes: '775x375', type: 'image/png', purpose: 'any' },
          { src: 'windows11/SplashScreen.scale-150.png', sizes: '930x450', type: 'image/png', purpose: 'any' },
          { src: 'windows11/SplashScreen.scale-200.png', sizes: '1240x600', type: 'image/png', purpose: 'any' },
          { src: 'windows11/SplashScreen.scale-400.png', sizes: '2480x1200', type: 'image/png', purpose: 'any' },

          // ANDROID ICONS
          { src: 'android/android-launchericon-512-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'android/android-launchericon-192-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'android/android-launchericon-144-144.png', sizes: '144x144', type: 'image/png', purpose: 'any' },
          { src: 'android/android-launchericon-96-96.png', sizes: '96x96', type: 'image/png', purpose: 'any' },
          { src: 'android/android-launchericon-72-72.png', sizes: '72x72', type: 'image/png', purpose: 'any' },
          { src: 'android/android-launchericon-48-48.png', sizes: '48x48', type: 'image/png', purpose: 'any' },

          // iOS ICONS
          { src: 'ios/16.png', sizes: '16x16', type: 'image/png', purpose: 'any' },
          { src: 'ios/20.png', sizes: '20x20', type: 'image/png', purpose: 'any' },
          { src: 'ios/29.png', sizes: '29x29', type: 'image/png', purpose: 'any' },
          { src: 'ios/32.png', sizes: '32x32', type: 'image/png', purpose: 'any' },
          { src: 'ios/40.png', sizes: '40x40', type: 'image/png', purpose: 'any' },
          { src: 'ios/50.png', sizes: '50x50', type: 'image/png', purpose: 'any' },
          { src: 'ios/57.png', sizes: '57x57', type: 'image/png', purpose: 'any' },
          { src: 'ios/60.png', sizes: '60x60', type: 'image/png', purpose: 'any' },
          { src: 'ios/72.png', sizes: '72x72', type: 'image/png', purpose: 'any' },
          { src: 'ios/76.png', sizes: '76x76', type: 'image/png', purpose: 'any' },
          { src: 'ios/96.png', sizes: '96x96', type: 'image/png', purpose: 'any' },
          { src: 'ios/114.png', sizes: '114x114', type: 'image/png', purpose: 'any' },
          { src: 'ios/120.png', sizes: '120x120', type: 'image/png', purpose: 'any' },
          { src: 'ios/144.png', sizes: '144x144', type: 'image/png', purpose: 'any' },
          { src: 'ios/152.png', sizes: '152x152', type: 'image/png', purpose: 'any' },
          { src: 'ios/180.png', sizes: '180x180', type: 'image/png', purpose: 'any' },
          { src: 'ios/192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'ios/256.png', sizes: '256x256', type: 'image/png', purpose: 'any' },
          { src: 'ios/512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'ios/1024.png', sizes: '1024x1024', type: 'image/png', purpose: 'any' }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /.*\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          }
        ]
      }
    })
  ],
})
