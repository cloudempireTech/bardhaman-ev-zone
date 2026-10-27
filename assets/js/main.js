/**
 * BARDHAMAN EV ZONE - Official JavaScript
 * Interactions, Filter Rail, Mobile Drawer & WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen ? `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      ` : `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      `;
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. TheDivine Sticky Floating Tab Filter Rail (Mandate 7 & 111)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterCards = document.querySelectorAll('.portfolio-card[data-category]');

  if (filterBtns.length > 0 && filterCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Smooth scroll tab into center of horizontal rail
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        const filter = btn.getAttribute('data-filter');

        filterCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category.includes(filter)) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // 3. Staggered Intersection Observer Reveal Animations
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 80px 0px' });

    reveals.forEach(el => {
      observer.observe(el);
      // Immediately activate if already in/near viewport on load
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        el.classList.add('active');
      }
    });
  } else {
    reveals.forEach(el => el.classList.add('active'));
  }

  // 4. Accessible Video Pause/Play Toggle
  const heroVideo = document.querySelector('.hero-video-bg');
  const videoToggleBtn = document.querySelector('.btn-video-toggle');
  if (heroVideo && videoToggleBtn) {
    videoToggleBtn.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play();
        videoToggleBtn.setAttribute('aria-label', 'Pause video');
        videoToggleBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        `;
      } else {
        heroVideo.pause();
        videoToggleBtn.setAttribute('aria-label', 'Play video');
        videoToggleBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        `;
      }
    });
  }

  // 5. WhatsApp Form Direct Handoff
  const inquiryForms = document.querySelectorAll('.inquiry-form');
  inquiryForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value.trim() || 'Visitor';
      const phone = form.querySelector('[name="phone"]')?.value.trim() || '';
      const model = form.querySelector('[name="model"]')?.value || 'General EV Inquiry';
      const requirement = form.querySelector('[name="requirement"]')?.value || 'Test Ride / Quotation';
      const notes = form.querySelector('[name="message"]')?.value.trim() || '';

      const text = `Namaste Bardhaman EV Zone team!\n\nI am *${name}* (${phone}).\nI am interested in *${model}* for *${requirement}*.\n${notes ? `Note: ${notes}\n\n` : ''}Please share the technical specifications and arrange a test ride at your City Hotel More showroom.`;

      const target = `https://wa.me/918250347130?text=${encodeURIComponent(text)}`;
      window.open(target, '_blank', 'noopener,noreferrer');
    });
  });

  // 6. Dynamic Keyword Rotator in Hero
  const rotatorEl = document.getElementById('heroRotator');
  if (rotatorEl) {
    let words = [];
    try {
      words = JSON.parse(rotatorEl.getAttribute('data-words')) || [];
    } catch (e) {
      words = ['Bardhaman', 'Daily Commuters', 'Zero Emissions', 'Next-Gen Riders', 'Smart Fleets'];
    }
    if (words.length > 1) {
      let currentIndex = 0;
      setInterval(() => {
        rotatorEl.classList.add('fade-out');
        setTimeout(() => {
          currentIndex = (currentIndex + 1) % words.length;
          rotatorEl.textContent = words[currentIndex];
          rotatorEl.classList.remove('fade-out');
          rotatorEl.classList.add('fade-in');
          setTimeout(() => {
            rotatorEl.classList.remove('fade-in');
          }, 350);
        }, 350);
      }, 2800);
    }
  }

  // 7. Animated Telemetry Count-Up Statistics
  const counters = document.querySelectorAll('.stat-counter');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target') || 0);
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const decimals = parseInt(el.getAttribute('data-decimals') || 0, 10);
          const duration = 1600; // ms
          const startTime = performance.now();

          const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = target * easeOut;

            el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
            }
          };

          requestAnimationFrame(updateCount);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // 8. Interactive EV Cost vs. Petrol Savings Calculator
  const commuteRange = document.getElementById('commuteRange');
  if (commuteRange) {
    const commuteVal = document.getElementById('commuteVal');
    const petrolCostEl = document.getElementById('petrolCost');
    const evCostEl = document.getElementById('evCost');
    const monthlySavingsEl = document.getElementById('monthlySavings');
    const annualSavingsEl = document.getElementById('annualSavings');

    const updateCalculator = () => {
      const dailyKm = parseInt(commuteRange.value, 10);
      commuteVal.textContent = `${dailyKm} km / day`;

      const monthlyKm = dailyKm * 30;
      // Petrol benchmark: ~35-40 km/l at Rs 106/l -> ~Rs 3.20/km in city traffic
      const petrolPerKm = 3.20;
      const evPerKm = 0.15; // Bardhaman EV Zone certified efficiency

      const monthlyPetrol = Math.round(monthlyKm * petrolPerKm);
      const monthlyEv = Math.round(monthlyKm * evPerKm);
      const monthlySavings = monthlyPetrol - monthlyEv;
      const annualSavings = monthlySavings * 12;

      petrolCostEl.textContent = `₹${monthlyPetrol.toLocaleString('en-IN')}`;
      evCostEl.textContent = `₹${monthlyEv.toLocaleString('en-IN')}`;
      monthlySavingsEl.textContent = `₹${monthlySavings.toLocaleString('en-IN')}`;
      annualSavingsEl.textContent = `₹${annualSavings.toLocaleString('en-IN')}`;
    };

    commuteRange.addEventListener('input', updateCalculator);
    updateCalculator(); // Initialize on load
  }

  // 9. Live Showroom Status Bar (IST Time)
  const statusTextEl = document.getElementById('liveStatusText');
  if (statusTextEl) {
    const now = new Date();
    // Indian Standard Time UTC+5:30
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffset);
    const hour = istDate.getHours();
    const isMobile = window.innerWidth <= 640;

    if (hour >= 9 && hour < 20) {
      statusTextEl.textContent = isMobile 
        ? 'Open Now • Test Rides' 
        : 'Showroom Open Now • City Hotel More, G.T. Road • Instant Test Rides Available';
    } else {
      statusTextEl.textContent = isMobile
        ? 'Open Today (9:30 AM–8:30 PM)'
        : 'Showroom Open Today (9:30 AM – 8:30 PM) • Instant WhatsApp Booking Active';
    }
  }
});
