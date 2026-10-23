(() => {
  const body = document.body;
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav-links');
  const progress = document.getElementById('progress-bar');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      const icon = toggle.querySelector('.menu-icon'); if (icon) icon.textContent = open ? '×' : '＋';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); const icon=toggle.querySelector('.menu-icon'); if(icon) icon.textContent='＋'; }));
  }
  const updateProgress = () => { const max = document.documentElement.scrollHeight - innerHeight; if (progress) progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`; };
  addEventListener('scroll', updateProgress, {passive:true}); updateProgress();
  // Content is visible by default. Reveal animations are progressive enhancements only.
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    body.classList.add('js-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('in-view'); observer.unobserve(entry.target); } }), {threshold:.08, rootMargin:'0px 0px -35px 0px'});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    document.querySelectorAll('.reveal-word').forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i%5,4)*70}ms`; observer.observe(el); el.classList.add('reveal');});
  }
  const details = {
    cad: {kicker:'LEARNING EXPERIENCE / 01',title:'AutoCAD foundations',body:'A six-week online AutoCAD course with Zylphon (June–July 2026). Focus areas include learning the drafting interface, drawing and editing geometry, using dimensions, and presenting technical drawings clearly. This entry describes training experience rather than claiming professional CAD project delivery.'},
    space: {kicker:'DIGITAL CONCEPT / 02',title:'Abandoned but not Forgotten',body:'A beginner-level NASA Space Apps Challenge concept exploring how abandoned or inactive human-made objects in space can be communicated through an accessible web experience. The project is a digital concept, not a validated aerospace research tool.'},
    portfolio: {kicker:'INTERACTION DESIGN / 03',title:'An evolving digital portfolio',body:'A responsive portfolio built with HTML, CSS, and JavaScript. The interface experiments with editorial typography, a mechanical-orbit visual, scroll reveals, responsive project cards, and accessible navigation.'}
  };
  const dialog = document.getElementById('project-dialog'); const close = document.getElementById('dialog-close');
  document.querySelectorAll('[data-project]').forEach(card => card.addEventListener('click', () => {
    const item = details[card.dataset.project]; if(!item || !dialog) return;
    document.getElementById('dialog-kicker').textContent=item.kicker; document.getElementById('dialog-title').textContent=item.title;
    const content=document.getElementById('dialog-body'); content.textContent=''; const p=document.createElement('p'); p.textContent=item.body; content.appendChild(p);
    if(typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open','');
  }));
  if(close && dialog) close.addEventListener('click',()=>dialog.close());
  if(dialog) dialog.addEventListener('click',e=>{if(e.target===dialog) dialog.close();});
  // Subtle pointer parallax is limited to fine-pointer devices.
  const art=document.querySelector('.hero-art');
  if(art && matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches){ addEventListener('pointermove',e=>{const x=(e.clientX/innerWidth-.5)*8; const y=(e.clientY/innerHeight-.5)*8; art.style.marginLeft=`${x}px`; art.style.marginTop=`${y}px`;},{passive:true}); }
})();
