document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".card-3d-wrapper");
  if (!wrapper) {
    console.warn("Carte 3D introuvable dans le DOM");
    return;
  }

  // Sélections scoppées à la carte
  const card = wrapper.querySelector(".card-3d");
  const frontReflection = wrapper.querySelector(".card-front .card-reflection");
  const backReflection  = wrapper.querySelector(".card-back .card-reflection");
  const cardGlow        = wrapper.querySelector(".card-glow"); // <- ciblage direct

  if (!card || !frontReflection || !backReflection) {
    console.warn("Carte 3D : éléments essentiels manquants", {
      card: !!card,
      frontReflection: !!frontReflection,
      backReflection: !!backReflection,
      cardGlow: !!cardGlow
    });
    return;
  }

  let isFlipped = false;
  let rx = 0, ry = 0;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const applyTransform = () => {
    const flip = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
    card.style.transform = `${flip} rotateX(${rx}deg) rotateY(${ry}deg)`;

    // Ombre dynamique
    const shadowX = ry * -3.2;
    const shadowY = rx * 3.2;
    card.style.boxShadow = `${shadowX}px ${shadowY}px 46px rgba(0,0,0,0.4)`;

    // Reflets
    const refFront = 50 + clamp(ry, -12, 12) * 3;
    const refBack  = 50 - clamp(ry, -12, 12) * 3;
    frontReflection.style.setProperty('--reflectX', `${refFront}%`);
    backReflection.style.setProperty('--reflectX',  `${refBack}%`);

    // Glow (optionnel)
    if (cardGlow) {
      cardGlow.style.opacity = isFlipped ? '0' : '1';
    }
  };

  const setTilt = (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    rx = clamp((-y / rect.height) * 10, -10, 10);
    ry = clamp(( x / rect.width)  * 10, -10, 10);
    applyTransform();
  };

  // Événements
  wrapper.addEventListener("mouseenter", () => { isFlipped = true;  applyTransform(); });
  wrapper.addEventListener("mouseleave", () => { isFlipped = false; rx = 0; ry = 0; applyTransform(); });
  wrapper.addEventListener("mousemove", setTilt);
  wrapper.addEventListener("click", () => { isFlipped = !isFlipped; applyTransform(); });

  console.log("Carte 3D initialisée avec succès");
});
