// ============================
// MENU FLOTTANT — ACTIVATION ET STICKINESS
// ============================
export function initKnifeFloatingNav() {
  const triggers = document.querySelectorAll('.knife-trigger');
  const links = document.querySelectorAll('.knife-nav-item');
  const floatingNav = document.querySelector('.knife-floating-nav'); // <-- NOUVEAU

  let currentId = null;
  let stickyOffset = 0; // <-- NOUVEAU : Position de déclenchement

  // ------------------------------------
  // LOGIQUE DE STICKINESS
  // ------------------------------------

  function calculateStickyOffset() {
    if (!floatingNav) return;

    const fixedTopHeight = 100; 
    
    // Si la nav est absolue, offsetTop est relatif à son parent.
    // Nous avons besoin de la distance depuis le haut du document.
    // Pour un élément 'absolute' sans parent 'relative' autre que <body>, cela fonctionne.
    // stickyOffset = floatingNav.offsetTop - fixedTopHeight; <--- MAINTENIR CETTE LIGNE

    // Sécurité: utiliser getBoundingClientRect() pour plus de robustesse si offsetParent est complexe
    const rect = floatingNav.getBoundingClientRect();
    stickyOffset = window.scrollY + rect.top - fixedTopHeight;

    if (stickyOffset < 400) stickyOffset = 450; 
  }

  function handleStuckPosition() {
    if (!floatingNav || floatingNav.classList.contains('is-disabled-mobile')) return;
    
    // Utiliser la media query CSS pour décider si on fixe ou non
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Le menu est statique sur mobile (grâce à la media query) mais vous voulez la même logique :
    // Si la media query CSS est définie avec 'position: static' pour mobile, on désactive.
    // Ici, on va coller à votre demande : même logique sur mobile
    // NOTE: Si le CSS sous 768px a 'position: static', le JS ne fera rien, 
    // sauf si nous changeons la logique CSS pour une classe.
    
    if (window.scrollY > stickyOffset) {
      floatingNav.classList.add('is-stuck');
    } else {
      floatingNav.classList.remove('is-stuck');
    }
  }


  // ------------------------------------
  // LOGIQUE D'HIGHLIGHT (EXISTANTE)
  // ------------------------------------
  function updateMenu(trigger) {
    // ... (Votre logique de mise en évidence des liens existante) ...
    const parentSection = trigger.closest('.knife-section');
    const newId = parentSection?.id;
    if (!newId || newId === currentId) return;
    currentId = newId;

    // Active le lien correspondant
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${newId}`);
    });
  }

  // Observer pour détecter les triggers
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) updateMenu(entry.target);
      });
    },
    {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // zone de détection
      threshold: 0
    }
  );
  triggers.forEach(trigger => observer.observe(trigger));
  
  // ------------------------------------
  // INITIALISATION
  // ------------------------------------

  // Initialisation des positions et écouteurs d'événements
  window.addEventListener('load', () => {
    calculateStickyOffset(); // Calcul initial
    handleStuckPosition();    // Check initial scroll
    if (triggers.length > 0) updateMenu(triggers[0]); // Init highlight
  });
  
  window.addEventListener('resize', calculateStickyOffset); // Recalculer si la taille change
  document.addEventListener('scroll', handleStuckPosition); // Gérer le positionnement au scroll
}