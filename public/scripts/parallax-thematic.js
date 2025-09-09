// public/scripts/parallax-knives.js
// Gestion des effets parallax pour la section couteaux - Version simplifiée

class ParallaxKnivesSection {
  constructor() {
    this.themeContainers = document.querySelectorAll('.knife-theme-container');
    this.knifeWindows = document.querySelectorAll('.knife-window');
    
    if (this.themeContainers.length === 0) return;
    
    this.init();
  }
  
  init() {
    this.setupBackgroundImages();
    this.setupIntersectionObserver();
    this.setupScrollListener();
    
    // Animation initiale après un délai
    setTimeout(() => {
      this.checkVisibleWindows();
    }, 500);
  }
  
  setupBackgroundImages() {
    // Configure simplement l'image de fond pour chaque fenêtre
    this.knifeWindows.forEach(window => {
      const bgWindow = window.querySelector('.knife-bg-window');
      const themeContainer = window.closest('.knife-theme-container');
      const bgImage = themeContainer.dataset.bgImage;
      
      if (bgWindow && bgImage) {
        bgWindow.style.backgroundImage = `url('${bgImage}')`;
      }
    });
  }
  
  setupIntersectionObserver() {
    // Observer pour les animations d'apparition
    const windowObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '50px'
    });
    
    this.knifeWindows.forEach(window => {
      windowObserver.observe(window);
    });
    
    // Observer pour optimiser les animations parallax
    this.parallaxObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const container = entry.target;
        if (entry.isIntersecting) {
          container.dataset.parallaxActive = 'true';
        } else {
          container.dataset.parallaxActive = 'false';
        }
      });
    }, {
      threshold: 0,
      rootMargin: '100px'
    });
    
    this.themeContainers.forEach(container => {
      this.parallaxObserver.observe(container);
    });
  }
  
  setupScrollListener() {
    // Animation légère au scroll pour les couteaux visibles
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateKnifeAnimations();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  updateKnifeAnimations() {
    // Animation subtile des couteaux au scroll
    const scrollY = window.scrollY;
    
    this.knifeWindows.forEach((window, index) => {
      if (!window.classList.contains('visible')) return;
      
      const container = window.closest('.knife-theme-container');
      if (container.dataset.parallaxActive !== 'true') return;
      
      const rect = window.getBoundingClientRect();
      const windowCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      
      // Mouvement de flottement léger
      const floatAmount = Math.sin((scrollY + index * 100) * 0.003) * 3;
      
      // Applique l'animation seulement si la fenêtre est dans une zone raisonnable
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const currentTransform = window.style.transform;
        const baseTransform = currentTransform.replace(/translateY\([^)]*\)/g, '');
        window.style.transform = `${baseTransform} translateY(${floatAmount}px)`;
      }
    });
  }
  
  checkVisibleWindows() {
    // Vérification manuelle pour les éléments déjà visibles au chargement
    this.knifeWindows.forEach(window => {
      const rect = window.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible && !window.classList.contains('visible')) {
        setTimeout(() => {
          window.classList.add('visible');
        }, Math.random() * 200);
      }
    });
  }
  
  // Méthode pour nettoyer les listeners
  destroy() {
    if (this.parallaxObserver) {
      this.parallaxObserver.disconnect();
    }
    window.removeEventListener('scroll', this.handleScroll);
  }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    new ParallaxKnivesSection();
  }, 100);
});

// Export pour usage potentiel
window.ParallaxKnivesSection = ParallaxKnivesSection;