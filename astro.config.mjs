import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import keystatic from '@keystatic/astro';
import { fileURLToPath } from 'node:url';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap'; // <-- 1. Importation du sitemap

// On vérifie si on est en train de travailler en local
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  // URL de ton site (Crucial pour le SEO et le sitemap)
  site: 'https://ateliersousleclipse.fr', 

  // Mode statique pur pour l'hébergement OVH
  output: 'static', 
  
  integrations: [
    tailwind(), 
    react(),
    sitemap(), // <-- 2. Ajout de l'intégration ici
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