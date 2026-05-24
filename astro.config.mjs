import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import keystatic from '@keystatic/astro';
import { fileURLToPath } from 'node:url';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap'; 

// On vérifie si on est en train de travailler en local
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  // URL de ton site (Crucial pour le SEO et le sitemap)
  site: 'https://ateliersousleclipse.fr', 

  // Mode statique pur pour l'hébergement OVH
  output: 'static', 

  // 👇 1. L'ACTIVATION DU MULTILINGUISME (i18n) 👇
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en"],
    routing: {
      prefixDefaultLocale: false, // Le français reste sur la racine (pas de /fr/)
      strategy: "pathname" // Active le routage par dossier (ex: /en/couteaux)
    }
  },

  integrations: [
    tailwind(), 
    react(),
    // 👇 2. LE SITEMAP OPTIMISÉ POUR LE SEO INTERNATIONAL 👇
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: {
          fr: 'fr-FR',
          en: 'en-US', // Indique à Google les régions ciblées
        },
      },
    }), 
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