// ========================
// CODE FORGE RPG — App Logic
// ========================

document.addEventListener('DOMContentLoaded', () => {

  // === XP BAR ANIMATIONS ===
  // Animate all XP bars after a short delay
  setTimeout(() => {
    document.querySelectorAll('[data-xp]').forEach(bar => {
      bar.style.width = bar.dataset.xp + '%';
    });
  }, 300);

  // === ANIMATED COUNTERS ===
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-val');
    counters.forEach(counter => {
      const text = counter.textContent;
      if (text.includes('+')) return; // skip "10+"
      const target = parseInt(text, 10);
      if (isNaN(target)) return;
      
      let current = 0;
      const increment = Math.max(1, Math.floor(target / 40));
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = current;
      }, 30);
    });
  }

  // Observer for hero section
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const heroSection = document.querySelector('.hero-content');
  if (heroSection) heroObserver.observe(heroSection);

  // === SMOOTH SCROLL NAV ===
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // === HEADER SCROLL EFFECT ===
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
      header.style.borderBottomColor = 'rgba(196, 90, 28, 0.2)';
    } else {
      header.style.borderBottomColor = '';
    }
    
    lastScroll = currentScroll;
  }, { passive: true });

  // === EMBER PARTICLES ===
  const canvas = document.createElement('canvas');
  canvas.id = 'ember-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  let particles = [];
  const PARTICLE_COUNT = 30;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Ember {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = -(Math.random() * 0.6 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.fadeRate = Math.random() * 0.002 + 0.001;
      this.hue = Math.random() * 30 + 15; // orange range
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity -= this.fadeRate;
      this.speedX += (Math.random() - 0.5) * 0.02;

      if (this.opacity <= 0 || this.y < -20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = `hsl(${this.hue}, 90%, 55%)`;
      ctx.shadowColor = `hsl(${this.hue}, 90%, 55%)`;
      ctx.shadowBlur = this.size * 4;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const ember = new Ember();
    ember.y = Math.random() * canvas.height; // spread initially
    particles.push(ember);
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // === SKILL CARD TILT (subtle) ===
  document.querySelectorAll('.skill-card, .quest-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -2;
      const rotateY = (x - centerX) / centerX * 2;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
