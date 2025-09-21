// src/scripts/features/carte-3d.js

export function initCarte3D(root) {
  if (!root) return;

  const card = root.querySelector('.card-3d');
  const cardGlow = root.querySelector('.card-glow');
  if (!card) return;

  const TILT_MAX_DEG = 10;
  const CARD_LERP = 0.38;
  const FLIP_LERP = 0.46;
  const GLOW_TILT_INFLUENCE = 1.5;
  const IDLE_DELAY = 3000;
  const INVITE_INTERVAL = 3000;

  let isFlipped = false;
  let rx = 0, ry = 0;
  let targetRx = 0, targetRy = 0;
  let flipProgress = 0;
  let hasInteracted = false;
  let idleTimeout;
  let inviteTimer;
  let isAnimatingHint = false;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerpTo = (v, target, f) => v + (target - v) * f;

  function animate() {
    if (!isAnimatingHint) {
      rx = lerpTo(rx, targetRx, CARD_LERP);
      ry = lerpTo(ry, targetRy, CARD_LERP);
    }

    flipProgress = lerpTo(flipProgress, isFlipped ? 1 : 0, FLIP_LERP);

    const flipAngle = flipProgress * 180;
    card.style.transform = `rotateY(${flipAngle}deg) rotateX(${rx}deg) rotateY(${ry}deg)`;
    card.style.boxShadow = `${ry * -3.2}px ${rx * 3.2}px 46px rgba(0,0,0,0.4)`;

    if (cardGlow) {
      const glowX = 50 + ry * GLOW_TILT_INFLUENCE;
      const glowY = 50 - rx * GLOW_TILT_INFLUENCE;
      cardGlow.style.setProperty('--glowX', `${glowX}%`);
      cardGlow.style.setProperty('--glowY', `${glowY}%`);
      cardGlow.style.opacity = String(1 - flipProgress);
    }

    requestAnimationFrame(animate);
  }

  function setTilt(e) {
    if (isAnimatingHint) return;
    const rect = root.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const nx = (x - rect.width / 2) / (rect.width / 2);
    const ny = (rect.height / 2 - y) / (rect.height / 2);
    targetRx = clamp(ny * TILT_MAX_DEG, -TILT_MAX_DEG, TILT_MAX_DEG);
    targetRy = clamp(nx * TILT_MAX_DEG, -TILT_MAX_DEG, TILT_MAX_DEG);
  }

  function setIdle() {
    if (!hasInteracted) root.classList.add('idle');
  }
  function unsetIdle() {
    root.classList.remove('idle');
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(setIdle, IDLE_DELAY);
  }

  function startInviteLoop() {
    inviteTimer = setInterval(() => {
      if (hasInteracted) return;
      isAnimatingHint = true;
      root.classList.add('hint-flip');
      setTimeout(() => {
        root.classList.remove('hint-flip');
        isAnimatingHint = false;
      }, 1000);
    }, INVITE_INTERVAL);
  }

  function stopInvitations() {
    hasInteracted = true;
    root.classList.remove('idle', 'hint-flip');
    clearInterval(inviteTimer);
    isAnimatingHint = false;
  }

  root.addEventListener('mousemove', (e) => {
    unsetIdle();
    setTilt(e);
  });
  root.addEventListener('mouseleave', () => {
    targetRx = 0;
    targetRy = 0;
  });
  root.addEventListener('click', () => {
    isFlipped = !isFlipped;
    stopInvitations();
  });
  root.addEventListener(
    'touchstart',
    () => {
      stopInvitations();
      unsetIdle();
    },
    { passive: true }
  );

  setIdle();
  startInviteLoop();
  animate();
}

// --- Initialisation globale si besoin ---
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card-3d-wrapper').forEach((wrapper) => {
      initCarte3D(wrapper);
    });
  });
}
