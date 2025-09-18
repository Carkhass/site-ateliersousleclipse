/**
 * // public/scripts/layout/parallax.js
 * Applique un effet parallax sur les sections avec .parallax-section.
 * - Calcule les paramètres à partir des attributs data-*
 * - Anime uniquement les sections visibles via IntersectionObserver
 */


document.addEventListener('DOMContentLoaded', () => {
  const sections = Array.from(document.querySelectorAll('.parallax-section'));
  const sectionData = new Map();

  const computeSectionData = () => {
    sectionData.clear();
    const filteredSections = sections.filter((section) => !section.closest('.parallax-excluded'));

    filteredSections.forEach((section) => {
      const target = section.querySelector('[data-parallax-target]');
      if (!target) return;

      const speed = parseFloat(section.getAttribute('data-parallax-speed') || '') || 50;
      const baseZoom = parseFloat(section.getAttribute('data-parallax-zoom') || '') || 1.28;
      const zoomStrength =
        parseFloat(section.getAttribute('data-parallax-zoom-strength') || '') || 0.08;
      const isPoincon = section.querySelector('img[src*="poincon"]') !== null;

      sectionData.set(section, {
        target,
        speed,
        baseZoom,
        zoomStrength,
        isPoincon,
        top: section.offsetTop,
        height: section.offsetHeight
      });
    });
  };

  const animateSection = (section) => {
    const data = sectionData.get(section);
    if (!data) return;

    const winH = window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    const progress = (winH - (data.top - scrollY)) / (winH + data.height);
    const translate = (progress - 0.5) * data.speed;

    if (
      (data.isPoincon && data.baseZoom === 1 && data.zoomStrength === 0) ||
      (data.baseZoom === 1 && data.zoomStrength === 0)
    ) {
      data.target.style.transform = `translateY(${translate}px) scale(1)`;
    } else {
      const zoom = data.baseZoom + Math.abs(progress) * data.zoomStrength;
      data.target.style.transform = `translateY(${translate}px) scale(${zoom})`;
    }
  };

  const visibleSections = new Set();
  const update = () => {
    visibleSections.forEach((section) => animateSection(section));
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          visibleSections.add(el);
        } else {
          visibleSections.delete(el);
        }
      });
    },
    { root: null, threshold: 0 }
  );

  // Initial compute and observe
  computeSectionData();
  sections.forEach((section) => observer.observe(section));
  window.addEventListener('resize', () => {
    computeSectionData();
    // recompute top/height for existing entries
    sectionData.forEach((value, key) => {
      value.top = key.offsetTop;
      value.height = key.offsetHeight;
    });
  });

  requestAnimationFrame(update);
});
