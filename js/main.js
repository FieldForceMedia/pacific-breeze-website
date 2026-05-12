// ============================================================
// PACIFIC BREEZE WINDOW CLEANING — Main JS
// Built by Field Force Media
// ============================================================

// ---- Lucide Icons ----
if (typeof lucide !== 'undefined') lucide.createIcons();

// ---- Nav scroll shadow + progress bar + float CTA + back-to-top ----
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav');
  if (nav) nav.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,0.12)' : '0 2px 16px rgba(0,0,0,0.06)';

  // Progress bar
  const progress = document.getElementById('navProgress');
  if (progress) {
    const docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progress.style.width = (docH > 0 ? (window.scrollY / docH) * 100 : 0) + '%';
  }

  // Float CTA
  const floatCta = document.getElementById('floatCta');
  if (floatCta) floatCta.classList.toggle('visible', window.scrollY > 400);

  // Back to top
  const btt = document.getElementById('backToTop');
  if (btt) btt.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });

// Back to top click
const backToTop = document.getElementById('backToTop');
if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---- Mobile Nav Toggle ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// Nav active state
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// ---- Scroll Reveal ----
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ---- Button Ripple ----
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});

// ---- How It Works Sequential Animation ----
(function initProcessSteps() {
  const steps = document.getElementById('processSteps');
  if (!steps) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        steps.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  observer.observe(steps);
})();

// ---- Count-Up Animations ----
(function initCountUp() {
  function countUp(el, target, suffix, isDecimal, duration) {
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      const display = isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString();
      el.textContent = display + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = (isDecimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
    }
    requestAnimationFrame(tick);
  }
  document.querySelectorAll('.impact-num[data-target]').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimal = el.dataset.decimal === 'true';
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(el, target, suffix, decimal, 1600);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    observer.observe(el);
  });
})();

// ---- Impact Items Reveal ----
(function initImpactReveal() {
  const items = document.querySelectorAll('.impact-item');
  if (!items.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.3 });
  items.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(item);
  });
})();

// ---- Google Reviews Carousel ----
const AVATAR_COLORS = ['#1868A7','#0A2E4A','#3A9BD5','#0D4070','#F5780A','#0B3660'];

let _carouselCurrent = 0;
let _carouselTotal = 0;
let _carouselTimer = null;

function getCarouselPos(index, active, total) {
  const diff = ((index - active) % total + total) % total;
  const d = diff > total / 2 ? diff - total : diff;
  if (d === 0) return 'pos-active';
  if (d === -1) return 'pos-prev';
  if (d === 1) return 'pos-next';
  if (d === -2) return 'pos-far-prev';
  if (d === 2) return 'pos-far-next';
  return 'pos-hidden';
}

function carouselGoTo(index) {
  const track = document.getElementById('reviewsTrack');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track || _carouselTotal === 0) return;
  _carouselCurrent = ((index % _carouselTotal) + _carouselTotal) % _carouselTotal;
  Array.from(track.querySelectorAll('.grev-card')).forEach((card, i) => {
    card.className = 'grev-card ' + getCarouselPos(i, _carouselCurrent, _carouselTotal);
  });
  if (dotsContainer) {
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === _carouselCurrent));
  }
}

function carouselStart() {
  clearInterval(_carouselTimer);
  _carouselTimer = setInterval(() => carouselGoTo(_carouselCurrent + 1), 4500);
}

function carouselRestart() {
  clearInterval(_carouselTimer);
  carouselStart();
}

window.moveCarousel = (dir) => { carouselGoTo(_carouselCurrent + dir); carouselRestart(); };

function initCarousel() {
  const track = document.getElementById('reviewsTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.grev-card'));
  _carouselTotal = cards.length;
  _carouselCurrent = 0;
  if (_carouselTotal === 0) return;

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < _carouselTotal; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => { carouselGoTo(i); carouselRestart(); });
      dotsContainer.appendChild(dot);
    }
  }

  if (prevBtn) {
    prevBtn.onclick = null;
    prevBtn.addEventListener('click', () => { carouselGoTo(_carouselCurrent - 1); carouselRestart(); });
  }
  if (nextBtn) {
    nextBtn.onclick = null;
    nextBtn.addEventListener('click', () => { carouselGoTo(_carouselCurrent + 1); carouselRestart(); });
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('pos-prev')) { carouselGoTo(_carouselCurrent - 1); carouselRestart(); }
      else if (card.classList.contains('pos-next')) { carouselGoTo(_carouselCurrent + 1); carouselRestart(); }
    });
  });

  const wrap = track.parentElement;
  wrap.addEventListener('mouseenter', () => clearInterval(_carouselTimer));
  wrap.addEventListener('mouseleave', carouselStart);

  carouselGoTo(0);
  carouselStart();
}

async function loadReviews() {
  const track = document.getElementById('reviewsTrack');
  if (!track) return;
  try {
    const res = await fetch('reviews.json');
    const data = await res.json();
    const scoreEl = document.querySelector('.google-overall-score');
    const countEl = document.querySelector('.google-review-count');
    if (scoreEl) scoreEl.textContent = data.business.overall_rating.toFixed(1);
    if (countEl) countEl.textContent = `Based on ${data.business.review_count} Google Reviews`;
    track.innerHTML = data.reviews.map((r, i) => {
      const bg = r.color || AVATAR_COLORS[i % AVATAR_COLORS.length];
      const initial = r.initials || r.name.charAt(0).toUpperCase();
      return `
        <div class="grev-card">
          <div class="grev-top">
            <div class="grev-author">
              <div class="grev-avatar" style="background:${bg}">${initial}</div>
              <div><div class="grev-name">${r.name}</div><div class="grev-date">${r.date}</div></div>
            </div>
            <div class="grev-google-icon"><span style="color:#4285F4;font-weight:800;font-family:sans-serif;">G</span></div>
          </div>
          <div class="grev-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
          <p class="grev-text">"${r.text}"</p>
        </div>
      `;
    }).join('');
    initCarousel();
  } catch {
    initCarousel();
  }
}

loadReviews();

// ---- FAQ Accordion ----
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ---- Contact Form ----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    btn.textContent = 'Request Sent!';
    btn.disabled = true;
    btn.style.background = '#1868A7';
    setTimeout(() => {
      btn.textContent = 'Request Free Quote';
      btn.disabled = false;
      btn.style.background = '';
      contactForm.reset();
    }, 4000);
  });
}
