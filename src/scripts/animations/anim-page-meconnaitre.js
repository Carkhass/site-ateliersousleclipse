export const initArtisanParallax = () => {
  const items = document.querySelectorAll('.js-parallax-item');
  
  const handleScroll = () => {
    if (window.innerWidth >= 1024) return;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // On vérifie si l'élément est visible dans le viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        // scrollProgress va de 0 (entre en bas) à 1 (sort en haut)
        const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
        
        // AMPLITUDE : 60px de décalage par rapport au centre (120px de course totale)
        // L'image de gauche (index pair) descend, la deuxième (impair) monte
        const speed = index % 2 === 0 ? 60 : -60;
        const translateY = (scrollProgress - 0.5) * speed;

        const container = item.querySelector('.pivot-container');
        if (container) {
          // translate3d pour l'accélération matérielle et un rendu sans aliasing
          container.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
        }
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Appel immédiat pour positionner les éléments au chargement
  handleScroll();
};