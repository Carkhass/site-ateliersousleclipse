import { defineCollection, z } from 'astro:content';

const couteaux = defineCollection({
  type: 'data', 
  schema: z.object({
    titre: z.string(),
    // AJOUT : On déclare le type pour le filtrage (modele, insta, etc.)
    type: z.string().optional(), 
    description: z.string(),
    image: z.string(), 
    prix: z.number().optional().nullable(), 
    lienInstagram: z.string().url(),
    date: z.string(),
    disponible: z.union([z.boolean(), z.string()]).optional(),
    last_update: z.string().optional(),
    // Optionnel : si tu veux aussi utiliser la galerie dans Astro plus tard
    galerie: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'couteaux': couteaux,
};