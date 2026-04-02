import { defineCollection, z } from 'astro:content';

// 1. Collection COUTEAUX
const couteaux = defineCollection({
  type: 'data',
  schema: z.object({
    titre: z.string(),
    univers: z.enum(['Gastronomie', 'Aventure', 'Quotidien', 'Exception']).default('Quotidien'),
    // On s'assure que format accepte tout (string, null, ou absent)
    format: z.string().or(z.null()).optional(), 
    type: z.string().or(z.null()).optional(),
    description: z.string().or(z.null()).optional(),
    image: z.preprocess((val) => {
       if (typeof val === 'string') return [val];
       return val;
    }, z.array(z.string())), 
    prix: z.number().nullable().default(0),
    disponible: z.union([z.boolean(), z.string()]).transform(val => val === true || val === "true").default(true),
    date: z.string(),
    lienInstagram: z.string().url().optional().nullable().or(z.literal("")),
    caracteristiques: z.object({
      acier: z.string().optional().nullable(),
      manche: z.string().optional().nullable(),
    }).optional(),
    last_update: z.string().optional().nullable(),
  }),
});

// 2. Collection ACTUS (Salons, Marchés)
const actus = defineCollection({
  type: 'data',
  schema: z.object({
    titre: z.string(),
    date: z.string(), // Date de publication
    date_event: z.string().optional().nullable(), // LA DATE DU MARCHÉ
    date_formattee: z.string().optional().nullable(), 
    type: z.enum(['evenement', 'instagram']),
    lieu: z.string().optional().nullable(),
    description: z.string().optional().nullable(), // Ajouté pour correspondre au JSON
    image: z.string(),
    lienInstagram: z.string().url().optional().nullable().or(z.literal("")),
  }),
});

// 3. NOUVEAU : Collection DIVERS (Coulisses, Rencontres, Savoir-faire)
const divers = defineCollection({
  type: 'data',
  schema: z.object({
    titre: z.string(),
    date: z.string(),
    tags: z.array(z.string()).optional(), // Ex: ["Japon", "Affûtage", "Rencontre"]
    description: z.string(),
    image: z.preprocess((val) => {
  if (typeof val === 'string') return [val];
  return val;
}, z.array(z.string())),
    lienInstagram: z.string().url().optional().nullable().or(z.literal("")),
  }),
});

export const collections = { 
  'couteaux': couteaux,
  'actus': actus,
  'divers': divers
};