// interactions: drawer menu, hero slideshow (autoplay + swipe), counters, testimonials
document.addEventListener('DOMContentLoaded', () => {
  // Drawer menu
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('drawer');
  const drawerClose = document.getElementById('drawerClose');
  const backdrop = document.getElementById('backdrop');
  function openDrawer(){
    drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false');
    backdrop.hidden = false; backdrop.classList.add('visible');
    document.documentElement.style.overflow='hidden';
    hamburger.setAttribute('aria-expanded','true');
  }
  function closeDrawer(){
    drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true');
    backdrop.classList.remove('visible'); backdrop.hidden = true;
    document.documentElement.style.overflow='';
    hamburger.setAttribute('aria-expanded','false');
  }
  if(hamburger) hamburger.addEventListener('click', () => openDrawer());
  if(drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if(backdrop) backdrop.addEventListener('click', closeDrawer);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href'); if(href === '#') return;
      const id = href.slice(1); const el = document.getElementById(id);
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); closeDrawer(); }
    });
  });

  // Lazy load hero images (set src from data-src)
  document.querySelectorAll('.hero-img').forEach(img => {
    const src = img.getAttribute('data-src');
    if(src){ img.src = src; img.removeAttribute('data-src'); img.loading = 'lazy'; }
  });

  // Hero slideshow
  const imgs = Array.from(document.querySelectorAll('.hero-img'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  let current = 0;
  const delay = 4500;
  let timer = null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(i){
    imgs.forEach((im,idx)=> im.classList.toggle('active', idx===i));
    dots.forEach((d,idx)=> d.classList.toggle('active', idx===i));
    current = i;
  }
  function next(){ show((current+1)%imgs.length); }
  if(!reduced){ timer = setInterval(next, delay); }

  // Dot clicks
  dots.forEach(d => d.addEventListener('click', ()=> { show(Number(d.dataset.i)); if(timer){ clearInterval(timer); timer = setInterval(next, delay);} }));

  // swipe support for hero
  let startX = null;
  const hero = document.querySelector('.hero');
  // Only add listeners if hero exists
  if (hero) {
    hero.addEventListener('touchstart', (e)=> startX = e.touches[0].clientX, {passive:true});
    hero.addEventListener('touchend', (e)=> {
      if(startX===null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if(Math.abs(dx) > 40){ if(dx < 0) next(); else show((current-1+imgs.length)%imgs.length); }
      startX = null;
    });

    // Pause on hover (desktop)
    hero.addEventListener('mouseenter', ()=> { if(timer) clearInterval(timer); });
    hero.addEventListener('mouseleave', ()=> { if(!reduced) timer = setInterval(next, delay); });
  }

  // Counter animate on view
  const projects = document.getElementById('countProjects');
  if(projects){
    const target = parseInt(projects.dataset.target || '0', 10);
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          let start = 0; const dur = 1400; const t0 = performance.now();
          function step(now){
            const elapsed = now - t0;
            const p = Math.min(elapsed/dur,1);
            const v = Math.floor((1 - Math.pow(1-p,3)) * target);
            projects.textContent = v.toLocaleString();
            if(p < 1) requestAnimationFrame(step); else projects.textContent = target.toLocaleString();
          }
          requestAnimationFrame(step);
          o.disconnect();
        }
      });
    }, {threshold:0.4});
    obs.observe(projects);
  }

  // Testimonials carousel
  const prev = document.querySelector('.tbtn.prev');
  const nextBtn = document.querySelector('.tbtn.next');
  const slides = Array.from(document.querySelectorAll('.test-slide'));
  let tIdx = 0;
  function showTest(i){ slides.forEach((s,idx)=> s.classList.toggle('active', idx===i)); tIdx = i; }
  if(prev) prev.addEventListener('click', ()=> showTest((tIdx-1+slides.length)%slides.length));
  if(nextBtn) nextBtn.addEventListener('click', ()=> showTest((tIdx+1)%slides.length));
  setInterval(()=> showTest((tIdx+1)%slides.length), 8000);

  // newsletter (simple)
  const sub = document.getElementById('subscribe');
  if(sub) sub.addEventListener('submit', e => {
    e.preventDefault(); const em = document.getElementById('email'); if(!em.value || !/^\S+@\S+\.\S+$/.test(em.value)){ alert('Enter valid email'); return; }
    em.value=''; alert('Thanks — subscribed! (demo)');
  });

  // back to top & year
  const top = document.getElementById('top');
  if(top) top.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
  const y = document.getElementById('curYear'); if(y) y.textContent = new Date().getFullYear();

  // close drawer on resize if desktop
  window.addEventListener('resize', ()=> { if(window.innerWidth >= 720){ closeDrawer(); } });

  // helper: closeDrawer reference
  function closeDrawer(){ drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); backdrop.classList.remove('visible'); backdrop.hidden = true; document.documentElement.style.overflow=''; if(hamburger) hamburger.setAttribute('aria-expanded','false'); }
});
