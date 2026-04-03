/**
 * anim-vitrine.js - L'Atelier sous l'Éclipse
 */

const initCrossfade = () => {
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

// VERSION DESKTOP CONSERVÉE TELLE QUELLE
const initParallaxVitrine = () => {
    if (window.innerWidth < 768) return;
    const columns = document.querySelectorAll('.vitrine-column');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        columns.forEach((col, index) => {
            const speed = (index === 1) ? 0.08 : 0.04; 
            const yPos = -(scrolled * speed) % 100; 
            col.style.transform = `translateY(${yPos}px)`;
        });
    });
};

// NOUVELLE CINÉMATIQUE DE DÉSEMPILEMENT MOBILE
const initMobileStackParallax = () => {
    if (window.innerWidth >= 768) return;
    const cards = document.querySelectorAll('.vitrine-column');
    
    // On définit les mêmes angles que dans le CSS
    const angles = [-3, 2, -1.5];
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        cards.forEach((card, index) => {
            const speeds = [0.25, 0.15, 0.05];
            const speed = speeds[index] || 0.1;
            const angle = angles[index] || 0;
            
            const yPos = -(scrolled * speed);
            
            // On concatène la rotation ET la translation
            card.style.transform = `rotate(${angle}deg) translateY(${yPos}px)`;
        });
    });
};

export const initVitrine = () => {
    initCrossfade();
    
    // On attend un court instant ou on vérifie si les éléments sont visibles 
    // pour que le parallaxe JS n'écrase pas la transition CSS d'entrée
    setTimeout(() => {
        initParallaxVitrine();
        initMobileStackParallax();
    }, 1000); 
};