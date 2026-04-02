import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: { kind: 'local' }, 
  collections: {
    couteaux: collection({
      label: 'Mes Couteaux',
      slugField: 'slug_technique', 
      path: 'src/content/couteaux/*',
      format: { data: 'json' },
      schema: {
        slug_technique: fields.text({ label: 'ID technique', defaultValue: 'fiche-couteau' }),
        titre: fields.text({ label: 'Nom du modèle (Titre)' }),
        format: fields.text({ label: 'Format (ex: photo, reel)' }), 

        type: fields.select({
          label: 'Type de fiche',
          options: [
            { label: 'Post Instagram', value: 'insta' },
            { label: 'Couteau (Photo)', value: 'couteau' },
            { label: 'Vidéo / Réel', value: 'video' },
            { label: 'Modèle de Référence (Permanent)', value: 'modele' },
          ],
          defaultValue: 'insta',
        }),
        
        description: fields.text({ label: 'Caractéristiques / Histoire', multiline: true }),

        caracteristiques: fields.object({
          acier: fields.text({ label: 'Acier (ex: C125U, XC75...)' }),
          manche: fields.text({ label: 'Matière du manche' }),
        }, {
          label: 'Détails techniques',
        }),
        
        image: fields.text({ 
          label: 'Photo principale (Chemin)',
          description: 'Le chemin s\'affiche ici. Pour voir l\'image, consultez le site ou ouvrez le dossier public/images.' 
        }),

        galerie: fields.array(
          fields.text({ label: 'Chemin photo sup.' }),
          {
            label: 'Galerie Photos (pour Modèles)',
            itemLabel: props => props.value
          }
        ),
        
        prix: fields.number({ label: 'Prix (€)' }),
        lienInstagram: fields.url({ label: 'Lien Insta', isOptional: true }),
        date: fields.text({ label: 'Date (YYYY-MM-DD)' }),
        disponible: fields.checkbox({ label: 'Disponible à la vente', defaultValue: false }),
        favori: fields.checkbox({ label: '⭐ Pièce Favorite (Ne jamais archiver)', defaultValue: false }),
        last_update: fields.text({ label: 'Dernière synchro' }),
      },
    }),

    actus: collection({
      label: 'Actualités & Évènements',
      slugField: 'titre',
      path: 'src/content/actus/*',
      format: { data: 'json' },
      schema: {
        titre: fields.text({ label: 'Titre de l\'évènement' }),
        date: fields.text({ label: 'Date de publication (YYYY-MM-DD)' }),
        date_event: fields.text({ label: 'Date réelle de l\'évènement (ex: 2026-04-05)' }),
        date_formattee: fields.text({ label: 'Date affichée (ex: 05/04/2026)' }),
        
        type: fields.select({
          label: 'Type',
          options: [
            { label: 'Évènement (Salon, Marché)', value: 'evenement' },
            { label: 'Post Instagram', value: 'instagram' },
          ],
          defaultValue: 'evenement',
        }),
        
        lieu: fields.text({ label: 'Lieu / Ville' }),
        description: fields.text({ label: 'Description courte', multiline: true }),
        image: fields.text({ label: 'Chemin de l\'image (ex: /images/actus/...) ' }),
        lienInstagram: fields.url({ label: 'Lien vers le post Instagram', isOptional: true }),
      },
    }),
  },
});