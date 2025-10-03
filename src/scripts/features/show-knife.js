import EmblaCarousel from 'embla-carousel';

/**
 * Initialise un bloc couteau (main + thumbs) donné.
 * @param {Element} block - Le conteneur du bloc (ex: .knife-gallery .grid)
 */
export function initKnifeGallery(block) {
  const mainViewport = block.querySelector('.embla-knife-main .embla-knife-viewport');
  const thumbsViewport = block.querySelector('.embla-knife-thumbs .embla-knife-viewport');
  if (!mainViewport || !thumbsViewport) return null;

  const mainEmbla = EmblaCarousel(mainViewport, { loop: true });
  const thumbsEmbla = EmblaCarousel(thumbsViewport, {
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const thumbsSlides = thumbsViewport.querySelectorAll('.embla-knife-slide');

  // Clic vignette → scroll main
  const handlers = [];
  thumbsSlides.forEach((slide, index) => {
    const handler = () => mainEmbla.scrollTo(index);
    slide.addEventListener('click', handler);
    handlers.push({ slide, handler });
  });

  // Synchro état actif
  const updateThumbs = () => {
    const selected = mainEmbla.selectedScrollSnap();
    thumbsSlides.forEach((slide, i) => {
      slide.classList.toggle('is-selected', i === selected);
    });
    thumbsEmbla.scrollTo(selected);
  };

  mainEmbla.on('select', updateThumbs);
  updateThumbs();

  // Retourne une API de nettoyage si besoin
  return {
    destroy() {
      handlers.forEach(({ slide, handler }) => slide.removeEventListener('click', handler));
      mainEmbla.destroy();
      thumbsEmbla.destroy();
    },
    mainEmbla,
    thumbsEmbla,
  };
}

/**
 * Initialise tous les blocs couteaux présents dans la section.
 * @returns {Array} - Liste des instances avec leurs APIs de nettoyage.
 */
export function initKnifeGalleries() {
  const blocks = document.querySelectorAll('.knife-gallery .grid');
  const instances = [];
  blocks.forEach(block => {
    const instance = initKnifeGallery(block);
    if (instance) instances.push(instance);
  });
  return instances;
}

// Optionnel: auto-init si tu veux l’exécuter directement à l’import.
// Décommente si nécessaire:
// document.addEventListener('DOMContentLoaded', () => { initKnifeGalleries(); });
