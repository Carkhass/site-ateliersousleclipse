const cards = document.querySelectorAll(".card");
const cardsContainer = document.querySelector(".cards"); // Container principal
const images = document.querySelectorAll(".card__img");
const backgrounds = document.querySelectorAll(".card__bg");

// Réglages
const maxAngleX = 18; // inclinaison avant/arrière max pour scroll
const maxAngleY = 12; // rotation gauche/droite max pour scroll
const mouseRange = 25; // Amplitude du mouvement souris (plus élevé = plus réactif)

// Interpolation
const lerp = (start, end, t) => start + (end - start) * t;

// Easing doux
const easeInOut = t => t < 0.5
  ? 2 * t * t
  : -1 + (4 - 2 * t) * t;

// Variables souris (plus réactives)
let mouseX = 0;
let mouseY = 0;

// Fonction de calcul des valeurs souris (comme l'original)
const calcValue = (a, b) => (a/b*mouseRange-mouseRange/2).toFixed(1);

// Écoute souris → effet plus marqué comme l'original
document.addEventListener('mousemove', ({ x, y }) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  
  // Calcul plus marqué comme dans l'original
  mouseX = calcValue(x, vw);
  mouseY = calcValue(y, vh);
});

function updateEffects() {
  const viewportHeight = window.innerHeight;
  const viewportCenter = viewportHeight / 2;

  // Animation du container principal basée sur la souris (comme l'original)
  if (cardsContainer) {
    cardsContainer.style.transform = `rotateX(${mouseY * 0.7}deg) rotateY(${mouseX * 0.3}deg)`;
  }

  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.top + rect.height / 2;

    // Distance normalisée du centre de la carte au centre du viewport (-1 à 1)
    let distFromCenter = (cardCenter - viewportCenter) / (viewportHeight / 2);
    distFromCenter = Math.max(-1, Math.min(1, distFromCenter));

    // Profil en cloche : 0 au centre, 1 aux extrémités
    const progress = Math.abs(distFromCenter);
    const eased = easeInOut(progress);

    // Angles de base du scroll : max aux extrémités, 0 au centre
    const baseScrollX = maxAngleX * eased * Math.sign(distFromCenter);
    const baseScrollY = maxAngleY * eased * Math.sign(distFromCenter);

    // Ajout du mouvement souris plus marqué
    const finalX = baseScrollX + (mouseY * 0.5);
    const finalY = baseScrollY + (mouseX * 0.5);

    // Applique rotation + légère mise en avant
    card.style.transform = `rotateX(${finalX}deg) rotateY(${finalY}deg) translateZ(35px)`;

    // Images → parallaxe plus marquée (comme l'original)
    const img = card.querySelector(".card__img");
    if (img) {
      img.style.transform = `translateX(${-mouseX * 0.8}px) translateY(${mouseY * 0.8}px)`;
    }

    // Fonds → déplacement plus marqué (comme l'original)
    const bg = card.querySelector(".card__bg");
    if (bg) {
      bg.style.backgroundPosition = `${mouseX * 0.45}px ${-mouseY * 0.45}px`;
    }
  });

  requestAnimationFrame(updateEffects);
}

updateEffects();