document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const burgerBtn = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-discover-btn');

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

  window.addEventListener('scroll', () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mobileMenu?.classList.contains('is-open')) {
      setMenuState(false);
    }
  });

  const hourHand = document.getElementById('hero-hour');
  const minuteHand = document.getElementById('hero-minute');
  const secondHand = document.getElementById('hero-second');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateWatchHands = () => {
    if (!hourHand || !minuteHand || !secondHand) return;
    const now = new Date();
    const ms = now.getMilliseconds();
    const sec = now.getSeconds() + ms / 1000;
    const min = now.getMinutes() + sec / 60;
    const hrs = (now.getHours() % 12) + min / 60;

    hourHand.style.transform = `rotate(${hrs * 30}deg)`;
    minuteHand.style.transform = `rotate(${min * 6}deg)`;
    secondHand.style.transform = `rotate(${sec * 6}deg)`;

    if (!prefersReducedMotion) requestAnimationFrame(updateWatchHands);
  };
  updateWatchHands();

  const revealElements = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-above');
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
          entry.target.classList.toggle('is-above', entry.boundingClientRect.top < 0);
        }
      });
    }, { threshold: 0.12, rootMargin: '-64px 0px -64px 0px' });
    revealElements.forEach((el) => revealObserver.observe(el));
  }

  const TIMEPIECES = {
    classic: {
      ref: 'Арт. VL-01',
      material: '18к Розовое золото',
      title: 'Classic',
      price: 'CHF 28,400',
      selectValue: 'Classic (Арт. VL-01)',
      desc: 'Ультратонкий 39-мм корпус, ручные золотые метки, обсидиановый циферблат и 72-часовой запас хода.',
      specs: [
        { label: 'Калибр', value: 'V-192 Ручной' },
        { label: 'Диаметр', value: '39.0 мм' },
        { label: 'Запас хода', value: '72 часа' },
        { label: 'Водозащита', value: '50 метров' }
      ],
    },
    sport: {
      ref: 'Арт. VL-04',
      material: 'Титан Grade 5',
      title: 'Sport',
      price: 'CHF 34,900',
      selectValue: 'Sport (Арт. VL-04)',
      desc: '41-мм корпус из титана для экстремальных условий. Керамический безель, завинчивающаяся головка и 300м водозащиты.',
      specs: [
        { label: 'Калибр', value: 'V-410 Автоматический' },
        { label: 'Диаметр', value: '41.5 мм' },
        { label: 'Запас хода', value: '72 часа' },
        { label: 'Водозащита', value: '300 метров' }
      ],
    },
    phantom: {
      ref: 'Арт. VL-09',
      material: 'Кованый карбон и DLC',
      title: 'Phantom',
      price: 'CHF 42,500',
      selectValue: 'Phantom (Арт. VL-09)',
      desc: 'Скрытный дизайн в титане с DLC-покрытием. Утопленные золотые мосты и антибликовое сапфировое стекло.',
      specs: [
        { label: 'Калибр', value: 'V-900 Открытый' },
        { label: 'Диаметр', value: '41.0 мм' },
        { label: 'Запас хода', value: '80 часов' },
        { label: 'Водозащита', value: '100 метров' }
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
    modalSpecs.innerHTML = watch.specs.map((spec) => `<div><dt class="modal-spec-term">${spec.label}</dt><dd class="modal-spec-val">${spec.value}</dd></div>`).join('');
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
    btn.addEventListener('click', () => openModal(btn.getAttribute('data-inspect')));
  });

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });

  modalReserve?.addEventListener('click', () => {
    const watch = TIMEPIECES[activeModelKey];
    if (watch && modelSelect) modelSelect.value = watch.selectValue;
    closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (modal?.classList.contains('is-open')) closeModal();
      if (mobileMenu?.classList.contains('is-open')) setMenuState(false);
    }
  });

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
      feedback.textContent = 'Пожалуйста, введите ваше имя.';
      feedback.classList.add('is-error');
      nameInput?.focus();
      return;
    }
    if (!emailValid) {
      feedback.textContent = 'Пожалуйста, введите корректный email.';
      feedback.classList.add('is-error');
      emailInput?.focus();
      return;
    }
    feedback.classList.remove('is-error');
    feedback.textContent = `Спасибо, ${name}. Наш консьерж в Женеве свяжется с вами для подтверждения просмотра модели ${model}.`;
    form.reset();
  });
});
