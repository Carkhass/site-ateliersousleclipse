/**
 * anim-vitrine.js - L'Atelier sous l'Éclipse
 */

export const initVitrine = () => {
    const columns = document.querySelectorAll('.vitrine-column');
    if (columns.length === 0) return;

    columns.forEach((column) => {
        const images = column.querySelectorAll('.crossfade-img');
        if (images.length <= 1) return;

        let currentIndex = 0;
        const startDelay = parseInt(column.getAttribute('data-delay') || "0");

        setTimeout(() => {
            setInterval(() => {
                images[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].classList.add('active');
            }, 8000); 
        }, startDelay);
    });
};

// Parallaxe Desktop (Translation verticale classique)
const initParallaxVitrine = () => {
    if (window.innerWidth < 768) return;
    const columns = document.querySelectorAll('.vitrine-column');
    
    // Les rotations qu'on veut garder
    const baseRots = [-1.5, 1, -0.5];

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        columns.forEach((col, index) => {
            const speed = (index === 1) ? 0.08 : 0.03; 
            const yPos = -(scrolled * speed) % 50;
            const rot = baseRots[index];
            
            // On combine la rotation et la translation
            col.style.transform = `rotate(${rot}deg) translateY(${yPos}px)`;
        });
    });
};

// Parallaxe Mobile (Effet de glisse des cartes)
const initMobileStackParallax = () => {
    if (window.innerWidth >= 768) return;
    const cards = document.querySelectorAll('.vitrine-column');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        cards.forEach((card, index) => {
            // Chaque carte "flotte" à une vitesse différente
            const speed = (index + 1) * 0.15;
            const yPos = (scrolled * speed) * 0.1;
            
            // On récupère la rotation de base définie dans le CSS pour ne pas la casser
            const rotations = [-3, 2, -1.5];
            const baseRot = rotations[index] || 0;
            
            card.style.transform = `rotate(${baseRot}deg) translateY(${yPos}px)`;
        });
    });
};

// Initialisation globale
const runAllVitrineInits = () => {
    initVitrine();
    initParallaxVitrine();
    initMobileStackParallax();
};

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', runAllVitrineInits);
    document.addEventListener('astro:page-load', runAllVitrineInits);
}