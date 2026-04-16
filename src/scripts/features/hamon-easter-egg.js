/**
 * Logique de l'Easter Egg "Hamon Scratcher" - Version Finale Sécurisée
 */

// "HAMON2026" encodé en Base64 pour éviter la lecture directe
const _0xbc21 = atob("SEFNT04yMDI2"); 
const SOUND_URL = "/sounds/anvil2.mp3";
let anvilSound = typeof Audio !== 'undefined' ? new Audio(SOUND_URL) : null;
if (anvilSound) anvilSound.volume = 0.4;

let isDrawing = false;
let isFinished = false;
let lastX = 0;
let lastY = 0;

export function initHamonScratcher() {
  const questActive = localStorage.getItem('hamon_quest') === 'active';
  const container = document.querySelector('.hamon-scratcher-container');
  
  if (!container) return;

  if (!questActive) {
    const imgNormalPath = "/images/couteaux/2026-03-19-table.webp";
    container.innerHTML = `
      <img src="${imgNormalPath}" 
           alt="Couteau de table" 
           class="absolute inset-0 w-full h-full object-contain z-10 animate-fadeIn" />
    `;
    return;
  }

  isFinished = false; 
  const imgBrutePath = "/images/couteaux/table-brute.webp";
  const imgHamonPath = "/images/couteaux/table-hamon.webp";

  if (!document.getElementById('hamon-canvas')) {
    container.innerHTML = `
      <div class="absolute inset-0 w-full h-full bg-[#1a1a1a]">
        <img src="${imgHamonPath}" class="absolute inset-0 w-full h-full object-contain z-10" style="pointer-events:none;" />
        <canvas id="hamon-canvas" class="absolute inset-0 w-full h-full z-20 cursor-crosshair" style="touch-action:none;"></canvas>
      </div>
    `;
  }

  const canvas = document.getElementById('hamon-canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const imgBrute = new Image();
  imgBrute.crossOrigin = "anonymous";

  function setup() {
    const rect = container.getBoundingClientRect();
    if (rect.width === 0) { setTimeout(setup, 100); return; }
    
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(imgBrute, 0, 0, canvas.width, canvas.height);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.4);
    
    ctx.lineWidth = 40;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  imgBrute.onload = setup;
  imgBrute.src = imgBrutePath;

  const startDrawing = (e) => { isDrawing = true; [lastX, lastY] = getPos(e, canvas); };
  const stopDrawing = () => { isDrawing = false; };

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', (e) => move(e, canvas, ctx));
  window.addEventListener('mouseup', stopDrawing);
  
  canvas.addEventListener('touchstart', (e) => { 
    if(e.cancelable) e.preventDefault(); 
    startDrawing(e);
  }, {passive: false});
  
  canvas.addEventListener('touchmove', (e) => {
    if(e.cancelable) e.preventDefault();
    move(e, canvas, ctx);
  }, {passive: false});
}

function getPos(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return [
    (clientX - rect.left) * (canvas.width / rect.width),
    (clientY - rect.top) * (canvas.height / rect.height)
  ];
}

function move(e, canvas, ctx) {
  if (!isDrawing || isFinished) return;
  const [x, y] = getPos(e, canvas);
  
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.restore();
  
  [lastX, lastY] = [x, y];
  if (Math.random() > 0.8) checkProgress(e, canvas, ctx);
}

function checkProgress(e, canvas, ctx) {
  const startXPercent = 0.48; 
  const widthPercent = 0.40;  
  const startYPercent = 0.44; 
  const heightPercent = 0.50; 

  const scanStartX = Math.floor(canvas.width * startXPercent);
  const scanWidth = Math.floor(canvas.width * widthPercent);
  const scanStartY = Math.floor(canvas.height * startYPercent);
  const scanHeight = Math.floor(canvas.height * heightPercent);

  const p1 = { x: scanWidth * 0.20, y: scanHeight * 0.10 }; 
  const p2 = { x: scanWidth * 0.01, y: scanHeight * 0.25 }; 
  const p3 = { x: scanWidth * 0.85, y: scanHeight * 0.85 };

  const imageData = ctx.getImageData(scanStartX, scanStartY, scanWidth, scanHeight);
  const pixels = imageData.data;
  let transparent = 0;
  let totalInTriangle = 0;

  const area = 0.5 * (-p2.y * p3.x + p1.y * (-p1.x + p3.x) + p1.x * p2.y + p2.x * (p1.y - p3.y) + p3.y * p1.x);

  const isInsideTriangle = (px, py) => {
    const s = 1 / (2 * area) * (p1.y * p3.x - p1.x * p3.y + (p3.y - p1.y) * px + (p1.x - p3.x) * py);
    const t = 1 / (2 * area) * (p1.x * p2.y - p1.y * p2.x + (p1.y - p2.y) * px + (p2.x - p1.x) * py);
    return s > 0 && t > 0 && (1 - s - t) > 0;
  };

  for (let i = 0; i < pixels.length; i += 4) {
    const idx = i / 4;
    const x = idx % scanWidth;
    const y = Math.floor(idx / scanWidth);

    if (isInsideTriangle(x, y)) {
      totalInTriangle++;
      if (pixels[i + 3] < 150) transparent++;
    }
  }

  const percent = (transparent / totalInTriangle) * 100;

  if (percent > 45 && !isFinished) {
    isFinished = true;
    victory();
  }
}

function victory() {
  if (anvilSound) anvilSound.play().catch(() => {});
  fireworkExplosion();

  const popup = document.createElement('div');
  popup.className = 'fixed inset-0 z-[1001] flex items-center justify-center p-4 opacity-0 transition-opacity duration-500 ease-out';
  
  popup.innerHTML = `
    <div class="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
    <div class="relative bg-[#f0e8dd] p-8 rounded-xl border-2 border-accent shadow-2xl text-center max-w-sm transform scale-90 transition-transform duration-500 ease-out" id="popup-content">
      <div class="text-4xl mb-4">⚒️</div>
      <h2 class="text-2xl font-serif font-bold text-accent mb-2">Hamon Révélé !</h2>
      <p class="text-muted mb-6 text-sm">Le travail de l'acier n'a plus de secret pour vous.</p>
      <div class="bg-white/50 border-2 border-dashed border-accent p-4 rounded-lg mb-6">
        <span class="text-[10px] uppercase tracking-widest block opacity-60">Code Promo</span>
        <span class="text-3xl font-mono font-bold text-[#7a2a2a]">${_0xbc21}</span>
      </div>
      <button id="close-victory" class="bg-accent text-bg px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">Merci !</button>
    </div>
  `;
  document.body.appendChild(popup);

  requestAnimationFrame(() => {
    popup.classList.replace('opacity-0', 'opacity-100');
    document.getElementById('popup-content')?.classList.replace('scale-90', 'scale-100');
  });

  document.getElementById('close-victory').onclick = () => {
    popup.classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => popup.remove(), 500);
  };
}

function fireworkExplosion() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  for (let i = 0; i < 60; i++) {
    const spark = document.createElement('div');
    const color = ['#ff9d00', '#ffdb00', '#ffffff', '#ff5400'][Math.floor(Math.random() * 4)];
    const size = Math.random() * 5 + 2;
    spark.style.cssText = `position: fixed; left: ${centerX}px; top: ${centerY}px; width: ${size}px; height: ${size}px; background: ${color}; border-radius: 50%; pointer-events: none; z-index: 2000; box-shadow: 0 0 15px ${color}, 0 0 5px white;`;
    document.body.appendChild(spark);
    const angle = Math.random() * Math.PI * 2;
    const velocity = 10 + Math.random() * 15;
    const destX = Math.cos(angle) * velocity * 30;
    const destY = Math.sin(angle) * velocity * 30;
    spark.animate([{ transform: 'translate(0, 0) scale(1)', opacity: 1 }, { transform: `translate(${destX}px, ${destY + 150}px) scale(0)`, opacity: 0 }], { duration: 1000 + Math.random() * 800, easing: 'cubic-bezier(0, .9, .57, 1)', fill: 'forwards' }).onfinish = () => spark.remove();
  }
}