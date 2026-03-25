import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    couteaux: collection({
      label: 'Mes Couteaux',
      // On utilise ce champ comme ID pour que Keystatic n'efface plus le 'titre'
      slugField: 'slug_technique', 
      path: 'src/content/couteaux/*',
      format: { data: 'json' },
      schema: {
        // Champ technique pour Keystatic (il sera supprimé du JSON, c'est normal)
        slug_technique: fields.text({ 
          label: 'ID de la fiche (ne pas toucher)',
          defaultValue: 'fiche-couteau',
        }),
        
        // Ce champ sera enfin sauvegardé dans le JSON car ce n'est plus le slugField
        titre: fields.text({ label: 'Nom du modèle (Titre)' }),
        
        description: fields.text({ label: 'Caractéristiques', multiline: true, isOptional: true }),
        image: fields.text({ label: 'Chemin de la photo' }),        
        prix: fields.number({ label: 'Prix (en €)' }),
        lienInstagram: fields.url({ label: 'Lien Insta' }),
        date: fields.date({ label: 'Date du post' }),
        disponible: fields.checkbox({ 
          label: 'Disponible à la vente',
          defaultValue: false 
        }),
        last_update: fields.text({ label: 'Dernière synchro n8n' }),
      },
    }),
  },
});