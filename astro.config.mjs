import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import keystatic from '@keystatic/astro';
import { fileURLToPath } from 'node:url';

import react from '@astrojs/react';

export default defineConfig({
  // On repasse en 'static', le mode d'origine de ton site
  output: 'static', 
  integrations: [tailwind(), keystatic({ 
      admin: process.env.NODE_ENV === 'development' || !!process.env.VERCEL 
    }), react()],
  vite: {
    resolve: {
      alias: { 
        '@': fileURLToPath(new URL('./src', import.meta.url)) 
      }
    },
    build: {
      assetsInlineLimit: 0
    }
  }
});