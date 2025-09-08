document.addEventListener('DOMContentLoaded', () => {
  // Données couteaux par scène
  const knivesData = {
    'knives-cuisine': [
      { src: '/images/cuisine/detoure-lance1.png', rot: -8 },
      { src: '/images/cuisine/detoure-long-bonap.png', rot: 5 },
      { src: '/images/cuisine/detoure-petty1.png', rot: -4 },
      { src: '/images/cuisine/detoure-gyuto1.png', rot: 6 },
      { src: '/images/cuisine/detoure-bonap.png', rot: -3 },
      { src: '/images/cuisine/detoure-grand-bonap6.png', rot: 4 },
      { src: '/images/cuisine/detoure-nakiri.png', rot: -5 }
    ],
    'knives-table': [
      { src: '/images/table/detoure-couteau-table-1.png', rot: -6 },
      { src: '/images/table/detoure-couteau-table-2.png', rot: 4 },
      { src: '/images/table/detoure-couteau-table-3.png', rot: -5 }
    ],
    'knives-outdoor': [
      { src: '/images/outdoor/detoure-camp-1.png', rot: -7 },
      { src: '/images/outdoor/detoure-camp-2.png', rot: 5 },
      { src: '/images/outdoor/detoure-camp-3.png', rot: -4 }
    ]
  };

function animateNarrative() {
  const winH = window.innerHeight;

  document.querySelectorAll('.narrative-scene').forEach(scene => {
    const rect = scene.getBoundingClientRect();
    const progress = Math.min(Math.max((winH - rect.top) / (rect.height + winH), 0), 1);
    const bgImg = scene.querySelector('.narrative-bg img');

    if (progress < 0.25) {
      // montée rapide
      bgImg.style.transform = `translateY(${progress * 100}px)`;
    } else if (progress < 0.65) {
      // ralentissement
      const p = (progress - 0.25) / 0.4;
      bgImg.style.transform = `translateY(${100 + p * 20}px)`;
    } else {
      // reprise
      const p = (progress - 0.65) / 0.35;
      bgImg.style.transform = `translateY(${120 + p * 200}px)`;
    }
  });

  requestAnimationFrame(animateNarrative);
}

animateNarrative();
