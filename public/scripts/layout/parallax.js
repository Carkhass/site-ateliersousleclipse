document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".parallax-section");

  const update = () => {
    sections.forEach(section => {
      const target = section.querySelector("[data-parallax-target]");
      if (!target) return;

      const speed = parseFloat(section.getAttribute("data-parallax-speed")) || 50;
      const baseZoom = parseFloat(section.getAttribute("data-parallax-zoom")) || 1.28;
      const zoomStrength = parseFloat(section.getAttribute("data-parallax-zoom-strength")) || 0.08;

      const rect = section.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const translate = (progress - 0.5) * speed;

      const isPoincon = section.querySelector('img[src*="poincon"]') !== null;

      // --- Cas spécial : poinçon sans zoom ---
      if (isPoincon && baseZoom === 1 && zoomStrength === 0) {
        target.style.transform = `translateY(${translate}px) scale(1)`;
        return;
      }

      // --- Cas spécial : zoom désactivé (autres sections) ---
      if (baseZoom === 1 && zoomStrength === 0) {
        target.style.transform = `translateY(${translate}px) scale(1)`;
        return;
      }

      // --- Cas normal : parallaxe + zoom ---
      const zoom = baseZoom + Math.abs(progress) * zoomStrength;
      target.style.transform = `translateY(${translate}px) scale(${zoom})`;
    });

    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
});
