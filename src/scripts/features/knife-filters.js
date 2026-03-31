import { initRevealOnScroll } from '../animations/reveal-on-scroll.js';

export function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.knife-card');
  
  if (!buttons.length || !cards.length) return;

  function applyFilter(filter) {
    cards.forEach(card => {
      // Reset pour l'animation
      card.classList.remove('visible');
      
      const type = (card.getAttribute('data-type') || '').toLowerCase().trim();
      const isDispo = card.getAttribute('data-dispo') === 'true';
      const isVideo = type === 'video' || type.includes('vid');

      let show = false;

      switch(filter) {
        case 'all':
          // On affiche tout ce qui n'est PAS une vidéo (ton choix actuel)
          show = !isVideo;
          break;
        case 'video':
          show = isVideo;
          break;
        case 'dispo':
          // Disponible ET pas une vidéo
          show = isDispo && !isVideo;
          break;
        case 'modele':
          show = (type === 'modele');
          break;
        default:
          show = true;
      }

      if (show) {
        card.classList.remove('hidden');
        card.style.display = 'flex'; 
      } else {
        card.classList.add('hidden');
        card.style.display = 'none';
      }
    });
    
    // Relance le scroll reveal pour les éléments qui viennent d'apparaître
    setTimeout(() => {
      initRevealOnScroll();
    }, 100);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const filterValue = btn.getAttribute('data-filter');
      
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      applyFilter(filterValue);
    });
  });

  // Initialisation au chargement
  const activeBtn = document.querySelector('.filter-btn.active');
  if (activeBtn) {
    applyFilter(activeBtn.getAttribute('data-filter'));
  }
}