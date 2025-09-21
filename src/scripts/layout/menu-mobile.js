/**
 * Gère l'ouverture et la fermeture du menu mobile avec overlay.
 * Ferme automatiquement le menu lors d'un clic sur un lien ou sur l'overlay.
 */
// src/scripts/layout/menu-mobile.js
export function initMenuMobile() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.querySelector('.menu-mobile');
  const overlay = document.querySelector('.menu-overlay');
  if (!menuToggle || !menu || !overlay) return;

  function openMenu() {
    menu.classList.remove('closing');
    menu.classList.add('open');
    overlay.classList.add('active');
    menuToggle.classList.add('active');
  }

  function closeMenu() {
    menu.classList.remove('open');
    menu.classList.add('closing');
    overlay.classList.remove('active');
    menuToggle.classList.remove('active');
    setTimeout(() => menu.classList.remove('closing'), 300);
  }

  menuToggle.addEventListener('click', () => {
    if (menu.classList.contains('open')) closeMenu();
    else openMenu();
  });

  overlay.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}
