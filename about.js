// about.js - small interactions for About page
document.addEventListener('DOMContentLoaded', () => {

  // KPI counter (projects)
  const kpi = document.querySelector('.kpi-val[data-target]');
  if(kpi){
    const target = parseInt(kpi.dataset.target || '0', 10);
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const startTime = performance.now();
          const duration = 1400;
          function step(now){
            const elapsed = now - startTime;
            const p = Math.min(elapsed / duration, 1);
            const val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
            kpi.textContent = val.toLocaleString();
            if(p < 1) requestAnimationFrame(step); else kpi.textContent = target.toLocaleString();
          }
          requestAnimationFrame(step);
          observer.disconnect();
        }
      });
    }, {threshold: 0.4});
    obs.observe(kpi);
  }

  // Timeline reveal on scroll
  const items = document.querySelectorAll('.tl-item');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) e.target.classList.add('in-view');
    });
  }, {threshold: 0.18});
  items.forEach(i => io.observe(i));

  // Team card click -> simple lightbox of image
  document.querySelectorAll('.team-card img, .founder-photo').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      const src = img.getAttribute('src');
      openLightbox(src);
    });
  });

  function openLightbox(src){
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = 0;
    overlay.style.background = 'rgba(3,6,8,0.8)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 9999;
    overlay.innerHTML = `<img src="${src}" style="max-width:92%;max-height:92%;border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,0.6)"><button aria-label="close" style="position:absolute;top:20px;right:20px;background:transparent;border:0;color:#fff;font-size:30px;cursor:pointer">×</button>`;
    document.body.appendChild(overlay);
    overlay.querySelector('button').addEventListener('click', () => document.body.removeChild(overlay));
    overlay.addEventListener('click', (e) => { if(e.target === overlay) document.body.removeChild(overlay); });
  }

  // Footer subscribe demo handled in footer.js (already included)

  // Set footer year (if present)
  const fy = document.getElementById('footer-year');
  if(fy) fy.textContent = new Date().getFullYear();

  // Make nav highlight active (About)
  document.querySelectorAll('.nav-desktop .nav-link, .mobile-nav .mobile-link').forEach(a => {
    if(a.getAttribute('href')?.includes('about')) { a.classList.add('active'); }
  });

});
