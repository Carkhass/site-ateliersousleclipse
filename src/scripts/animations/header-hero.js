export function initHeaderHero() {
  const header = document.getElementById("site-header");
  const hero = document.querySelector(".hero-section");

  const heroLogo = document.getElementById("hero-logo");
  const heroTitle = document.getElementById("hero-title");

  const heroLogoAnchor = document.getElementById("hero-logo-anchor");
  const heroTitleAnchor = document.getElementById("hero-title-anchor");

  const headerLogoPlaceholder = document.getElementById("header-logo-placeholder");
  const headerTitlePlaceholder = document.getElementById("header-title-placeholder");

  let inHeader = false;
  let lastState = null;

  window.addEventListener("scroll", checkPosition);
  window.addEventListener("resize", checkPosition);

  // --- Garde-fou : observer le hero ---
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        // Hero sorti → logo/titre doivent être dans le header
        if (!inHeader) forceToHeader();
      } else {
        // Hero visible → logo/titre doivent être dans le hero
        if (inHeader) forceToHero();
      }
    });
  }, { threshold: 0 });
  observer.observe(hero);

  function checkPosition() {
    const headerH = header.offsetHeight;
    const heroTop = hero.getBoundingClientRect().top;
    const buffer = 8;
    const shouldBeInHeader = heroTop <= headerH - buffer;

    if (shouldBeInHeader !== lastState) {
      lastState = shouldBeInHeader;

      if (shouldBeInHeader && !inHeader) {
        // --- Entrée ---
        header.classList.add("nav-shifted");
        headerLogoPlaceholder.classList.add("filled");
        headerTitlePlaceholder.classList.add("filled");

        Promise.all([
          flipMove(heroLogo, headerLogoPlaceholder, "in-header"),
          delay(50).then(() => flipMove(heroTitle, headerTitlePlaceholder, "in-header"))
        ]).then(() => { inHeader = true; });

      } else if (!shouldBeInHeader && inHeader) {
        // --- Sortie ---
        header.classList.remove("nav-shifted");
        headerLogoPlaceholder.classList.remove("filled");
        headerTitlePlaceholder.classList.remove("filled");

        Promise.all([
          flipMove(heroLogo, heroLogoAnchor, "in-hero"),
          delay(50).then(() => flipMove(heroTitle, heroTitleAnchor, "in-hero"))
        ]).then(() => { inHeader = false; });
      }
    }
  }

  // --- Garde-fou : forcer cohérence ---
  function forceToHeader() {
    headerLogoPlaceholder.appendChild(heroLogo);
    headerTitlePlaceholder.appendChild(heroTitle);
    heroLogo.classList.remove("in-hero");
    heroTitle.classList.remove("in-hero");
    heroLogo.classList.add("in-header");
    heroTitle.classList.add("in-header");
    header.classList.add("nav-shifted");
    headerLogoPlaceholder.classList.add("filled");
    headerTitlePlaceholder.classList.add("filled");
    inHeader = true;
  }

  function forceToHero() {
    heroLogoAnchor.appendChild(heroLogo);
    heroTitleAnchor.appendChild(heroTitle);
    heroLogo.classList.remove("in-header");
    heroTitle.classList.remove("in-header");
    heroLogo.classList.add("in-hero");
    heroTitle.classList.add("in-hero");
    header.classList.remove("nav-shifted");
    headerLogoPlaceholder.classList.remove("filled");
    headerTitlePlaceholder.classList.remove("filled");
    inHeader = false;
  }

  // --- FLIP pour logo/titre ---
  function flipMove(el, newParent, stateClass) {
    return new Promise((resolve) => {
      el.style.transition = "none";
      el.style.transform = "";

      const first = el.getBoundingClientRect();

      newParent.appendChild(el);
      el.classList.remove("in-hero", "in-header");
      el.classList.add(stateClass);

      const last = el.getBoundingClientRect();

      const dx = first.left - last.left;
      const dy = first.top - last.top;
      const sx = (first.width / last.width) || 1;
      const sy = (first.height / last.height) || 1;

      el.style.transformOrigin = "top left";
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;

      void el.offsetWidth;

      requestAnimationFrame(() => {
        el.style.transition = "transform 600ms cubic-bezier(0.4,0,0.2,1)";
        el.style.transform = "translate(0,0) scale(1)";
      });

      el.addEventListener("transitionend", () => {
        el.style.transition = "";
        el.style.transform = "";
        resolve();
      }, { once: true });
    });
  }

  function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
}
