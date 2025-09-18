// src/scripts/init/init-swiper-glightbox.js
// Initialisation centralisée pour Swiper et GLightbox
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import GLightbox from 'glightbox';

// Fonction d'initialisation exportée nommément
export function initSwipers(root = document) {
  const rootEl = (root instanceof Element) ? root : document;
  // Exemple générique : initialise tous les .swiper dans le scope donné
  const swiperNodes = rootEl.querySelectorAll('.swiper');
  swiperNodes.forEach((node) => {
    // Eviter double init : marque dataset
    if (node.dataset && node.dataset.swiperInit === 'true') return;
    if (node.dataset) node.dataset.swiperInit = 'true';

    // Configuration simple — adapte selon tes besoins
    const container = node.querySelector('.swiper-container') || node;
    const options = {
      loop: true,
      slidesPerView: 1,
      // ajouter tes options personnalisées ici
    };

    try {
      // eslint-disable-next-line no-new
      new Swiper(container, options);
    } catch (e) {
      console.warn('Swiper init failed for node', node, e);
    }
  });

  // Lightbox init (global)
  try {
    if (!window.GLightbox) {
      window.GLightbox = GLightbox && (GLightbox.default || GLightbox);
    }
    if (typeof window.GLightbox === 'function') {
      // create a global instance if needed
      window._glightboxInstance = window._glightboxInstance || window.GLightbox({ selector: '.glightbox' });
    }
  } catch (e) {
    console.warn('GLightbox init error', e);
  }
}
