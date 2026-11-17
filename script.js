/* ==========================================
   Global Utility Functions
   ========================================== */

/* ==========================================
   DOM Event Listener Initialization
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const endpoint = contactForm.dataset.endpoint.trim();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formStatus = document.getElementById('contactFormStatus');

    if (endpoint) {
      contactForm.action = endpoint;
      contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!contactForm.reportValidity()) return;

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        formStatus.textContent = 'Sending your message...';

        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { Accept: 'application/json' }
          });
          const result = await response.json();

          if (!response.ok || result.success === 'false' || result.success === false) {
            throw new Error(result.message || 'Message delivery failed.');
          }

          contactForm.reset();
          formStatus.textContent = 'Your message was sent. Thank you for getting in touch.';
        } catch {
          formStatus.textContent = 'Your message could not be sent. Please email sagorchandrahowlader@gmail.com directly.';
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = 'Send message';
        }
      });
    }
  }

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const updateThemeToggle = () => {
      const isDark = document.documentElement.dataset.theme === 'dark';
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
      themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀' : '☾';
      themeToggle.querySelector('.theme-label').textContent = isDark ? 'Light mode' : 'Dark mode';
    };

    updateThemeToggle();
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = nextTheme;
      try {
        localStorage.setItem('portfolio-theme', nextTheme);
      } catch {
        // Keep the selected theme for this page view when storage is unavailable.
      }
      updateThemeToggle();
    });
  }

  const glassToggle = document.getElementById('glassToggle');
  if (glassToggle) {
    let glassEnabled = false;
    try {
      glassEnabled = localStorage.getItem('portfolio-glass') === 'true';
    } catch {
      // Glass mode remains available for this page view when storage is unavailable.
    }

    const updateGlass = () => {
      document.documentElement.dataset.glass = String(glassEnabled);
      glassToggle.setAttribute('aria-pressed', String(glassEnabled));
      glassToggle.textContent = `Glass: ${glassEnabled ? 'on' : 'off'}`;
    };

    updateGlass();
    glassToggle.addEventListener('click', () => {
      glassEnabled = !glassEnabled;
      updateGlass();
      try {
        localStorage.setItem('portfolio-glass', String(glassEnabled));
      } catch {
        // Keep the selected effect for this page view.
      }
    });
  }
  
  // 1. Set current copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Header scroll detection
  const nav = document.getElementById('siteNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // 3. Mobile navigation toggle & click outside to close
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    const toggleNav = (open) => {
      const isOpen = open !== undefined ? open : !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navLinks.inert = !isOpen && window.matchMedia('(max-width: 760px)').matches;
    };

    toggleNav(false);

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNav();
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleNav(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navLinks.classList.contains('open')) {
        toggleNav(false);
        navToggle.focus();
      }
    });

    const desktopViewport = window.matchMedia('(min-width: 761px)');
    const closeNavOnViewportChange = () => toggleNav(false);
    if (desktopViewport.addEventListener) {
      desktopViewport.addEventListener('change', closeNavOnViewportChange);
    } else {
      desktopViewport.addListener(closeNavOnViewportChange);
    }

    // Close when clicking outside menu
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !nav.contains(e.target)) {
        toggleNav(false);
      }
    });
  }

  // 4. Scroll reveal observer
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      revealEls.forEach(el => revealObserver.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('is-visible'));
    }
  }

  // 5. Animate skill bars when they enter the viewport
  const skillsSection = document.querySelector('.skills-progress-section');
  if (skillsSection && 'IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.progress-fill').forEach(fill => {
            const targetWidth = fill.dataset.width;
            if (targetWidth) fill.style.width = targetWidth;
          });
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    skillObserver.observe(skillsSection);
  } else if (skillsSection) {
    skillsSection.querySelectorAll('.progress-fill').forEach(fill => {
      fill.style.width = fill.dataset.width || '0%';
    });
  }

});
