import { defineCollection, z } from 'astro:content';

// Collection pour tes couteaux (existante)
const couteaux = defineCollection({
  type: 'data',
  schema: z.object({
    titre: z.string(),
    type: z.string().optional(),
    format: z.string().optional(),
    description: z.string().optional(),
    image: z.string(),
    prix: z.number().nullable(),
    disponible: z.boolean(),
    date: z.string(),
    lienInstagram: z.string().url().optional().nullable(),
    caracteristiques: z.object({
      acier: z.string().optional().nullable(),
      manche: z.string().optional().nullable(),
    }).optional(), 
    details_evenement: z.object({
      lieu: z.string().nullable().optional(),
      date: z.string().nullable().optional(),
    }).optional(),
  }),
});

// NOUVELLE COLLECTION : Actualités et Agenda
const actus = defineCollection({
  type: 'data',
  schema: z.object({
    titre: z.string(),
    date: z.string(), // Format YYYY-MM-DD
    type: z.enum(['evenement', 'instagram']),
    lieu: z.string().optional(), // Utile pour l'agenda
    image: z.string(),
    lienInstagram: z.string().url().optional().nullable(),
  }),
});

// Export des deux collections
export const collections = { 
  'couteaux': couteaux,
  'actus': actus 
};