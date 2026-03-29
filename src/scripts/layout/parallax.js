// src/scripts/layout/parallax.js

export function initParallax() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const sections = [...document.querySelectorAll(".parallax-section")];
  const sectionData = new Map();

  const computeSectionData = () => {
    sectionData.clear();
    sections.forEach(section => {
      if (section.closest('.parallax-excluded')) return;
      
      const target = section.querySelector("[data-parallax-target]");
      if (!target) return;

      const rect = section.getBoundingClientRect();
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      sectionData.set(section, {
        target,
        // On booste un peu la vitesse sur mobile pour que l'effet soit visible
        speed: parseFloat(section.getAttribute("data-parallax-speed")) || (window.innerWidth < 768 ? 80 : 50),
        baseZoom: parseFloat(section.getAttribute("data-parallax-zoom")) || 1.1,
        zoomStrength: parseFloat(section.getAttribute("data-parallax-zoom-strength")) || 0.05,
        // On recalcule la position absolue par rapport au document
        top: rect.top + scrollY,
        height: rect.height
      });
    });
  };

  const animateSection = (section) => {
    const data = sectionData.get(section);
    if (!data) return;

    const winH = window.innerHeight;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // Calcul de progression relative (0 en bas de l'écran, 1 en haut)
    const sectionVisibleTop = data.top - scrollY;
    const progress = (winH - sectionVisibleTop) / (winH + data.height);

    // On sature le progress entre 0 et 1 pour éviter les sauts hors écran
    const clampedProgress = Math.max(0, Math.min(1, progress));
    
    // Calcul du mouvement (centré sur 0.5)
    const translate = (clampedProgress - 0.5) * data.speed;
    
    // Gestion du zoom adaptatif
    let finalTransform = `translate3d(0, ${translate}px, 0)`; // Utilisation de translate3d pour booster les perf mobile
    
    if (data.baseZoom !== 1 || data.zoomStrength !== 0) {
      const zoom = data.baseZoom + (Math.abs(clampedProgress - 0.5) * data.zoomStrength);
      finalTransform += ` scale(${zoom})`;
    }

    data.target.style.transform = finalTransform;
  };

  // --- Moteur de rendu ---
  const visibleSections = new Set();
  
  const update = () => {
    if (visibleSections.size > 0) {
      visibleSections.forEach(section => animateSection(section));
    }
    requestAnimationFrame(update);
  };

  // Observer pour la performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleSections.add(entry.target);
      else visibleSections.delete(entry.target);
    });
  }, { threshold: 0 });

  // Initialisation
  computeSectionData();
  sections.forEach(section => observer.observe(section));
  
  // Update des data lors du resize ou changement d'orientation (critique sur mobile)
  window.addEventListener("resize", computeSectionData);
  window.addEventListener("orientationchange", () => setTimeout(computeSectionData, 200));

  requestAnimationFrame(update);

  // Activation des transitions après init
  requestAnimationFrame(() => {
    sections.forEach(sec => sec.classList.add("parallax-active"));
  });
}