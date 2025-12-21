// hero.js - Auto-rotating background slideshow + counter
document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.hero .slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dots .dot'));
  const autoPlayInterval = 4500; // ms
  let current = 0;
  let timer = null;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showSlide(idx, announce = true) {
    slides.forEach((s, i) => {
      const isActive = i === idx;
      s.classList.toggle('show', isActive);
      s.setAttribute('aria-hidden', String(!isActive));
      // optionally set id for aria-controls
      s.id = `slide-${i}`;
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === idx);
      d.setAttribute('aria-selected', String(i === idx));
    });
    current = idx;
  }

  function nextSlide() {
    const next = (current + 1) % slides.length;
    showSlide(next);
  }

  // attach dot events
  dots.forEach(d => {
    d.addEventListener('click', (e) => {
      const idx = Number(d.dataset.index);
      showSlide(idx);
      restartTimer();
    });
  });

  // autoplay (only if user doesn't prefer reduced motion)
  function startTimer() {
    if (prefersReduced) return;
    stopTimer();
    timer = setInterval(nextSlide, autoPlayInterval);
  }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
  function restartTimer() { stopTimer(); startTimer(); }

  // initialize
  showSlide(0);
  startTimer();

  // Pause on hover/touch to be friendly
  const heroEl = document.getElementById('hero');
  heroEl.addEventListener('mouseenter', stopTimer);
  heroEl.addEventListener('mouseleave', startTimer);
  heroEl.addEventListener('touchstart', stopTimer, {passive:true});
  heroEl.addEventListener('touchend', startTimer, {passive:true});

  // PROJECTS COUNTER: animate when in viewport
  const countEl = document.getElementById('projects-count');
  if (countEl) {
    const target = parseInt(countEl.dataset.target || '0', 10);

    function animateCount() {
      let start = 0;
      const duration = 1600; // ms
      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const currentVal = Math.floor(eased * target);
        countEl.textContent = currentVal.toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else countEl.textContent = target.toLocaleString();
      }
      requestAnimationFrame(step);
    }

    // Use IntersectionObserver to detect when hero is visible
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount();
          obs.disconnect();
        }
      });
    }, {threshold: 0.35});
    obs.observe(document.getElementById('hero'));
  }

  // Keyboard accessibility for dots (left/right move)
  document.addEventListener('keydown', (e) => {
    if (['ArrowLeft','ArrowRight'].includes(e.key)) {
      if (e.key === 'ArrowLeft') {
        showSlide((current - 1 + slides.length) % slides.length);
        restartTimer();
      } else {
        showSlide((current + 1) % slides.length);
        restartTimer();
      }
    }
  });

});
