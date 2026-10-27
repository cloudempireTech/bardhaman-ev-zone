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
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
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
});
