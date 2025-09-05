document.addEventListener("DOMContentLoaded", () => {
  const sections = [...document.querySelectorAll(".parallax-section")];
  const sectionData = new Map();

  // Pré-calcul des données statiques
  const computeSectionData = () => {
    sectionData.clear();
    sections.forEach(section => {
      const target = section.querySelector("[data-parallax-target]");
      if (!target) return;

      sectionData.set(section, {
        target,
        speed: parseFloat(section.getAttribute("data-parallax-speed")) || 50,
        baseZoom: parseFloat(section.getAttribute("data-parallax-zoom")) || 1.28,
        zoomStrength: parseFloat(section.getAttribute("data-parallax-zoom-strength")) || 0.08,
        isPoincon: section.querySelector('img[src*="poincon"]') !== null,
        top: section.offsetTop,
        height: section.offsetHeight
      });
    });
  };

  // Animation d'une section visible
  const animateSection = (section) => {
    const data = sectionData.get(section);
    if (!data) return;

    const winH = window.innerHeight;
    const scrollY = window.scrollY;
    const progress = (winH - (data.top - scrollY)) / (winH + data.height);
    const translate = (progress - 0.5) * data.speed;

    if ((data.isPoincon && data.baseZoom === 1 && data.zoomStrength === 0) ||
        (data.baseZoom === 1 && data.zoomStrength === 0)) {
      data.target.style.transform = `translateY(${translate}px) scale(1)`;
    } else {
      const zoom = data.baseZoom + Math.abs(progress) * data.zoomStrength;
      data.target.style.transform = `translateY(${translate}px) scale(${zoom})`;
    }
  };

  // Gestion des sections visibles
  const visibleSections = new Set();
  const update = () => {
    visibleSections.forEach(section => animateSection(section));
    requestAnimationFrame(update);
  };

  // Observer pour activer/désactiver l'animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        visibleSections.add(entry.target);
      } else {
        visibleSections.delete(entry.target);
      }
    });
  }, { root: null, threshold: 0 });

  // Initialisation
  computeSectionData();
  sections.forEach(section => observer.observe(section));
  window.addEventListener("resize", computeSectionData);
  requestAnimationFrame(update);
});
