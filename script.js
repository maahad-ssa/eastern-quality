document.addEventListener('DOMContentLoaded', function () {

  var header = document.getElementById('siteHeader');
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');
  var navLinks = document.querySelectorAll('.nav-link');

  /* ---- Header solid background after scroll ---- */
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('solid');
    } else {
      header.classList.remove('solid');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile hamburger menu ---- */
  hamburger.addEventListener('click', function () {
    var isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  /* ---- Smooth scroll for every nav link (desktop + mobile) ---- */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (!targetId || targetId.charAt(0) !== '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      var headerHeight = header.offsetHeight;
      var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu after navigating
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Active nav link highlighting on scroll ---- */
  var sections = ['overview', 'services', 'coverage', 'why', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function setActiveLink() {
    var scrollPos = window.pageYOffset + header.offsetHeight + 40;
    var currentId = null;

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }
  setActiveLink();
  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ---- Contact form: dynamic human-check + secure submit ---- */
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    var captchaLabel = document.getElementById('captchaLabel');
    var captchaAInput = document.getElementById('cf-captcha-a');
    var captchaBInput = document.getElementById('cf-captcha-b');
    var captchaAnswerInput = document.getElementById('cf-captcha');
    var submitBtn = document.getElementById('cfSubmit');
    var statusEl = document.getElementById('formStatus');

    function newCaptcha() {
      var a = Math.floor(Math.random() * 8) + 1;   // 1-8
      var b = Math.floor(Math.random() * 8) + 1;   // 1-8
      captchaAInput.value = a;
      captchaBInput.value = b;
      captchaLabel.textContent = 'Human check: what is ' + a + ' + ' + b + '?';
      captchaAnswerInput.value = '';
    }
    newCaptcha();

    function setStatus(message, type) {
      statusEl.textContent = message;
      statusEl.className = 'form-status' + (type ? ' ' + type : '');
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Client-side check mirrors the server-side check for instant feedback
      var expected = parseInt(captchaAInput.value, 10) + parseInt(captchaBInput.value, 10);
      var given = parseInt(captchaAnswerInput.value, 10);
      if (isNaN(given) || given !== expected) {
        setStatus('That answer doesn\u2019t look right — please try the sum again.', 'error');
        newCaptcha();
        return;
      }

      submitBtn.disabled = true;
      setStatus('Sending your message\u2026');

      // Build a descriptive email subject line from the visitor's chosen subject
      var subjectField = document.getElementById('cf-subject');
      var emailSubjectField = document.getElementById('cf-email-subject');
      if (subjectField && emailSubjectField) {
        emailSubjectField.value = 'New website enquiry: ' + subjectField.value;
      }

      var formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) { return res.json().catch(function () { return { success: false }; }); })
        .then(function (data) {
          if (data && data.success) {
            setStatus('Thank you \u2014 your message has been sent. We\u2019ll be in touch shortly.', 'success');
            contactForm.reset();
            newCaptcha();
          } else {
            setStatus((data && data.message) || 'Something went wrong. Please try again or email us directly.', 'error');
            newCaptcha();
          }
        })
        .catch(function () {
          setStatus('Could not send right now. Please try again shortly or email us directly.', 'error');
          newCaptcha();
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  /* ---- Back to top button ---- */
  var backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    if (window.scrollY > window.innerHeight * 0.6) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Reveal-on-scroll animation ---- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

});
