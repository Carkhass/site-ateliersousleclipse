import { defineCollection, z } from 'astro:content';

// 1. On définit la structure (le schéma) de tes couteaux
// Il doit correspondre aux champs que tu as mis dans Keystatic
const couteaux = defineCollection({
  type: 'data', // 'data' car on utilise du JSON (pas du Markdown)
  schema: z.object({
    titre: z.string(),
    description: z.string(),
    image: z.string(), 
    prix: z.number().optional().nullable(), // .nullable() aide si le champ est vide
    lienInstagram: z.string().url(),
    date: z.string(),
  }),
});

// 2. On exporte la collection pour qu'Astro la reconnaisse
export const collections = {
  'couteaux': couteaux,
};