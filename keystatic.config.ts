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
        // 'titre' en simple text pour correspondre au format string de n8n
        titre: fields.text({ label: 'Nom du modèle (Titre)' }),
        
        description: fields.text({ label: 'Caractéristiques', multiline: true }),
        
        // 'image' en simple text car n8n gère déjà tout le chemin
        image: fields.text({ 
          label: 'Chemin de la photo', 
          description: 'Généré par n8n (ex: /images/couteaux/...)',
        }),        
        
        prix: fields.number({ label: 'Prix (en €)' }),
        
        lienInstagram: fields.url({ label: 'Lien Insta' }),
        
        date: fields.date({ label: 'Date du post' }),
        
        // C'est ce bloc qui manquait et qui causait l'erreur
        disponible: fields.checkbox({ 
          label: 'Disponible à la vente',
          description: 'Affiche le badge "Disponible"',
          defaultValue: false 
        }),
        
        last_update: fields.text({ 
          label: 'Dernière synchro n8n',
          description: 'Date technique de la mise à jour'
        }),
      },
    }),
  },
});