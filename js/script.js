/* ==========================================================================
   Techmaster Builders, Inc. — Site Scripts (vanilla JS, no dependencies)
   Modules: header · navigation · scroll-spy · reveal · project filter ·
            project modal · accordion · quote form · mobile bar · misc
   ========================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------------------------------------------------------------
     1. Sticky header — solid background once the page scrolls
  --------------------------------------------------------------------- */
  const header = $('[data-header]');
  function updateHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  /* ---------------------------------------------------------------------
     2. Mobile navigation (hamburger)
  --------------------------------------------------------------------- */
  const nav = $('#site-nav');
  const navToggle = $('[data-nav-toggle]');

  function setMenu(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    document.body.classList.toggle('no-scroll', open);
    document.body.classList.toggle('menu-is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      const first = $('.nav__link', nav);
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 150);
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
  }

  // Close the menu after choosing a link, on Escape, or when resizing to desktop
  $$('a', nav || document.createElement('div')).forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav && nav.classList.contains('is-open')) {
      setMenu(false);
      navToggle.focus();
    }
  });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  // Keep keyboard focus inside the open mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !nav || !nav.classList.contains('is-open')) return;
    const focusables = [navToggle, ...$$('a', nav)];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------------------------------------------------------------------
     3. Smooth scrolling for in-page links (respects reduced motion)
  --------------------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = id === '#top' ? document.body : document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = id === '#top' || id === '#home' ? 0 : target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    // Move focus for keyboard / screen-reader users without jumping
    if (target !== document.body) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    history.replaceState(null, '', id === '#top' ? '#home' : id);
  });

  /* ---------------------------------------------------------------------
     4. Active navigation indicator (scroll-spy)
  --------------------------------------------------------------------- */
  const navLinks = $$('.nav__link');
  const spySections = navLinks
    .map((l) => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  function updateActiveLink() {
    const probe = window.scrollY + window.innerHeight * 0.35;
    let current = spySections[0];
    spySections.forEach((sec) => { if (sec.offsetTop <= probe) current = sec; });
    navLinks.forEach((l) => {
      const active = current && l.getAttribute('href') === '#' + current.id;
      l.classList.toggle('is-active', active);
      if (active) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
    });
  }

  /* ---------------------------------------------------------------------
     5. Scroll-triggered reveal animations
  --------------------------------------------------------------------- */
  const revealEls = $$('.reveal, [data-timeline]');
  // Stagger siblings that reveal together
  $$('.services__grid, .pillars, .timeline, .values, .trust__inner').forEach((group) => {
    $$('.reveal', group).forEach((el, i) => el.style.setProperty('--reveal-delay', (i * 0.08) + 's'));
  });

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------------------
     6. Project filter
  --------------------------------------------------------------------- */
  const filterBtns = $$('[data-filter]');
  const projects = $$('.project');
  const emptyMsg = $('[data-projects-empty]');
  const FADE_MS = reducedMotion.matches ? 0 : 280;
  let filterTimer;

  function applyFilter(cat) {
    clearTimeout(filterTimer);
    filterBtns.forEach((b) => {
      const on = b.dataset.filter === cat;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });

    const show = (p) => cat === 'all' || p.dataset.category === cat;

    // Phase 1: fade out cards that will be hidden
    projects.forEach((p) => { if (!show(p) && !p.hidden) p.classList.add('is-hiding'); });

    filterTimer = setTimeout(() => {
      let visible = 0;
      projects.forEach((p) => {
        p.classList.remove('is-hiding');
        if (show(p)) {
          visible++;
          if (p.hidden) {
            p.hidden = false;
            p.classList.add('is-entering');
            requestAnimationFrame(() => requestAnimationFrame(() => p.classList.remove('is-entering')));
          }
        } else {
          p.hidden = true;
        }
      });
      // Single-item categories look better without the wide/tall spans
      $('[data-projects]').classList.toggle('is-filtered', cat !== 'all');
      if (emptyMsg) emptyMsg.hidden = visible > 0;
    }, FADE_MS);
  }

  filterBtns.forEach((btn) => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));

  /* ---------------------------------------------------------------------
     7. Project modal / lightbox
  --------------------------------------------------------------------- */
  const modal = $('[data-modal]');
  let lastFocus = null;

  function openModal(card) {
    if (!modal) return;
    lastFocus = document.activeElement;
    const img = $('img', card);
    $('[data-modal-img]', modal).src = card.dataset.image || (img && img.src) || '';
    $('[data-modal-img]', modal).alt = img ? img.alt : '';
    $('[data-modal-cat]', modal).textContent = $('.project__cat', card).textContent;
    $('[data-modal-title]', modal).textContent = card.dataset.title || $('.project__title', card).textContent;
    $('[data-modal-loc]', modal).textContent = card.dataset.location || '';
    $('[data-modal-desc]', modal).textContent = card.dataset.description || '';
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    $('.modal__close', modal).focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  }

  $$('[data-project-open]').forEach((btn) => btn.addEventListener('click', () => openModal(btn.closest('.project'))));
  $$('[data-modal-close]').forEach((el) => el.addEventListener('click', closeModal));
  const modalCta = $('[data-modal-cta]');
  if (modalCta) modalCta.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (!modal || modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') {
      const f = $$('button, a[href]', modal).filter((el) => el.offsetParent !== null);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------------------------------------------------------------------
     8. FAQ accordion (animated height, one open at a time)
  --------------------------------------------------------------------- */
  const triggers = $$('.accordion__trigger');

  function togglePanel(btn, open) {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.setAttribute('aria-expanded', String(open));
    if (reducedMotion.matches) { panel.hidden = !open; return; }

    if (open) {
      panel.hidden = false;
      const h = panel.scrollHeight;
      panel.style.height = '0px';
      requestAnimationFrame(() => { panel.style.height = h + 'px'; });
    } else {
      panel.style.height = panel.scrollHeight + 'px';
      requestAnimationFrame(() => { panel.style.height = '0px'; });
    }
    panel.addEventListener('transitionend', function done(ev) {
      if (ev.propertyName !== 'height') return;
      panel.removeEventListener('transitionend', done);
      panel.style.height = '';
      if (btn.getAttribute('aria-expanded') !== 'true') panel.hidden = true;
    });
  }

  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const willOpen = btn.getAttribute('aria-expanded') !== 'true';
      triggers.forEach((other) => { if (other !== btn && other.getAttribute('aria-expanded') === 'true') togglePanel(other, false); });
      togglePanel(btn, willOpen);
    });
  });

  /* ---------------------------------------------------------------------
     9. Quote / inquiry form — validation + submission
     Set data-endpoint on the <form> to post to Web3Forms, Formspree,
     a custom PHP script, etc. Empty endpoint = demo mode.
  --------------------------------------------------------------------- */
  const form = $('[data-quote-form]');
  const success = $('[data-form-success]');
  const statusEl = $('[data-form-status]');

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^[+()\-\s\d]{7,20}$/;

  const rules = {
    full_name: (v) => (v.trim().length >= 2 ? '' : 'Please enter your full name.'),
    email: (v) => (!v.trim() ? 'Please enter your email address.' : EMAIL_RE.test(v.trim()) ? '' : 'Please enter a valid email address (e.g. name@company.com).'),
    phone: (v) => (!v.trim() ? 'Please enter your phone number.' : PHONE_RE.test(v.trim()) && v.replace(/\D/g, '').length >= 7 ? '' : 'Please enter a valid phone number.'),
    project_type: (v) => (v ? '' : 'Please select a project type.'),
    project_location: (v) => (v.trim() ? '' : 'Please enter the project location.'),
    message: (v) => (v.trim().length >= 10 ? '' : 'Please tell us a little about your project (at least 10 characters).'),
  };

  function validateField(input) {
    const rule = rules[input.name];
    if (!rule) return true;
    const msg = rule(input.value);
    const field = input.closest('.field');
    const err = document.getElementById(input.getAttribute('aria-describedby'));
    field.classList.toggle('is-invalid', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg;
    return !msg;
  }

  if (form) {
    const inputs = $$('input, select, textarea', form).filter((el) => rules[el.name]);

    // Validate on blur; re-validate live once a field has been flagged
    inputs.forEach((input) => {
      input.addEventListener('blur', () => { if (input.value) validateField(input); });
      input.addEventListener('input', () => { if (input.closest('.field').classList.contains('is-invalid')) validateField(input); });
      input.addEventListener('change', () => { if (input.tagName === 'SELECT') validateField(input); });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusEl.textContent = '';

      let firstInvalid = null;
      inputs.forEach((input) => { if (!validateField(input) && !firstInvalid) firstInvalid = input; });
      if (firstInvalid) {
        firstInvalid.focus();
        statusEl.textContent = 'Please review the highlighted fields.';
        return;
      }

      // Honeypot: silently "succeed" for bots
      if (form.company_website && form.company_website.value) { showSuccess(); return; }

      const btn = $('[data-submit]', form);
      const label = $('.btn__label', btn);
      const original = label.textContent;
      btn.disabled = true;
      label.textContent = 'Sending…';

      try {
        const endpoint = (form.dataset.endpoint || '').trim();
        if (endpoint) {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: new FormData(form),
          });
          if (!res.ok) throw new Error('Request failed: ' + res.status);
        } else {
          // Demo mode — no backend connected yet
          await new Promise((r) => setTimeout(r, 700));
        }
        showSuccess();
      } catch (err) {
        statusEl.textContent = 'Sorry, something went wrong sending your inquiry. Please call 0917 899 4346 or email techmasterbuilders@gmail.com.';
      } finally {
        btn.disabled = false;
        label.textContent = original;
      }
    });

    const resetBtn = $('[data-form-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        $$('.field', form).forEach((f) => f.classList.remove('is-invalid'));
        $$('[aria-invalid]', form).forEach((el) => el.removeAttribute('aria-invalid'));
        success.hidden = true;
        form.hidden = false;
        $('input:not([type="hidden"]):not([tabindex="-1"])', form).focus();
      });
    }
  }

  function showSuccess() {
    form.hidden = true;
    success.hidden = false;
    success.focus();
  }

  // Service cards pre-select the matching project type in the form
  $$('[data-service]').forEach((card) => {
    card.addEventListener('click', () => {
      const select = $('#f-type');
      if (select) select.value = card.dataset.service;
    });
  });

  /* ---------------------------------------------------------------------
     10. Mobile action bar — appears after the hero, hides near the form
  --------------------------------------------------------------------- */
  const mobileBar = $('.mobile-bar');
  const hero = $('.hero');
  const quoteSection = $('#quote');

  function updateMobileBar() {
    if (!mobileBar || !hero) return;
    const pastHero = window.scrollY > hero.offsetHeight * 0.6;
    let atForm = false;
    if (quoteSection) {
      const r = quoteSection.getBoundingClientRect();
      atForm = r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5;
    }
    mobileBar.classList.toggle('is-visible', pastHero && !atForm);
  }

  /* ---------------------------------------------------------------------
     11. Scroll handler (rAF-throttled) + init
  --------------------------------------------------------------------- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateHeader();
      updateActiveLink();
      updateMobileBar();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  updateHeader();
  updateActiveLink();
  updateMobileBar();

  // Footer year
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
