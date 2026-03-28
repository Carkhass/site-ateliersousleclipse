import { defineCollection, z } from 'astro:content';

const couteaux = defineCollection({
  type: 'data',
  schema: z.object({
    titre: z.string(),
    type: z.string().optional(),
    format: z.string().optional(),
    description: z.string().optional(),
    image: z.string(),
    prix: z.number().nullable(), // Changé en nullable pour tes commandes persos
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

export const collections = { couteaux };