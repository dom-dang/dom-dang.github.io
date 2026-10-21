(() => {
  const portfolio = document.getElementById('portfolio');
  if (!portfolio) return;

  const buttons = portfolio.querySelectorAll('[data-filter]');
  const projects = [...portfolio.querySelectorAll('[data-category]')];
  const groups = portfolio.querySelectorAll('[data-project-group]');
  const navigation = document.querySelector('.project-section-nav');

  function filterProjects(filter) {
    let visibleIndex = 0;

    buttons.forEach(button => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    projects.forEach(project => {
      const visible = filter === 'all' || project.dataset.category === filter;
      project.hidden = !visible;
      if (project.classList.contains('project-row')) {
        project.classList.toggle('project-row-reversed', visible && visibleIndex % 2 === 1);
        if (visible) visibleIndex++;
      }
    });

    groups.forEach(group => {
      group.hidden = [...group.querySelectorAll('[data-category]')].every(project => project.hidden);
    });

    navigation?.querySelectorAll('a').forEach(link => {
      link.hidden = document.getElementById(link.hash.slice(1)).hidden;
    });

    portfolio.dispatchEvent(new CustomEvent('projectfilter'));
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => filterProjects(button.dataset.filter));
  });

  filterProjects('all');
})();
