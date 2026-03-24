import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    couteaux: collection({
      label: 'Mes Couteaux',
      slugField: 'titre',
      path: 'src/content/couteaux/*',
      format: { data: 'json' },
      schema: {
        titre: fields.slug({ name: { label: 'Nom du modèle' } }),
        description: fields.text({ label: 'Caractéristiques', multiline: true }),
        image: fields.image({
          label: 'Photo',
          directory: 'public/images/couteaux',
          publicPath: '/images/couteaux/',
        }),        
        // Maintenant on ajoute le prix et les autres champs au même niveau
        prix: fields.number({ label: 'Prix (en €)' }),
        lienInstagram: fields.url({ label: 'Lien Insta' }),
        date: fields.date({ label: 'Date du post' }),
      },
    }),
  },
});