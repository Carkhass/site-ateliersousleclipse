import { defineCollection, z } from 'astro:content';

const couteaux = defineCollection({
  type: 'data', 
  schema: z.object({
    titre: z.string(),
    description: z.string(),
    image: z.string(), 
    // On autorise le nombre, le null ou l'absence de prix
    prix: z.number().optional().nullable(), 
    lienInstagram: z.string().url(),
    date: z.string(),
    // AJOUT : On déclare enfin le champ disponible !
    disponible: z.union([z.boolean(), z.string()]).optional(),
    // On peut aussi ajouter last_update pour être complet
    last_update: z.string().optional(),
  }),
});

export const collections = {
  'couteaux': couteaux,
};