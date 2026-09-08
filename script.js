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
