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

// Injection des couteaux
Object.keys(knivesData).forEach(containerId => {
  const container = document.getElementById(containerId);
  if (!container) return;
  knivesData[containerId].forEach((knife, i) => {
    const img = document.createElement('img');
    img.src = knife.src;
    img.className = 'knife';
    img.style.setProperty('--rot', knife.rot + 'deg');
    img.style.left = (15 + i * 12) + '%';
    container.appendChild(img);
  });
});

const scenes = document.querySelectorAll('#sequence-narrative .scene');

function animate() {
  const winH = window.innerHeight;

  scenes.forEach(scene => {
    const rect = scene.getBoundingClientRect();
    const progress = Math.min(Math.max((winH - rect.top) / (rect.height + winH), 0), 1);

    const bgImg = scene.querySelector('.bg-layer img');
    const textBox = scene.querySelector('.fade-slide-up');
    const knives = scene.querySelectorAll('.knife');

    // Phase 1 : fond rapide, texte hors écran, couteaux invisibles
    if (progress < 0.25) {
      const p1 = progress / 0.25;
      bgImg.style.transform = `translateY(${p1 * 80}px)`;
      textBox.style.transform = `translateY(${100 - p1 * 100}%)`;
      knives.forEach(k => { k.style.opacity = 0; });
    }
    // Phase 2 : texte arrive et ralentit, fond ralenti
    else if (progress < 0.45) {
      const p2 = (progress - 0.25) / 0.2;
      bgImg.style.transform = `translateY(${80 + p2 * 20}px)`;
      textBox.style.transform = `translateY(${(1 - p2) * 50}%)`;
      knives.forEach(k => { k.style.opacity = 0; });
    }
    // Phase 3 : couteaux défilent, texte quasi fixe, fond très lent
    else if (progress < 0.75) {
      const p3 = (progress - 0.45) / 0.3;
      bgImg.style.transform = `translateY(${100 + p3 * 10}px)`;
      textBox.style.transform = `translateY(0%)`;

      knives.forEach((knife, i) => {
        const delay = i * 0.12;
        const kProg = Math.min(Math.max((p3 - delay) * 1.5, 0), 1);
        knife.style.opacity = kProg > 0 && kProg < 1 ? 1 : 0;
        // Bas → haut
        knife.style.transform = `translateY(${-kProg * (winH + 200)}px) rotate(${(1 - kProg) * parseFloat(knife.style.getPropertyValue('--rot'))}deg)`;
      });
    }
    // Phase 4 : sortie, fond et texte accélèrent
    else {
      const p4 = (progress - 0.75) / 0.25;
      bgImg.style.transform = `translateY(${110 + p4 * 200}px)`;
      textBox.style.transform = `translateY(${p4 * -100}%)`;
      knives.forEach(k => { k.style.opacity = 0; });
    }
  });

  requestAnimationFrame(animate);
}

animate();

});
