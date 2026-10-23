(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('#year').textContent = new Date().getFullYear();

  // Reveal-on-scroll, with a graceful fallback for browsers without IntersectionObserver.
  const revealItems = $$('.reveal, .reveal-word');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -5% 0px' });
    revealItems.forEach((el, i) => { el.style.transitionDelay = `${Math.min((i % 4) * 70, 210)}ms`; observer.observe(el); });
  } else revealItems.forEach(el => el.classList.add('in-view'));

  // Scroll progress and gentle scene parallax.
  const progress = $('#progress-bar');
  let scrollTick = false;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    scrollTick = false;
  };
  window.addEventListener('scroll', () => { if (!scrollTick) { requestAnimationFrame(updateScroll); scrollTick = true; } }, { passive: true });
  updateScroll();

  // Navigation overlay.
  const toggle = $('#menu-toggle'), nav = $('#nav-links');
  const closeNav = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.innerHTML = 'MENU <span class="menu-icon">＋</span>'; document.body.classList.remove('menu-open'); };
  toggle.addEventListener('click', () => {
    const opening = !nav.classList.contains('open');
    nav.classList.toggle('open', opening); toggle.setAttribute('aria-expanded', String(opening));
    toggle.innerHTML = opening ? 'CLOSE <span class="menu-icon">×</span>' : 'MENU <span class="menu-icon">＋</span>';
    document.body.classList.toggle('menu-open', opening);
  });
  $$('#nav-links a').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  // Cursor and subtle hero depth on pointer devices only.
  const cursor = $('.cursor-dot'), heroArt = $('.hero-art');
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reduceMotion) {
    window.addEventListener('pointermove', e => {
      cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`;
      const x = (e.clientX / window.innerWidth - .5) * 18;
      const y = (e.clientY / window.innerHeight - .5) * 18;
      if (heroArt && window.scrollY < window.innerHeight) { heroArt.style.setProperty('--mx', `${x}px`); heroArt.style.setProperty('--my', `${y}px`); }
    }, { passive: true });
    $$('a, button').forEach(el => {
      el.addEventListener('pointerenter', () => { cursor.style.width = '24px'; cursor.style.height = '24px'; });
      el.addEventListener('pointerleave', () => { cursor.style.width = '12px'; cursor.style.height = '12px'; });
    });
  }

  // Project detail modal: labels concepts and learning work accurately.
  const projectData = {
    cad: { kicker: 'LEARNING EXPERIENCE / 01', title: 'AutoCAD foundations', body: '<p>A six-week online AutoCAD course with Zylphon, completed June–July 2026. This entry represents a learning experience, not a claim of professional CAD employment.</p><ul><li>Focus: developing familiarity with CAD drafting and technical drawing workflows.</li><li>Next step: add selected drawings and a short explanation of the design decisions once the work is ready to share.</li></ul>', link: 'mailto:shivanshsinghlu24@gmail.com?subject=AutoCAD%20learning' },
    space: { kicker: 'CONCEPT PROJECT / 02', title: 'Abandoned but not Forgotten', body: '<p>A beginner solo concept developed around the NASA Space Apps Challenge 2026. The idea explores how a web experience can help people discover and understand abandoned human-made objects or missions beyond Earth.</p><ul><li>Format: educational web concept.</li><li>Important: this card describes a concept and learning project; it does not imply NASA endorsement or official affiliation.</li><li>Next step: document sources, improve filtering and search, and make the research trail clear.</li></ul>', link: 'https://www.nasa.gov/' },
    portfolio: { kicker: 'INTERACTION PROJECT / 03', title: 'An evolving digital portfolio', body: '<p>This website is an experiment in making a portfolio feel like a guided experience rather than a static résumé.</p><ul><li>Scroll-triggered section reveals and kinetic typography.</li><li>Responsive layouts, a progress indicator, navigation overlay, and project detail dialog.</li><li>Built with HTML, CSS, and vanilla JavaScript for straightforward GitHub Pages deployment.</li></ul>', link: 'https://github.com/shivanshsinghlu24' }
  };
  const dialog = $('#project-dialog');
  $$('.project-card').forEach(card => card.addEventListener('click', () => {
    const data = projectData[card.dataset.project];
    if (!data) return;
    $('#dialog-kicker').textContent = data.kicker; $('#dialog-title').textContent = data.title;
    $('#dialog-body').innerHTML = data.body; $('#dialog-link').href = data.link;
    if (typeof dialog.showModal === 'function') dialog.showModal(); else alert(`${data.title}\n\nOpen this site in a modern browser to view full project details.`);
  }));
  $('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

  // Keep anchors smooth but avoid forced animation for reduced-motion preferences.
  if (reduceMotion) document.documentElement.style.scrollBehavior = 'auto';
})();
