// Gère le changement de thème clair/sombre
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  html.classList.toggle('dark', savedTheme === 'dark');
}

const btnTheme = document.getElementById('theme-toggle');
if (btnTheme) {
  btnTheme.addEventListener('click', () => {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    btnTheme.textContent = isDark ? '☀️' : '🌙';
  });
}
