// src/scripts/features/carte-3d.js
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.card-3d-wrapper');
    if (!wrapper) return;

    const card = wrapper.querySelector('.card-3d');
    const cardGlow = wrapper.querySelector('.card-glow');
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
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const nx = (x - rect.width / 2) / (rect.width / 2);
      const ny = (rect.height / 2 - y) / (rect.height / 2);
      targetRx = clamp(ny * TILT_MAX_DEG, -TILT_MAX_DEG, TILT_MAX_DEG);
      targetRy = clamp(nx * TILT_MAX_DEG, -TILT_MAX_DEG, TILT_MAX_DEG);
    }

    function setIdle() {
      if (!hasInteracted) wrapper.classList.add('idle');
    }
    function unsetIdle() {
      wrapper.classList.remove('idle');
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(setIdle, IDLE_DELAY);
    }

    function startInviteLoop() {
      inviteTimer = setInterval(() => {
        if (hasInteracted) return;
        isAnimatingHint = true;
        wrapper.classList.add('hint-flip');
        setTimeout(() => {
          wrapper.classList.remove('hint-flip');
          isAnimatingHint = false;
        }, 1000);
      }, INVITE_INTERVAL);
    }

    function stopInvitations() {
      hasInteracted = true;
      wrapper.classList.remove('idle', 'hint-flip');
      clearInterval(inviteTimer);
      isAnimatingHint = false;
    }

    wrapper.addEventListener('mousemove', (e) => {
      unsetIdle();
      setTilt(e);
    });
    wrapper.addEventListener('mouseleave', () => {
      targetRx = 0;
      targetRy = 0;
    });
    wrapper.addEventListener('click', () => {
      isFlipped = !isFlipped;
      stopInvitations();
    });
    wrapper.addEventListener(
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
  });
}
