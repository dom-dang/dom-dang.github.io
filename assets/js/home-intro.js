(() => {
  const button = document.querySelector('.home-intro-fish');
  if (!button) return;

  const fish = button.querySelector('.home-intro-fish-icon');
  const ripples = button.querySelectorAll('.home-intro-ripple');
  const droplets = button.querySelector('.home-intro-droplets');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animations = [];
  let rippleTimer;
  let autoplayTimer;

  function resetSplash() {
    animations.forEach(animation => animation.cancel());
    animations = [];
    window.clearTimeout(rippleTimer);
    button.classList.remove('is-rippled');
  }

  function plop() {
    resetSplash();

    if (reducedMotion.matches || typeof fish.animate !== 'function') {
      button.classList.add('is-rippled');
      rippleTimer = window.setTimeout(() => button.classList.remove('is-rippled'), 900);
      return;
    }

    animations.push(fish.animate([
      { transform: 'translateY(0) rotate(0) scale(1)', opacity: 1, offset: 0 },
      { transform: 'translateY(-3px) rotate(-12deg) scale(1)', opacity: 1, offset: 0.18 },
      { transform: 'translateY(10px) rotate(55deg) scale(0.2)', opacity: 0, offset: 0.4 },
      { transform: 'translateY(10px) rotate(0) scale(0.2)', opacity: 0, offset: 0.64 },
      { transform: 'translateY(5px) rotate(-8deg) scale(0.85)', opacity: 1, offset: 0.8 },
      { transform: 'translateY(0) rotate(0) scale(1)', opacity: 1, offset: 1 }
    ], { duration: 1200, easing: 'ease-in-out' }));

    ripples.forEach((ripple, index) => {
      animations.push(ripple.animate([
        { transform: 'scale(0.35)', opacity: 0 },
        { transform: 'scale(0.65)', opacity: 0.7, offset: 0.2 },
        { transform: 'scale(1.55)', opacity: 0 }
      ], { duration: 650, delay: 420 + index * 130, easing: 'ease-out' }));
    });

    animations.push(droplets.animate([
      { transform: 'translateY(2px)', opacity: 0 },
      { transform: 'translateY(-4px)', opacity: 0.8, offset: 0.3 },
      { transform: 'translateY(-7px)', opacity: 0 }
    ], { duration: 420, delay: 420, easing: 'ease-out' }));
  }

  function schedulePlop() {
    window.clearTimeout(autoplayTimer);
    if (document.hidden || reducedMotion.matches || typeof fish.animate !== 'function') return;

    autoplayTimer = window.setTimeout(() => {
      plop();
      schedulePlop();
    }, 7000);
  }

  button.addEventListener('click', () => {
    plop();
    schedulePlop();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) resetSplash();
    schedulePlop();
  });

  reducedMotion.addEventListener('change', () => {
    resetSplash();
    schedulePlop();
  });

  schedulePlop();
})();
