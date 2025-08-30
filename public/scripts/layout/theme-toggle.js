(() => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const rootHtml = document.documentElement;
  const btnTheme = document.getElementById('theme-toggle');

  const saved = localStorage.getItem('theme');
  if (saved) rootHtml.classList.toggle('dark', saved === 'dark');

  if (!btnTheme) return;

  btnTheme.addEventListener('click', () => {
    const isDark = rootHtml.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    btnTheme.textContent = isDark ? '☀️' : '🌙';
  });
})();
