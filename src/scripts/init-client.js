// src/scripts/init-client.js

export default function initClient() {
  if (typeof window === 'undefined') return; // Sécurité SSR

  // Swipers statiques + Lightbox (import dynamique)
  import('./init-swiper-glightbox.js').then(({ initSwiper, initLightbox }) => {
    if (typeof initSwiper === 'function') initSwiper();
    if (typeof initLightbox === 'function') initLightbox();
  }).catch(err => {
    console.error('Erreur lors du chargement de Swiper/GLightbox :', err);
  });

  // Carrousels dynamiques
  import('./observer-carousels.js').then(({ observeCarousels }) => {
    if (typeof observeCarousels === 'function') observeCarousels();
  }).catch(err => {
    console.error('Erreur lors du chargement des carrousels dynamiques :', err);
  });

  // Relancer l'observation des nouveaux éléments si dispo
  if (typeof window.observeNewElements === 'function') {
    window.observeNewElements();
  }
}
