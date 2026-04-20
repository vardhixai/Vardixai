// ============================================================
//   VARDHIX AI — Premium JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== AOS (Scroll Animations) =====
  initAOS();
  document.body.style.overflow = 'auto';

  // ===== NAVBAR =====
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navCta = document.getElementById('navCta');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    // Back to top
    const btt = document.getElementById('backToTop');
    if (window.scrollY > 400) btt.classList.add('visible');
    else btt.classList.remove('visible');
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    navCta.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      navCta.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });

  // ===== PARTICLE CANVAS =====
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const colors = [
    'rgba(124, 58, 237, 0.7)',
    'rgba(245, 158, 11, 0.7)',
    'rgba(59, 130, 246, 0.7)',
    'rgba(168, 85, 247, 0.5)',
  ];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.6 + 0.2;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.speedX; this.y += this.speedY;
      this.pulse += 0.02;
      this.opacity = 0.2 + Math.sin(this.pulse) * 0.3;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10; ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 130; i++) particles.push(new Particle());
  }
  initParticles();

  function drawConnections() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = 'rgba(124, 58, 237, 1)';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animFrame = requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ===== HERO COUNTER =====
  function countUp(el, target, duration = 2000) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { el.textContent = target; clearInterval(timer); return; }
      el.textContent = Math.floor(start);
    }, 16);
  }
  const heroStatNums = document.querySelectorAll('.stat-num');
  heroStatNums.forEach(el => {
    const target = parseInt(el.dataset.count);
    setTimeout(() => countUp(el, target, 2000), 2600);
  });

  // ===== SECTION COUNTER (Stats Section) =====
  const statCounters = document.querySelectorAll('.stat-counter');
  let statsTriggered = false;

  function triggerStats() {
    if (statsTriggered) return;
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      statsTriggered = true;
      statCounters.forEach(el => {
        const target = parseInt(el.dataset.target);
        countUp(el, target, 2200);
      });
    }
  }
  window.addEventListener('scroll', triggerStats);

  // ===== TECH TABS =====
  const techTabs = document.querySelectorAll('.tech-tab');
  const techPanels = document.querySelectorAll('.tech-panel');
  techTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      techTabs.forEach(t => t.classList.remove('active'));
      techPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel' + cap(tab.dataset.tab)).classList.add('active');
    });
  });
  function cap(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

  // ===== PORTFOLIO FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioCards.forEach(card => {
        const catString = card.dataset.category || '';
        const cats = catString.split(' ');
        if (filter === 'all' || cats.includes(filter)) {
          card.style.display = '';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ===== TESTIMONIALS SLIDER =====
  const testiTrack = document.getElementById('testiTrack');
  if (testiTrack) {
    const testiPrev = document.getElementById('testiPrev');
    const testiNext = document.getElementById('testiNext');
    const testiDots = document.querySelectorAll('.testi-dot');
    let currentSlide = 0;
    const totalSlides = 4;
    let autoSlide;

    function goToSlide(idx) {
      currentSlide = (idx + totalSlides) % totalSlides;
      testiTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      testiDots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    testiNext.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoSlide(); });
    testiPrev.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoSlide(); });
    testiDots.forEach(dot => dot.addEventListener('click', () => { goToSlide(parseInt(dot.dataset.index)); resetAutoSlide(); }));

    function startAutoSlide() { autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000); }
    function resetAutoSlide() { clearInterval(autoSlide); startAutoSlide(); }
    startAutoSlide();
  }

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('formSubmit');
      const originalBtnContent = btn.innerHTML;
      
      // Update UI to show sending state
      btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
      btn.style.pointerEvents = 'none';

      try {
        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: json
        });

        const result = await response.json();

        if (response.status == 200) {
          // Success
          btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
          btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
          formSuccess.classList.add('show');
          contactForm.reset();
        } else {
          // Error from API
          console.log(result);
          btn.innerHTML = '<span>Error Occurred</span><i class="fas fa-exclamation-triangle"></i>';
        }
      } catch (error) {
        // Network error
        console.log(error);
        btn.innerHTML = '<span>Error Occurred</span><i class="fas fa-exclamation-triangle"></i>';
      } finally {
        // Revert button after delay
        setTimeout(() => {
          btn.innerHTML = originalBtnContent;
          btn.style.background = '';
          btn.style.pointerEvents = '';
          formSuccess.classList.remove('show');
        }, 5000);
      }
    });
  }

  // ===== BACK TO TOP =====
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== AOS (Scroll Animations) =====
  function initAOS() {
    const aosEls = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.aosDelay || 0);
          setTimeout(() => entry.target.classList.add('aos-animated'), delay);
        }
      });
    }, { threshold: 0.12 });
    aosEls.forEach(el => observer.observe(el));
  }

  // ===== SMOOTH ANCHOR SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== NAVBAR ACTIVE STATE =====
  const sections = document.querySelectorAll('section[id], footer');
  const navLinksAll = document.querySelectorAll('.nav-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinksAll.forEach(link => {
          link.style.color = '#ffffff'; // Stay Pure White
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--gold-accent)'; // Highlight with Gold
          }
        });
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => sectionObserver.observe(s));

  // ===== TILT EFFECT ON CARDS =====
  const cards = document.querySelectorAll('.service-card, .team-card, .portfolio-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -(y - centerY) / 20;
      const rotateY = (x - centerX) / 20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ===== GLOWING EFFECT ON LOGO ===== 
  const logoEl = document.getElementById('navLogo');
  if (logoEl) {
    logoEl.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  console.log('%cVardhix AI', 'color: #f59e0b; font-size: 24px; font-weight: bold;');
  console.log('%cScaling Future with Innovation | AI · IoT · Software · App Development', 'color: #7c3aed; font-size: 14px;');
});
