import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import keystatic from '@keystatic/astro';
import { fileURLToPath } from 'node:url';
import react from '@astrojs/react';

// On vérifie si on est en train de travailler en local (npm run dev)
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  // Mode statique pur pour l'hébergement OVH
  output: 'static', 
  
  integrations: [
    tailwind(), 
    react(),
    // Keystatic n'est chargé QUE sur ton PC (isDev). 
    // Sur GitHub, l'intégration est absente, donc pas d'erreur SSR.
    ...(isDev ? [keystatic()] : []),
  ],

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