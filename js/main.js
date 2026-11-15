document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const burgerBtn = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-discover-btn');

  /* ------------------------------------------------------------------------
     1. Floating Navigation & Mobile Menu Overlay
     ------------------------------------------------------------------------ */
  const setMenuState = (open) => {
    if (!burgerBtn || !mobileMenu) return;
    burgerBtn.classList.toggle('is-active', open);
    burgerBtn.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  };

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('is-open');
      setMenuState(!isOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!header) return;
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    },
    { passive: true }
  );

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mobileMenu?.classList.contains('is-open')) {
      setMenuState(false);
    }
  });

  /* ------------------------------------------------------------------------
     2. Live Watch Dial Movement (Hero CSS Timepiece)
     ------------------------------------------------------------------------ */
  const hourHand = document.getElementById('hero-hour');
  const minuteHand = document.getElementById('hero-minute');
  const secondHand = document.getElementById('hero-second');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateWatchHands = () => {
    if (!hourHand || !minuteHand || !secondHand) return;

    const now = new Date();
    const milliseconds = now.getMilliseconds();
    const seconds = now.getSeconds() + milliseconds / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    const secondDeg = seconds * 6;
    const minuteDeg = minutes * 6;
    const hourDeg = hours * 30;

    hourHand.style.transform = `rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    secondHand.style.transform = `rotate(${secondDeg}deg)`;

    if (!prefersReducedMotion) {
      requestAnimationFrame(updateWatchHands);
    }
  };

  updateWatchHands();

  /* ------------------------------------------------------------------------
     3. Bidirectional Scroll Reveal via Intersection Observer
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('is-above');
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
            entry.target.classList.toggle('is-above', entry.boundingClientRect.top < 0);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '-64px 0px -64px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------------
     4. Timepiece Detail Modal
     ------------------------------------------------------------------------ */
  const TIMEPIECES = {
    classic: {
      ref: 'Ref. VL-01',
      material: '18k Rose Gold',
      title: 'Classic',
      price: 'CHF 28,400',
      selectValue: 'Classic (Ref. VL-01)',
      desc: 'An exercise in pure proportion. The Classic houses our ultra-thin hand-wound Calibre V-192 inside a mirror-beveled 39mm 18k rose gold case with a deep obsidian lacquer dial.',
      specs: [
        { label: 'Calibre', value: 'V-192 Manual' },
        { label: 'Case Diameter', value: '39.0 mm' },
        { label: 'Power Reserve', value: '72 Hours' },
        { label: 'Water Resistance', value: '50 Meters' },
      ],
    },
    sport: {
      ref: 'Ref. VL-04',
      material: 'Grade 5 Titanium',
      title: 'Sport',
      price: 'CHF 34,900',
      selectValue: 'Sport (Ref. VL-04)',
      desc: 'Machined from solid aerospace Grade 5 titanium, the Sport unites chronometric discipline with extreme endurance, featuring a ceramic tachymeter bezel and integrated screw-down crown.',
      specs: [
        { label: 'Calibre', value: 'V-410 Automatic' },
        { label: 'Case Diameter', value: '41.5 mm' },
        { label: 'Power Reserve', value: '72 Hours' },
        { label: 'Water Resistance', value: '300 Meters' },
      ],
    },
    phantom: {
      ref: 'Ref. VL-09',
      material: 'Forged Carbon & DLC',
      title: 'Phantom',
      price: 'CHF 42,500',
      selectValue: 'Phantom (Ref. VL-09)',
      desc: 'Stealth architecture paired with warm gold micro-mechanics. Micro-blasted DLC titanium frames recessed gold bridges beneath a glare-free domed sapphire crystal.',
      specs: [
        { label: 'Calibre', value: 'V-900 Openworked' },
        { label: 'Case Diameter', value: '41.0 mm' },
        { label: 'Power Reserve', value: '80 Hours' },
        { label: 'Water Resistance', value: '100 Meters' },
      ],
    },
  };

  const modal = document.getElementById('watch-modal');
  const modalClose = document.getElementById('modal-close');
  const modalRef = document.getElementById('modal-ref');
  const modalMaterial = document.getElementById('modal-material');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalSpecs = document.getElementById('modal-specs');
  const modalPrice = document.getElementById('modal-price');
  const modalReserve = document.getElementById('modal-reserve');
  const modelSelect = document.getElementById('client-model');

  let activeModelKey = 'classic';

  const openModal = (modelKey) => {
    const watch = TIMEPIECES[modelKey];
    if (!watch || !modal) return;

    activeModelKey = modelKey;
    modalRef.textContent = watch.ref;
    modalMaterial.textContent = watch.material;
    modalTitle.textContent = watch.title;
    modalDesc.textContent = watch.desc;
    modalPrice.textContent = watch.price;

    modalSpecs.innerHTML = watch.specs
      .map(
        (spec) => `
          <div>
            <dt class="modal-spec-term">${spec.label}</dt>
            <dd class="modal-spec-val">${spec.value}</dd>
          </div>
        `
      )
      .join('');

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modalClose?.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  document.querySelectorAll('[data-inspect]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modelKey = btn.getAttribute('data-inspect');
      openModal(modelKey);
    });
  });

  modalClose?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  modalReserve?.addEventListener('click', () => {
    const watch = TIMEPIECES[activeModelKey];
    if (watch && modelSelect) {
      modelSelect.value = watch.selectValue;
    }
    closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (modal?.classList.contains('is-open')) {
        closeModal();
      }
      if (mobileMenu?.classList.contains('is-open')) {
        setMenuState(false);
      }
    }
  });

  /* ------------------------------------------------------------------------
     5. Private Salon Appointment Form
     ------------------------------------------------------------------------ */
  const form = document.getElementById('appointment-form');
  const feedback = document.getElementById('form-feedback');

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!feedback) return;

    const nameInput = document.getElementById('client-name');
    const emailInput = document.getElementById('client-email');
    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const model = modelSelect?.value || '';

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name) {
      feedback.textContent = 'Please enter your full name.';
      feedback.classList.add('is-error');
      nameInput?.focus();
      return;
    }

    if (!emailValid) {
      feedback.textContent = 'Please provide a valid email address.';
      feedback.classList.add('is-error');
      emailInput?.focus();
      return;
    }

    feedback.classList.remove('is-error');
    feedback.textContent = `Thank you, ${name}. Our Geneva concierge will confirm your private viewing for ${model}.`;
    form.reset();
  });
});
