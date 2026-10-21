(() => {
  const navigation = document.querySelector('[data-section-nav]');
  if (!navigation) return;

  const root = document.querySelector(navigation.dataset.sectionNav);
  const links = [...navigation.querySelectorAll('a')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  const header = document.querySelector('.site-nav');
  let pending = false;

  function updateSection() {
    pending = false;
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const threshold = Math.max(headerHeight + 24, window.innerHeight * 0.25);
    const visibleSections = sections.filter(section => !section.hidden);
    let current = visibleSections[0];
    let currentTop = -Infinity;

    visibleSections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= threshold && top > currentTop + 1) {
        current = section;
        currentTop = top;
      }
    });

    const focusedSection = visibleSections.find(section => section.contains(document.activeElement));
    if (focusedSection && Math.abs(focusedSection.getBoundingClientRect().top - current.getBoundingClientRect().top) < 2) {
      current = focusedSection;
    }

    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      current = visibleSections[visibleSections.length - 1];
    }

    links.forEach((link, index) => {
      if (sections[index] === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });

    if (navigation.classList.contains('project-section-nav')) {
      const bounds = root.getBoundingClientRect();
      navigation.classList.toggle('is-in-view', bounds.top < window.innerHeight * 0.65 && bounds.bottom > headerHeight + 24);
    }
  }

  function scheduleUpdate() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(updateSection);
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  root.addEventListener('toggle', scheduleUpdate, true);
  root.addEventListener('focusin', scheduleUpdate);
  root.addEventListener('projectfilter', scheduleUpdate);
  updateSection();
})();
