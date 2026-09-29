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

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle = document.querySelector('.motion-toggle');
let userPaused = false;
try { userPaused = localStorage.getItem('portfolio-motion-paused') === 'true'; } catch {}
const canAnimate = () => !reducedMotion.matches && !userPaused;
const detailAnimations = new Map();
function updateMotion() {
  document.body.classList.toggle('motion-paused', userPaused || reducedMotion.matches);
  if (motionToggle) {
    motionToggle.hidden = false;
    motionToggle.textContent = reducedMotion.matches ? 'Reduced motion enabled' : userPaused ? 'Enable animations' : 'Pause animations';
    motionToggle.setAttribute('aria-pressed', String(userPaused || reducedMotion.matches));
    motionToggle.disabled = reducedMotion.matches;
  }
  if (!canAnimate()) {
    for (const [details, animation] of detailAnimations) {
      animation.cancel(); details.style.overflow = ''; details.style.height = '';
    }
    detailAnimations.clear();
  }
}
motionToggle?.addEventListener('click', () => {
  userPaused = !userPaused;
  try { localStorage.setItem('portfolio-motion-paused', String(userPaused)); } catch {}
  updateMotion();
});
reducedMotion.addEventListener('change', updateMotion);
updateMotion();

document.querySelectorAll('.job details').forEach(details => {
  const summary = details.querySelector('summary');
  summary.addEventListener('click', event => {
    if (!canAnimate() || !details.animate) return;
    event.preventDefault();
    detailAnimations.get(details)?.cancel();
    const from = details.getBoundingClientRect().height;
    const opening = !details.open;
    if (opening) details.open = true;
    const to = opening ? details.scrollHeight : summary.getBoundingClientRect().height;
    details.style.overflow = 'hidden';
    const animation = details.animate([{height:`${from}px`},{height:`${to}px`}], {duration:280,easing:'cubic-bezier(.22,1,.36,1)'});
    detailAnimations.set(details,animation);
    animation.onfinish = () => {
      details.open = opening;
      details.style.overflow = '';
      detailAnimations.delete(details);
    };
  });
});

if ('IntersectionObserver' in window) {
  const jobs = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-reading',entry.isIntersecting));
  }, {threshold:.2});
  document.querySelectorAll('.job').forEach(job => jobs.observe(job));
}
let scrollQueued = false;
function updateProgress() {
  const total = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty('--read-progress', String(total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0));
  scrollQueued = false;
}
addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateProgress); }
}, {passive:true});
addEventListener('resize',updateProgress);
updateProgress();
