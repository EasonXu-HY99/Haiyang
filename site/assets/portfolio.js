const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
if (menu && nav) {
  document.body.classList.add('enhanced');
  menu.hidden = false;
  const closeMenu = () => {
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.querySelector('span').textContent = '＋';
  };
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(open));
    menu.querySelector('span').textContent = open ? '−' : '＋';
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menu.focus(); }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
}
const filters = document.querySelector('.note-filters');
if (filters) {
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    let visible = 0;
    document.querySelectorAll('.note').forEach(note => {
      note.hidden = button.dataset.filter !== 'All' && note.dataset.category !== button.dataset.filter;
      if (!note.hidden) visible++;
    });
    filters.querySelectorAll('button').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    document.querySelector('#filter-status').textContent = `${visible} ${button.dataset.filter === 'All' ? '' : button.dataset.filter.toLowerCase() + ' '}notes shown.`;
  });
}
if ('IntersectionObserver' in window) {
  const sections = document.querySelectorAll('main section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      nav?.querySelectorAll('a[href^="#"]').forEach(link => {
        if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px' });
  sections.forEach(section => observer.observe(section));
}
