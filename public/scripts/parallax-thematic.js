class ScrollDrivenParallax {
  constructor() {
    this.sequences = document.querySelectorAll('.scroll-sequence');
    this.isScrolling = false;
    
    this.init();
  }
  
  init() {
    // Utiliser Intersection Observer pour optimiser les performances
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.updateSequence(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '20%' });
    
    this.sequences.forEach(sequence => {
      this.observer.observe(sequence);
    });
    
    // Écouter le scroll avec throttling
    this.throttledScroll = this.throttle(this.handleScroll.bind(this), 16);
    window.addEventListener('scroll', this.throttledScroll);
    
    // Premier calcul
    this.handleScroll();
  }
  
  handleScroll() {
    this.sequences.forEach(sequence => this.updateSequence(sequence));
  }
  
  updateSequence(sequence) {
    const rect = sequence.getBoundingClientRect();
    const sequenceHeight = sequence.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    // Progression de 0 à 1 pour cette séquence
    const progress = Math.max(0, Math.min(1, 
      (viewportHeight - rect.top) / (viewportHeight + sequenceHeight)
    ));
    
    this.animateBackground(sequence, progress);
    this.animateTextCard(sequence, progress);
    this.animateKnives(sequence, progress);
  }
  
  animateBackground(sequence, progress) {
    const bg = sequence.querySelector('.sequence-bg');
    if (!bg) return;
    
    // Parallaxe du fond : plus lent que le scroll normal
    const bgOffset = progress * 30; // 30% de mouvement
    bg.style.transform = `translate(-5%, calc(-5% + ${bgOffset}px))`;
  }
  
  animateTextCard(sequence, progress) {
    const textCard = sequence.querySelector('.sequence-text-card');
    if (!textCard) return;
    
    // Phase 1 (0-0.3) : Apparition et descente normale
    // Phase 2 (0.3-0.7) : Ralentissement au centre
    // Phase 3 (0.7-1) : Accélération et disparition
    
    let textProgress;
    let opacity = 1;
    
    if (progress < 0.15) {
      // Début : invisible
      textProgress = -20;
      opacity = 0;
    } else if (progress < 0.4) {
      // Descente rapide
      const localProgress = (progress - 0.15) / 0.25;
      textProgress = -20 + (localProgress * 60); // De -20vh à +40vh
      opacity = localProgress;
    } else if (progress < 0.7) {
      // Phase stable au centre (ralentissement)
      const localProgress = (progress - 0.4) / 0.3;
      textProgress = 40 + (localProgress * 20); // De +40vh à +60vh (lent)
      opacity = 1;
    } else {
      // Sortie rapide
      const localProgress = (progress - 0.7) / 0.3;
      textProgress = 60 + (localProgress * 40); // De +60vh à +100vh
      opacity = 1 - localProgress;
    }
    
    textCard.style.transform = `translateY(${textProgress}vh)`;
    textCard.style.opacity = opacity;
  }
  
  animateKnives(sequence, progress) {
    const knives = sequence.querySelectorAll('.scroll-knife');
    
    knives.forEach((knife, index) => {
      const path = parseInt(knife.dataset.path);
      const rotation = parseInt(knife.dataset.rotation);
      
      // Les couteaux apparaissent pendant la phase de ralentissement du texte
      let knifeProgress;
      let opacity = 0;
      let knifeRotation = 0;
      
      // Début décalé selon l'index pour éviter les chevauchements
      const startDelay = 0.45 + (index * 0.05);
      const endDelay = startDelay + 0.3;
      
      if (progress < startDelay) {
        knifeProgress = -25;
        opacity = 0;
      } else if (progress < endDelay) {
        const localProgress = (progress - startDelay) / 0.3;
        knifeProgress = -25 + (localProgress * 150); // De bottom -25% à top 125%
        opacity = localProgress < 0.1 ? localProgress * 10 : 
                 localProgress > 0.9 ? (1 - localProgress) * 10 : 1;
        knifeRotation = localProgress * rotation;
        
        // Effet de brillance pendant la montée
        const shine = knife.querySelector('::before') || knife;
        if (shine && localProgress > 0.3 && localProgress < 0.8) {
          knife.style.setProperty('--shine-opacity', '1');
          knife.style.setProperty('--shine-position', `${(localProgress - 0.3) * 200}%`);
        }
      } else {
        knifeProgress = 125;
        opacity = 0;
        knifeRotation = rotation;
      }
      
      // Variation horizontale légère pendant la montée
      const horizontalOffset = Math.sin(progress * Math.PI * 2 + index) * 2;
      
      knife.style.transform = `translateY(${knifeProgress}%) translateX(${horizontalOffset}%) rotate(${knifeRotation}deg)`;
      knife.style.opacity = opacity;
    });
  }
  
  throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  new ScrollDrivenParallax();
});