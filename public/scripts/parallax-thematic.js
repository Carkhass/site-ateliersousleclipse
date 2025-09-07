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

// Injection des couteaux avec espacement horizontal
Object.keys(knivesData).forEach(containerId => {
  const container = document.getElementById(containerId);
  if (!container) return;
  const total = knivesData[containerId].length;
  knivesData[containerId].forEach((knife, i) => {
    const img = document.createElement('img');
    img.src = knife.src;
    img.className = 'knife';
    img.style.setProperty('--rot', knife.rot + 'deg');
    img.style.left = `${(i + 1) * (80 / (total + 1))}%`; // répartis sur 80% de largeur
    container.appendChild(img);
  });
});

const scenes = document.querySelectorAll('#sequence-narrative .scene');
const globalTitle = document.getElementById('global-title');

function animate() {
  const winH = window.innerHeight;

  scenes.forEach((scene, sceneIndex) => {
    const rect = scene.getBoundingClientRect();
    const progress = Math.min(Math.max((winH - rect.top) / (rect.height + winH), 0), 1);

    const bgImg = scene.querySelector('.bg-layer img');
    const textBox = scene.querySelector('.fade-slide-up');
    const knives = scene.querySelectorAll('.knife');

    // --- TITRE GLOBAL (uniquement sur la première scène) ---
    if (sceneIndex === 0 && globalTitle) {
      if (progress < 0.15) {
        // invisible
        globalTitle.style.opacity = 0;
        globalTitle.style.transform = 'translateY(40px)';
      } else if (progress < 0.3) {
        // entrée par le bas
        const pT = (progress - 0.15) / 0.15;
        globalTitle.style.opacity = 1;
        globalTitle.style.transform = `translateY(${(1 - pT) * 40}px)`;
      } else {
        // fixé
        globalTitle.style.opacity = 1;
        globalTitle.style.transform = 'translateY(0)';
      }
    }

    // --- PHASES ---
    // Phase 1 : fond rapide, texte hors écran, couteaux invisibles
    if (progress < 0.25) {
      const p1 = progress / 0.25;
      if (bgImg) bgImg.style.transform = `translateY(${p1 * 120}px)`;
      if (textBox) textBox.style.transform = `translateY(${100 - p1 * 100}%)`;
      knives.forEach(k => { k.style.opacity = 0; });
    }
    // Phase 2 : ralentissement fond + texte
    else if (progress < 0.45) {
      const p2 = (progress - 0.25) / 0.2;
      if (bgImg) bgImg.style.transform = `translateY(${120 + p2 * 5}px)`; // monte doucement
      if (textBox) textBox.style.transform = `translateY(${(1 - p2) * 10}%)`;
      knives.forEach(k => { k.style.opacity = 0; });
    }
    // Phase 3 : couteaux séquentiels, fond et texte très lents
    else if (progress < 0.75) {
      const p3 = (progress - 0.45) / 0.3;
      if (bgImg) bgImg.style.transform = `translateY(${125 + p3 * 3}px)`; // très lent
      if (textBox) textBox.style.transform = `translateY(${p3 * -5}%)`;

      knives.forEach((knife, i) => {
        const delay = i * 0.25; // apparition espacée
        const kProg = Math.min(Math.max((p3 - delay) * 1.2, 0), 1);
        knife.style.opacity = kProg > 0 && kProg < 1 ? 1 : 0;
        const rotStart = (parseFloat(knife.style.getPropertyValue('--rot')) || 0) * 1.5;
        knife.style.transform = `translateY(${-kProg * (winH + 200)}px) rotate(${(1 - kProg) * rotStart}deg)`;
      });
    }
    // Phase 4 : sortie
    else {
      const p4 = (progress - 0.75) / 0.25;
      if (bgImg) bgImg.style.transform = `translateY(${128 + p4 * 200}px)`;
      if (textBox) textBox.style.transform = `translateY(${p4 * -100}%)`;
      knives.forEach(k => { k.style.opacity = 0; });
    }
  });

  requestAnimationFrame(animate);
}

animate();


});
