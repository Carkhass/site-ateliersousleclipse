(() => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // On utilise un nom de variable unique pour éviter les conflits
  const rootHtml = document.documentElement;
  const themeToggleBtn = document.querySelector('#theme-toggle');

  if (!themeToggleBtn) return; // sécurité si le bouton n'existe pas

  // Charger le thème sauvegardé
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    rootHtml.setAttribute('data-theme', savedTheme);
  }

  // Écouteur de clic pour basculer le thème
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = rootHtml.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    rootHtml.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
})();
