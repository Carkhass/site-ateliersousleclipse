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

        type: fields.select({
          label: 'Type de fiche',
          options: [
            { label: 'Post Instagram', value: 'insta' },
            { label: 'Modèle de Référence (Permanent)', value: 'modele' },
          ],
          defaultValue: 'insta',
        }),
        
        description: fields.text({ label: 'Caractéristiques / Histoire', multiline: true }),

        // Ajout du bloc caractéristiques
        caracteristiques: fields.object({
          acier: fields.text({ label: 'Acier (ex: C125U, XC75...)' }),
          manche: fields.text({ label: 'Matière du manche' }),
        }, {
          label: 'Détails techniques',
          description: 'Extraits automatiquement ou saisis manuellement'
        }),
        
        image: fields.text({ label: 'Photo principale (URL ou chemin)' }),

        galerie: fields.array(
          fields.text({ label: 'Chemin photo sup.' }),
          {
            label: 'Galerie Photos (pour Modèles)',
            itemLabel: props => props.value
          }
        ),
        
        prix: fields.number({ label: 'Prix (€)' }),
        lienInstagram: fields.url({ label: 'Lien Insta', isOptional: true }),
        date: fields.date({ label: 'Date' }),
        disponible: fields.checkbox({ label: 'Disponible à la vente', defaultValue: false }),
        last_update: fields.text({ label: 'Dernière synchro' }),
      },
    }),
  },
});