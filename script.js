(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const header = document.querySelector('.site-header');
  const headerLogos = document.querySelector('.header-logos');
  const progress = document.querySelector('.scroll-progress');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const headerBrand = document.querySelector('.site-header .brand');


  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max ? window.scrollY / max : 0})`;
    if (headerLogos) headerLogos.classList.toggle('is-hidden', window.scrollY > 40);
    if (headerBrand) headerBrand.classList.toggle('is-hidden', window.scrollY > 40);

  };
  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive: true });


  toggle?.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    nav?.classList.toggle('open', !isOpen);
  });
  navLinks.forEach((link) => link.addEventListener('click', () => {
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open menu');
    nav?.classList.remove('open');
  }));

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -35px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else revealItems.forEach((item) => item.classList.add('is-visible'));

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-42% 0px -50% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const counters = document.querySelectorAll('[data-count]');
  let countersStarted = false;
  const animateCounters = () => {
    if (countersStarted) return;
    countersStarted = true;
    counters.forEach((counter) => {
      const target = Number(counter.dataset.count);
      const start = performance.now();
      const duration = 1000;
      const tick = (now) => {
        const progressValue = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progressValue, 3);
        counter.textContent = `${Math.round(target * eased)}+`;
        if (progressValue < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };
  const stats = document.querySelector('.hero-stats');
  if (stats && 'IntersectionObserver' in window && !reducedMotion) {
    new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) { animateCounters(); observer.disconnect(); }
    }, { threshold: .65 }).observe(stats);
  } else animateCounters();

  if (!reducedMotion && finePointer) {
    document.querySelectorAll('.card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', `${x}%`);
        card.style.setProperty('--my', `${y}%`);
      }, { passive: true });
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      });
    });

    document.querySelectorAll('.member-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 3}deg) translateY(-8px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      img.classList.add('is-missing');
      img.parentElement?.classList.add('image-missing');
    });
  });
})();
