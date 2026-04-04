// src/scripts/layout/hero-animation.js
// Anime le titre et le sous-titre du hero au chargement de la page
// - Fade-in du titre avec halo
// - Animation lettre par lettre du sous-titre
// - Insertion d'un saut de ligne sur mobile après un index précis

export function initHeroAnimation() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const title = document.getElementById('hero-title');
  const subtitle = document.getElementById('hero-subtitle');
  if (!title || !subtitle) return;

  // Titre
  title.style.opacity = '0';
  title.style.transition = 'opacity 0.6s ease';
  setTimeout(() => {
    title.style.opacity = '1';
    title.classList.add('active');
  }, 100);

  // Sous-titre
  const animateSubtitle = (el) => {
    // 1. On récupère le HTML brut (avec les balises <em>)
    const rawHTML = el.innerHTML;
    
    // 2. La REGEX Magique : elle sépare les balises HTML du texte
    // Ce qui donne un tableau mixant ["texte", "<balise>", "texte", etc.]
    const parts = rawHTML.split(/(<[^>]+>)/g);
    
    // 3. Reconstruction intelligente
    el.innerHTML = parts.map(part => {
      // Si c'est une balise HTML (comme <em> ou </em>), on la renvoie TELLE QUELLE
      if (/^<[^>]+>$/.test(part.trim())) {
        return part; 
      }
      
      // Si c'est du texte, on découpe par MOTS pour éviter les coupures (comme avant)
      // Et on anime chaque LETTRE à l'intérieur
      return part.split(/(\s+)/).map(word => {
        // C'est un espace ? On le garde.
        if (word.trim() === '') return word;
        
        // C'est un mot ? On anime ses lettres
        const letters = word.split('').map(c => 
          `<span class="letter">${c}</span>`
        ).join('');
        
        // On entoure le mot d'un span 'nowrap' pour qu'il ne se coupe pas en deux
        return `<span style="white-space: nowrap; display: inline-block;">${letters}</span>`;
      }).join('');
    }).join('');

    // 4. Application des délais d'animation (identique)
    let delay = 0;
    el.querySelectorAll('.letter').forEach(span => {
      span.style.animationDelay = `${delay}s`;
      delay += 0.02;
    });

    el.style.opacity = 1;
  };

  const fadeInDuration = 100;
  const extraDelay = 0;
  setTimeout(() => {
    animateSubtitle(subtitle);
  }, fadeInDuration + extraDelay);
}
