// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { AstroPWAIntegration } from '@vite-pwa/astro';

export default defineConfig({
  integrations: [
    react(),
    AstroPWAIntegration({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ゆびテン｜指点字学習',
        short_name: 'ゆびテン',
        description: 'パソコンやスマートホンで指点字の学習ができます',
        theme_color: '#0063cc',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/pwa-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        navigateFallback: '/',
        // サイズの大きいブラウザ用の一覧ページなどをプリキャッシュから除外
        globIgnores: ['**/braille-table/**/*.html'],
      },
    }),
  ],
});
