(function () {
  // Update this with your GitHub username
  const GITHUB_USERNAME = 'mhasnatkhan';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const navbar = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const backToTop = document.getElementById('back-to-top');
  const scrollProgress = document.getElementById('scroll-progress');
  const preloader = document.getElementById('preloader');
  const themeToggle = document.getElementById('theme-toggle');
  const cursorGlow = document.getElementById('cursor-glow');
  const typedTextEl = document.getElementById('typed-text');

  const typedPhrases = [
    'Frontend Developer',
    'UI/UX Designer',
    'React Enthusiast',
    'AI Explorer'
  ];

  let typedIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function setMobileNavOpen(isOpen) {
    navLinks.classList.toggle('active', isOpen);
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  hamburger.addEventListener('click', () => {
    setMobileNavOpen(!navLinks.classList.contains('active'));
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => setMobileNavOpen(false));
  });

  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    const navOffset = 100;
    let current = sections[0]?.getAttribute('id') || '';

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = sections[sections.length - 1].getAttribute('id');
    } else {
      const scrollPosition = window.scrollY + navOffset;
      sections.forEach(section => {
        if (scrollPosition >= section.offsetTop) {
          current = section.getAttribute('id');
        }
      });
    }

    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('href') === '#' + current);
    });
  }

  function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    navbar.classList.toggle('scrolled', scrollTop > 40);
    backToTop.classList.toggle('visible', scrollTop > 500);
    scrollProgress.style.width = `${progress}%`;
    updateActiveNav();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('load', handleScroll);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function typeText() {
    if (!typedTextEl || prefersReducedMotion) {
      if (typedTextEl) typedTextEl.textContent = typedPhrases[0];
      return;
    }

    const current = typedPhrases[typedIndex];
    const speed = isDeleting ? 40 : 80;

    if (!isDeleting) {
      typedTextEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeText, 1800);
        return;
      }
    } else {
      typedTextEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        typedIndex = (typedIndex + 1) % typedPhrases.length;
      }
    }

    setTimeout(typeText, speed);
  }

  function animateCounters(container) {
    (container || document).querySelectorAll('[data-count]').forEach(el => {
      if (el.dataset.animated === 'true') return;

      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.dataset.animated = 'true';
        }
      }

      requestAnimationFrame(tick);
    });
  }

  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);

        if (entry.target.closest('.hero-stats, .about-stats') || entry.target.classList.contains('hero-stats') || entry.target.classList.contains('about-stats')) {
          animateCounters(entry.target.closest('.hero-stats, .about-stats') || entry.target);
        }
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters(entry.target);
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(heroStats);
  }

  const aboutStats = document.querySelector('.about-stats');
  if (aboutStats) {
    const aboutCounterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters(entry.target);
          aboutCounterObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    aboutCounterObserver.observe(aboutStats);
  }

  const progressBars = document.querySelectorAll('.progress');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.setProperty('--progress-width', bar.dataset.width);
        bar.classList.add('animated');
        progressObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => progressObserver.observe(bar));

  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });

      projectCards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !show);
        if (show) {
          card.classList.remove('filter-out');
          requestAnimationFrame(() => card.classList.add('filter-in'));
        } else {
          card.classList.remove('filter-in');
          card.classList.add('filter-out');
        }
      });
    });
  });

  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.getElementById('testimonial-dots');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  let testimonialIndex = 0;
  let testimonialTimer;

  function showTestimonial(index) {
    testimonialIndex = (index + testimonialCards.length) % testimonialCards.length;
    testimonialCards.forEach((card, i) => {
      card.classList.toggle('active', i === testimonialIndex);
    });
    document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === testimonialIndex);
      dot.setAttribute('aria-selected', i === testimonialIndex ? 'true' : 'false');
    });
  }

  function startTestimonialAutoPlay() {
    if (prefersReducedMotion) return;
    clearInterval(testimonialTimer);
    testimonialTimer = setInterval(() => showTestimonial(testimonialIndex + 1), 5000);
  }

  if (testimonialCards.length && testimonialDots) {
    testimonialCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `testimonial-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => {
        showTestimonial(i);
        startTestimonialAutoPlay();
      });
      testimonialDots.appendChild(dot);
    });

    prevBtn?.addEventListener('click', () => {
      showTestimonial(testimonialIndex - 1);
      startTestimonialAutoPlay();
    });

    nextBtn?.addEventListener('click', () => {
      showTestimonial(testimonialIndex + 1);
      startTestimonialAutoPlay();
    });

    startTestimonialAutoPlay();
  }

  document.querySelectorAll('.tilt-card').forEach(card => {
    if (prefersReducedMotion || isTouchDevice) return;

    card.addEventListener('mousemove', (e) => {
      card.classList.add('is-tilting');
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / rect.height) * -8;
      const rotateY = ((x - rect.width / 2) / rect.width) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-tilting');
      card.style.transform = '';
    });
  });

  if (cursorGlow && !isTouchDevice && !prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
      cursorGlow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = themeToggle?.querySelector('i');
    if (icon) {
      icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  const savedTheme = localStorage.getItem('theme');
  const systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(savedTheme || (systemLight ? 'light' : 'dark'));

  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
  });

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    formStatus.hidden = false;
    formStatus.textContent = 'Thanks for your message! I will get back to you soon.';
    formStatus.className = 'form-status form-status--success';
    contactForm.reset();
  });

  function createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  document.querySelectorAll('.btn, .filter-btn, .theme-toggle, .testimonial-btn, .back-to-top').forEach(el => {
    el.addEventListener('click', createRipple);
  });

  async function loadGitHubStats() {
    const loading = document.getElementById('github-loading');
    const content = document.getElementById('github-content');
    const error = document.getElementById('github-error');

    if (!loading || !content || !error) return;

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=4`)
      ]);

      if (!userRes.ok) throw new Error('User not found');

      const user = await userRes.json();
      const repos = reposRes.ok ? await reposRes.json() : [];

      document.getElementById('github-avatar').src = user.avatar_url;
      document.getElementById('github-avatar').alt = user.name || user.login;
      document.getElementById('github-name').textContent = user.name || user.login;
      document.getElementById('github-bio').textContent = user.bio || 'Frontend developer building open-source projects.';
      document.getElementById('github-profile-link').href = user.html_url;
      document.getElementById('github-repos').textContent = user.public_repos;
      document.getElementById('github-followers').textContent = user.followers;
      document.getElementById('github-following').textContent = user.following;

      const sinceYear = new Date(user.created_at).getFullYear();
      document.getElementById('github-since').textContent = sinceYear;

      const reposList = document.getElementById('github-repos-list');
      reposList.innerHTML = '';

      if (repos.length === 0) {
        reposList.innerHTML = '<p class="github-empty">No public repositories yet.</p>';
      } else {
        repos.forEach(repo => {
          const card = document.createElement('a');
          card.href = repo.html_url;
          card.className = 'github-repo-card';
          card.target = '_blank';
          card.rel = 'noopener noreferrer';
          card.innerHTML = `
            <h5><i class="fas fa-book"></i> ${repo.name}</h5>
            <p>${repo.description || 'No description provided.'}</p>
            <div class="github-repo-meta">
              ${repo.language ? `<span><span class="lang-dot"></span> ${repo.language}</span>` : ''}
              <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
              <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
            </div>
          `;
          reposList.appendChild(card);
        });
      }

      loading.classList.add('hidden');
      content.classList.remove('hidden');
    } catch {
      loading.classList.add('hidden');
      error.classList.remove('hidden');
    }
  }

  window.addEventListener('load', () => {
    typeText();
    loadGitHubStats();
    setTimeout(() => {
      preloader?.classList.add('hidden');
      document.body.classList.add('loaded');
    }, prefersReducedMotion ? 0 : 900);
  });
})();
