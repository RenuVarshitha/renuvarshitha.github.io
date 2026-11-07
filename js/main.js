(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(pointer: coarse)').matches;

  /* ---------------- Theme toggle ---------------- */
  (function themeToggle() {
    var btn = document.getElementById('themeToggle');
    var stored = null;
    try { stored = localStorage.getItem('renu-theme'); } catch (e) {}

    if (stored === 'dark' || stored === 'light') {
      document.body.setAttribute('data-theme', stored);
    }

    function current() {
      return document.body.getAttribute('data-theme') === 'dark' ||
        (!document.body.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'dark' : 'light';
    }

    function apply(theme) {
      document.body.setAttribute('data-theme', theme);
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      try { localStorage.setItem('renu-theme', theme); } catch (e) {}
    }

    apply(current());

    btn.addEventListener('click', function () {
      apply(current() === 'dark' ? 'light' : 'dark');
    });
  })();

  /* ---------------- Mobile nav ---------------- */
  (function mobileNav() {
    var header = document.querySelector('.masthead');
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('primaryNav');

    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  })();

  /* ---------------- Scroll progress bar ---------------- */
  (function progressBar() {
    var fill = document.getElementById('progressFill');
    function update() {
      var scrollTop = window.scrollY;
      var height = document.documentElement.scrollHeight - window.innerHeight;
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      fill.style.width = pct + '%';
    }
    document.addEventListener('scroll', update, { passive: true });
    update();
  })();

  /* ---------------- Rotating headline ---------------- */
  (function rotator() {
    var el = document.getElementById('rotator');
    if (!el) return;
    var words = ['Treasurer', 'Financial Analyst', 'MSc Corporate Finance student', 'ACCA candidate (4/13)', 'Banking & Finance research enthusiast'];

    if (reduceMotion) {
      el.textContent = words[0];
      return;
    }

    var wordIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var word = words[wordIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
        setTimeout(tick, 55);
      } else {
        charIndex--;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, 30);
      }
    }
    setTimeout(tick, 900);
  })();

  /* ---------------- Scroll reveal ---------------- */
  (function scrollReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () { entry.target.classList.add('is-visible'); }, (i % 4) * 90);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(function (t) { observer.observe(t); });
  })();

  /* ---------------- Custom cursor ---------------- */
  (function customCursor() {
    if (isTouch || reduceMotion) return;

    document.body.classList.add('has-cursor');
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function loop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(loop);
    }
    loop();

    var hoverables = document.querySelectorAll('a, button, .tilt-card, input, textarea');
    hoverables.forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-active'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-active'); });
    });
  })();

  /* ---------------- Magnetic buttons ---------------- */
  (function magnetic() {
    if (isTouch || reduceMotion) return;
    var items = document.querySelectorAll('.magnetic');

    items.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + x * 0.25 + 'px,' + y * 0.35 + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'translate(0,0)';
      });
    });
  })();

  /* ---------------- Tilt cards ---------------- */
  (function tilt() {
    if (isTouch || reduceMotion) return;
    var cards = document.querySelectorAll('.tilt-card');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(600px) rotateX(' + (y * -6) + 'deg) rotateY(' + (x * 6) + 'deg) translateY(-2px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  })();

  /* ---------------- Back to top ---------------- */
  (function backToTop() {
    var btn = document.getElementById('backToTop');
    function toggleVisibility() {
      if (window.scrollY > window.innerHeight) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }
    document.addEventListener('scroll', toggleVisibility, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    toggleVisibility();
  })();

  /* ---------------- Contact form (Web3Forms) ---------------- */
  (function contactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var submitBtn = document.getElementById('submitBtn');
    var status = document.getElementById('formStatus');

    var fields = {
      name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
      email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
      subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
      message: { el: document.getElementById('message'), error: document.getElementById('messageError') }
    };

    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(key, message) {
      var field = fields[key];
      field.error.textContent = message;
      field.el.closest('.field').classList.toggle('has-error', !!message);
    }

    function validate() {
      var valid = true;

      if (!fields.name.el.value.trim()) { setError('name', 'Please enter your name.'); valid = false; }
      else { setError('name', ''); }

      if (!fields.email.el.value.trim()) { setError('email', 'Please enter your email.'); valid = false; }
      else if (!emailRe.test(fields.email.el.value.trim())) { setError('email', 'Please enter a valid email address.'); valid = false; }
      else { setError('email', ''); }

      if (!fields.subject.el.value.trim()) { setError('subject', 'Please enter a subject.'); valid = false; }
      else { setError('subject', ''); }

      if (!fields.message.el.value.trim()) { setError('message', 'Please enter a message.'); valid = false; }
      else { setError('message', ''); }

      return valid;
    }

    Object.keys(fields).forEach(function (key) {
      fields[key].el.addEventListener('blur', validate);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validate()) return;

      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      status.textContent = '';
      status.className = 'form__status';

      var formData = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');

          if (data.success) {
            status.textContent = 'Thank you — your message has been sent. I will get back to you soon.';
            status.className = 'form__status is-success';
            form.reset();
          } else {
            status.textContent = 'Something went wrong sending your message. Please email chrenu67@gmail.com directly.';
            status.className = 'form__status is-error';
          }
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
          status.textContent = 'Network error — please try again or email chrenu67@gmail.com directly.';
          status.className = 'form__status is-error';
        });
    });
  })();

})();
