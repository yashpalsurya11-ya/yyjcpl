/* header.js - toggle mobile menu, close on ESC, smooth active link highlight */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menu-toggle') || document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('mobile-backdrop');
  const closeBtn = document.getElementById('mobile-close');

  function openMenu(){
    if(toggle){
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded','true');
    }
    if(mobileMenu){
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden','false');
      mobileMenu.focus?.();
    }
    if(backdrop){
      backdrop.classList.add('visible');
      backdrop.setAttribute('aria-hidden','false');
    }
    document.documentElement.style.overflow = 'hidden';
  }

  function closeMenu(){
    if(toggle){
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    }
    if(mobileMenu){
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden','true');
    }
    if(backdrop){
      backdrop.classList.remove('visible');
      backdrop.setAttribute('aria-hidden','true');
    }
    document.documentElement.style.overflow = '';
  }

  if(toggle){
    toggle.addEventListener('click', () => {
      const expanded = toggle.classList.contains('open');
      if(expanded) closeMenu(); else openMenu();
    });
  }
  if(closeBtn) closeBtn.addEventListener('click', closeMenu);
  if(backdrop) backdrop.addEventListener('click', closeMenu);

  // Close menu on Escape
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeMenu();
  });

  // Smooth scroll + active link highlight
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(!href || href === '#') return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if(el){
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMenu();
      }
    });
  });

  // Highlight nav link based on scroll position (basic)
  const sections = Array.from(document.querySelectorAll('main section[id], header a[href^="#"]'));
  const links = Array.from(document.querySelectorAll('.nav-desktop .nav-link, .mobile-nav .mobile-link'));

  function syncActive(){
    const fromTop = window.scrollY + 120;
    let current = null;
    document.querySelectorAll('main section[id]').forEach(sec => {
      if(sec.offsetTop <= fromTop) current = sec.id;
    });
    links.forEach(link => {
      const href = link.getAttribute('href')?.replace('/', '');
      if(!href) return;
      if(href.includes('#')) {
        const id = href.split('#')[1];
        if(id === current) link.classList.add('active'); else link.classList.remove('active');
      }
    });
  }
  window.addEventListener('scroll', syncActive, {passive:true});
  window.addEventListener('load', syncActive);
});
