/**
 * Hadi Afzal — Professional Developer Portfolio
 * Interactive Functionality, Ultra-Smooth Magnetic Cursor & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================
   * 1. ULTRA-SMOOTH GLOBAL CUSTOM MAGNETIC CURSOR (Pure Black #000000)
   * Framerate-Independent Physics + Zero-Layout-Thrashing Magnetic Pull
   * ========================================================= */
  const initCustomCursor = () => {
    // Detect touch / mobile devices strictly (zero overhead on mobile)
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
                    ('ontouchstart' in window) ||
                    navigator.maxTouchPoints > 0 ||
                    window.innerWidth < 768;

    const dotEl = document.getElementById('cursorDot');
    const ringEl = document.getElementById('cursorRing');

    if (isTouch || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('no-custom-cursor');
      if (dotEl) dotEl.style.display = 'none';
      if (ringEl) ringEl.style.display = 'none';
      return; // Skip attaching mousemove listeners, RAF loops, and tracking physics
    }

    document.documentElement.classList.add('has-custom-cursor');

    let dot = dotEl;
    let ring = ringEl;

    if (!dot) {
      dot = document.createElement('div');
      dot.className = 'custom-cursor-dot';
      dot.id = 'cursorDot';
      dot.setAttribute('aria-hidden', 'true');
      document.body.appendChild(dot);
    }
    if (!ring) {
      ring = document.createElement('div');
      ring.className = 'custom-cursor-ring';
      ring.id = 'cursorRing';
      ring.setAttribute('aria-hidden', 'true');
      document.body.appendChild(ring);
    }

    // Coordinates and high-precision physics
    let mouseX = -100;
    let mouseY = -100;
    let dotX = -100;
    let dotY = -100;
    let ringX = -100;
    let ringY = -100;
    let targetRingX = -100;
    let targetRingY = -100;

    let isVisible = false;
    let isHovered = false;
    let isClicking = false;

    let currentRingScale = 1;
    let currentDotScale = 1;
    let targetRingScale = 1;
    let targetDotScale = 1;

    // Active magnetic item tracking
    let activeMagnetic = null;
    let settlingMagnetics = [];

    // Track mouse position with passive listener
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        dotX = mouseX;
        dotY = mouseY;
        ringX = mouseX;
        ringY = mouseY;
        targetRingX = mouseX;
        targetRingY = mouseY;
      }

      if (!activeMagnetic) {
        targetRingX = mouseX;
        targetRingY = mouseY;
      } else {
        // Smooth magnetic attraction toward the center of the hovered element
        const offsetX = mouseX - activeMagnetic.centerX;
        const offsetY = mouseY - activeMagnetic.centerY;
        targetRingX = activeMagnetic.centerX + offsetX * 0.35;
        targetRingY = activeMagnetic.centerY + offsetY * 0.35;

        // Update target pull for the element itself
        activeMagnetic.targetX = offsetX * 0.24;
        activeMagnetic.targetY = offsetY * 0.24;
      }
    }, { passive: true });

    // Handle mouse leaving and entering viewport
    document.addEventListener('mouseleave', () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });

    // Tactile micro-compression effect on click
    window.addEventListener('mousedown', () => {
      isClicking = true;
      ring.classList.add('is-clicking');
    });

    window.addEventListener('mouseup', () => {
      isClicking = false;
      ring.classList.remove('is-clicking');
    });

    // Interactive elements for scale expansion
    const interactiveSelector = [
      'a',
      'button',
      'input',
      'textarea',
      'select',
      '[role="button"]',
      '.filter-btn',
      '.service-cta',
      '.service-card',
      '.project',
      '.socials a',
      '.cert-btn',
      '.cert-nav-btn',
      '.cert-modal-btn',
      '.cert-modal-close',
      '.topbar-nav a',
      '.arrow-link',
      '.cert-document',
      '.focus-item'
    ].join(', ');

    // Magnetic pull targets (interactive buttons, chips, links)
    const magneticSelector = [
      'a.btn',
      'button.btn',
      '.filter-btn',
      '.service-cta',
      '.socials a',
      '.cert-btn',
      '.cert-nav-btn',
      '.cert-modal-btn',
      '.cert-modal-close',
      '.whatsapp-submit-btn',
      '.arrow',
      '.badge'
    ].join(', ');

    const attachInteractivity = () => {
      const interactives = document.querySelectorAll(interactiveSelector);
      interactives.forEach((el) => {
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = 'true';

        el.addEventListener('mouseenter', () => {
          isHovered = true;
          ring.classList.add('is-hovered');
          dot.classList.add('is-hovered');
        });

        el.addEventListener('mouseleave', () => {
          if (!activeMagnetic) {
            isHovered = false;
            ring.classList.remove('is-hovered');
            dot.classList.remove('is-hovered');
            targetRingX = mouseX;
            targetRingY = mouseY;
          }
        });
      });

      const magnetics = document.querySelectorAll(magneticSelector);
      magnetics.forEach((el) => {
        if (el.dataset.magneticBound) return;
        el.dataset.magneticBound = 'true';

        el.addEventListener('mouseenter', () => {
          // Cache untransformed element geometry once on enter (zero layout thrashing)
          const rect = el.getBoundingClientRect();
          activeMagnetic = {
            el,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0
          };
          isHovered = true;
          ring.classList.add('is-hovered');
          dot.classList.add('is-hovered');
        });

        el.addEventListener('mouseleave', () => {
          if (activeMagnetic && activeMagnetic.el === el) {
            // Queue for smooth spring-back release in RAF loop
            activeMagnetic.targetX = 0;
            activeMagnetic.targetY = 0;
            settlingMagnetics.push(activeMagnetic);
            activeMagnetic = null;
          }
          isHovered = false;
          ring.classList.remove('is-hovered');
          dot.classList.remove('is-hovered');
          targetRingX = mouseX;
          targetRingY = mouseY;
        });
      });
    };

    attachInteractivity();

    // Re-attach if DOM elements change dynamically
    const observer = new MutationObserver(() => {
      attachInteractivity();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Framerate-independent continuous physics loop
    let lastTime = performance.now();

    const render = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      // Exponential smoothing factors (framerate-independent)
      // High-speed instantaneous dot tracking
      const dotFactor = 1 - Math.exp(-42 * dt);
      dotX += (mouseX - dotX) * dotFactor;
      dotY += (mouseY - dotY) * dotFactor;

      // Silky, buttery outer ring damping
      const ringFactor = 1 - Math.exp(-12 * dt);
      ringX += (targetRingX - ringX) * ringFactor;
      ringY += (targetRingY - ringY) * ringFactor;

      // Scale damping (1.5 on hover, 0.85 on click)
      if (isClicking) {
        targetRingScale = 0.85;
        targetDotScale = 0.85;
      } else if (isHovered) {
        targetRingScale = 1.5;
        targetDotScale = 0.6;
      } else {
        targetRingScale = 1.0;
        targetDotScale = 1.0;
      }

      const scaleFactor = 1 - Math.exp(-16 * dt);
      currentRingScale += (targetRingScale - currentRingScale) * scaleFactor;
      currentDotScale += (targetDotScale - currentDotScale) * scaleFactor;

      // Animate active magnetic element smoothly
      if (activeMagnetic) {
        const magFactor = 1 - Math.exp(-14 * dt);
        activeMagnetic.x += (activeMagnetic.targetX - activeMagnetic.x) * magFactor;
        activeMagnetic.y += (activeMagnetic.targetY - activeMagnetic.y) * magFactor;
        activeMagnetic.el.style.transform = `translate3d(${activeMagnetic.x.toFixed(2)}px, ${activeMagnetic.y.toFixed(2)}px, 0)`;
      }

      // Settle any released magnetic elements back to neutral (0,0)
      if (settlingMagnetics.length > 0) {
        const magFactor = 1 - Math.exp(-16 * dt);
        for (let i = settlingMagnetics.length - 1; i >= 0; i--) {
          const item = settlingMagnetics[i];
          item.x += (0 - item.x) * magFactor;
          item.y += (0 - item.y) * magFactor;
          if (Math.abs(item.x) < 0.1 && Math.abs(item.y) < 0.1) {
            item.el.style.transform = '';
            settlingMagnetics.splice(i, 1);
          } else {
            item.el.style.transform = `translate3d(${item.x.toFixed(2)}px, ${item.y.toFixed(2)}px, 0)`;
          }
        }
      }

      // GPU-accelerated translate3d transforms
      dot.style.transform = `translate3d(${dotX.toFixed(2)}px, ${dotY.toFixed(2)}px, 0) translate(-50%, -50%) scale(${currentDotScale.toFixed(3)})`;
      ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%) scale(${currentRingScale.toFixed(3)})`;

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  };

  initCustomCursor();

  /* =========================================================
   * 2. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   * ========================================================= */
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('in'));
  }

  /* =========================================================
   * 3. MOUSE TRACKING GLOW EFFECT (Card Spotlight - Zero Layout Thrashing)
   * ========================================================= */
  const isMobileDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
                         ('ontouchstart' in window) ||
                         navigator.maxTouchPoints > 0 ||
                         window.innerWidth < 768;

  if (!isMobileDevice) {
    const cards = document.querySelectorAll('.card, .focus-item');
    cards.forEach(card => {
      let cachedRect = null;

      card.addEventListener('mouseenter', () => {
        cachedRect = card.getBoundingClientRect();
      }, { passive: true });

      card.addEventListener('mousemove', (e) => {
        if (!cachedRect) cachedRect = card.getBoundingClientRect();
        const x = e.clientX - cachedRect.left;
        const y = e.clientY - cachedRect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        cachedRect = null;
      }, { passive: true });
    });

    window.addEventListener('resize', () => {
      // Invalidate on resize
      cards.forEach(card => {
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
      });
    }, { passive: true });
  }

  /* =========================================================
   * 4. PROJECT CATEGORY FILTERING
   * ========================================================= */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project');
  const emptyState = document.getElementById('projectEmpty');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      let visibleCount = 0;
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    });
  });

  // Initialize count badges
  const countAll = document.getElementById('countAll');
  const countWeb = document.getElementById('countWeb');
  const countJs = document.getElementById('countJs');

  if (countAll) countAll.textContent = String(projectCards.length).padStart(2, '0');
  if (countWeb) {
    const webCount = document.querySelectorAll('.project[data-cat="web"]').length;
    countWeb.textContent = String(webCount).padStart(2, '0');
  }
  if (countJs) {
    const jsCount = document.querySelectorAll('.project[data-cat="javascript"]').length;
    countJs.textContent = String(jsCount).padStart(2, '0');
  }

  /* =========================================================
   * 4.5. DIRECT MESSAGE WHATSAPP INQUIRY FORM & CTA SCROLL
   * ========================================================= */
  const directMsgForm = document.getElementById('directMessageForm');
  const startProjectBtn = document.getElementById('startProjectBtn');
  const heroCtaBtn = document.querySelector('.hero-cta-btn');

  function focusFormNameField() {
    const nameInput = document.getElementById('whatsappSenderName');
    if (nameInput) {
      nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        nameInput.focus();
      }, 400);
    }
  }

  if (startProjectBtn) {
    startProjectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      focusFormNameField();
    });
  }

  if (heroCtaBtn) {
    heroCtaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (directMsgForm) {
    directMsgForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('whatsappSenderName');
      const emailInput = document.getElementById('whatsappSenderEmail');
      const serviceSelect = document.getElementById('whatsappService');
      const detailsInput = document.getElementById('whatsappProjectDetails');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const service = serviceSelect ? serviceSelect.value.trim() : 'Frontend Web Development (HTML/CSS/JS)';
      const details = detailsInput ? detailsInput.value.trim() : '';

      // Validate required fields
      if (!name) {
        if (nameInput) {
          nameInput.focus();
          nameInput.reportValidity();
        }
        return;
      }
      if (!email) {
        if (emailInput) {
          emailInput.focus();
          emailInput.reportValidity();
        }
        return;
      }
      if (!details) {
        if (detailsInput) {
          detailsInput.focus();
          detailsInput.reportValidity();
        }
        return;
      }

      // Construct clean, well-formatted plain-text WhatsApp message
      const message = `*New Project Inquiry from Portfolio*\n\n*Name:* ${name}\n*Email:* ${email}\n*Service Required:* ${service}\n*Project Details:* ${details}`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/923155706146?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
});

/* =========================================================
 * 5. CERTIFICATES SHOWCASE & MODAL
 * ========================================================= */
const certificates = [
  {
    num: "CERTIFICATE 01",
    title: "Certificate in Information Technology (CIT)",
    badge: "1st Position",
    meta: [
      { label: "Issued for", val: "Information Technology (CIT)" },
      { label: "Achievement", val: "Awarded 1st Position" },
      { label: "Location", val: "Karachi, Pakistan" },
      { label: "Category", val: "Information Technology" }
    ],
    desc: "Awarded 1st position in Certificate in Information Technology (CIT), demonstrating exceptional academic excellence, technical proficiency, and mastery of computer fundamentals and software applications.",
    img: "assets/cert-cit.png"
  },
  {
    num: "CERTIFICATE 02",
    title: "Governor Initiative for AI & Computing (GIAIC)",
    badge: "Specialized Training",
    meta: [
      { label: "Issued by", val: "Governor House, Karachi" },
      { label: "Program", val: "GIAIC Initiative" },
      { label: "Focus", val: "Artificial Intelligence & Computing" },
      { label: "Category", val: "Agentic AI & Modern Tech" }
    ],
    desc: "Completed specialized training classes at Governor House, Karachi, under the Governor Initiative for Artificial Intelligence and Computing, focusing on modern computing, emerging technologies, and AI foundations.",
    img: "assets/cert-giaic.png"
  },
  {
    num: "CERTIFICATE 03",
    title: "HTML, CSS & JavaScript Web Development",
    badge: "Technical Training",
    meta: [
      { label: "Curriculum", val: "Front-End Web Development" },
      { label: "Skills", val: "HTML5, CSS3, JavaScript" },
      { label: "Focus", val: "Responsive UI & Web Projects" },
      { label: "Category", val: "Web Development" }
    ],
    desc: "Hands-on technical training covering responsive web design, semantic HTML5, modern CSS3 styling, JavaScript programming, DOM manipulation, and real-world project development.",
    img: "assets/cert-webdev.png"
  }
];

let currentCertIndex = 0;
let currentZoom = 1;

function updateCertDisplay() {
  const cert = certificates[currentCertIndex];
  if (!cert) return;

  const docImg = document.querySelector('.cert-document img');
  const numEl = document.querySelector('.cert-info-num');
  const titleEl = document.querySelector('.cert-info-title');
  const metaEl = document.querySelector('.cert-meta');
  const descEl = document.querySelector('.cert-description');
  const currentEl = document.getElementById('certCurrent');
  const totalEl = document.getElementById('certTotal');
  const progressFill = document.getElementById('certProgressFill');

  if (docImg) {
    docImg.src = cert.img;
    docImg.alt = cert.title;
  }
  if (numEl) numEl.textContent = cert.num;
  if (titleEl) titleEl.textContent = cert.title;
  if (descEl) descEl.textContent = cert.desc;

  if (metaEl) {
    metaEl.innerHTML = cert.meta.map(item => `
      <div class="cert-meta-item">
        <span class="cert-meta-label">${item.label}</span>
        <span class="cert-meta-val">${item.val}</span>
      </div>
    `).join('');
  }

  if (currentEl) currentEl.textContent = String(currentCertIndex + 1).padStart(2, '0');
  if (totalEl) totalEl.textContent = String(certificates.length).padStart(2, '0');
  if (progressFill) {
    const pct = ((currentCertIndex + 1) / certificates.length) * 100;
    progressFill.style.width = `${pct}%`;
  }
}

window.certNav = function (direction) {
  currentCertIndex = (currentCertIndex + direction + certificates.length) % certificates.length;
  updateCertDisplay();
};

window.openCertModal = function (idx) {
  if (typeof idx === 'number') {
    currentCertIndex = idx;
    updateCertDisplay();
  }
  const modal = document.getElementById('certModal');
  const modalImg = document.getElementById('certModalImg');
  if (modal && modalImg) {
    modalImg.src = certificates[currentCertIndex].img;
    modalImg.alt = certificates[currentCertIndex].title;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    resetZoomCert();
  }
};

window.closeCertModal = function () {
  const modal = document.getElementById('certModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.zoomCert = function (delta) {
  currentZoom = Math.min(Math.max(0.5, currentZoom + delta), 2.5);
  const modalImg = document.getElementById('certModalImg');
  if (modalImg) {
    modalImg.style.transform = `scale(${currentZoom})`;
  }
};

window.resetZoomCert = function () {
  currentZoom = 1;
  const modalImg = document.getElementById('certModalImg');
  if (modalImg) {
    modalImg.style.transform = 'scale(1)';
  }
};

window.downloadCert = function () {
  const cert = certificates[currentCertIndex];
  if (!cert) return;
  const a = document.createElement('a');
  a.href = cert.img;
  a.download = `${cert.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Close modal on Escape key or outside click
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCertModal();
});

const certModal = document.getElementById('certModal');
if (certModal) {
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) closeCertModal();
  });
}

// =========================================================
// FLOATING PILL TOPBAR SCROLL, STICKY FIXED & MOBILE MENU
// =========================================================
(function initFloatingPillTopbar() {
  const topbar = document.getElementById('topbarHeader');
  if (!topbar) return;

  const toggleBtn = document.getElementById('mobileNavToggle');
  const dropdown = document.getElementById('mobileMenuDropdown');

  let ticking = false;

  function updateNavbarScroll() {
    const currentScrollY = Math.max(0, window.scrollY);

    // 1. Scrolled backdrop styling enhancement
    if (currentScrollY > 20) {
      topbar.classList.add('scrolled');
    } else {
      topbar.classList.remove('scrolled');
    }

    // 2. Permanently sticky fixed: never hide navbar on scroll
    topbar.classList.remove('nav-hidden');

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbarScroll);
      ticking = true;
    }
  }, { passive: true });

  updateNavbarScroll();

  // Mobile Menu Toggle Controller
  if (toggleBtn && dropdown) {
    function toggleMenu(forceState) {
      const isOpen = forceState !== undefined ? forceState : !dropdown.classList.contains('is-open');
      dropdown.classList.toggle('is-open', isOpen);
      toggleBtn.classList.toggle('is-active', isOpen);
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
      dropdown.setAttribute('aria-hidden', String(!isOpen));

      // When opening mobile menu, ensure navbar is visible
      if (isOpen) {
        topbar.classList.remove('nav-hidden');
      }
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking any nav link in mobile menu
    const mobileLinks = dropdown.querySelectorAll('a[href^="#"]');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (dropdown.classList.contains('is-open') && !dropdown.contains(e.target) && !toggleBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });
  }

  // Active Nav Link Tracking (syncs desktop and mobile links)
  const allNavLinks = document.querySelectorAll('.topbar-nav a[href^="#"], .mobile-nav-links a[href^="#"]');
  const sectionMap = [];
  const uniqueSectionIds = new Set();

  allNavLinks.forEach(link => {
    const targetId = link.getAttribute('href').substring(1);
    // Keep navbar revealed when user clicks any navigation link
    link.addEventListener('click', () => {
      topbar.classList.remove('nav-hidden');
      lastScrollY = window.scrollY;
    });

    if (!uniqueSectionIds.has(targetId)) {
      uniqueSectionIds.add(targetId);
      const section = document.getElementById(targetId);
      if (section) {
        sectionMap.push({ id: targetId, section });
      }
    }
  });

  if (sectionMap.length > 0) {
    let sectionPositions = [];

    function cacheSectionPositions() {
      sectionPositions = sectionMap.map(item => {
        const top = item.section.offsetTop;
        const height = item.section.offsetHeight;
        return {
          id: item.id,
          top: top,
          bottom: top + height
        };
      });
    }

    cacheSectionPositions();
    window.addEventListener('resize', cacheSectionPositions, { passive: true });
    window.addEventListener('load', cacheSectionPositions, { passive: true });

    let activeNavTicking = false;

    function updateActiveNav() {
      const scrollPos = window.scrollY + 130;
      let activeId = null;

      for (let i = 0; i < sectionPositions.length; i++) {
        const item = sectionPositions[i];
        if (scrollPos >= item.top && scrollPos < item.bottom) {
          activeId = item.id;
          break;
        }
      }

      allNavLinks.forEach(link => {
        const targetId = link.getAttribute('href').substring(1);
        if (targetId === activeId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      activeNavTicking = false;
    }

    window.addEventListener('scroll', () => {
      if (!activeNavTicking) {
        window.requestAnimationFrame(updateActiveNav);
        activeNavTicking = true;
      }
    }, { passive: true });

    updateActiveNav();
  }
})();

// =========================================================
// STATS METRICS COUNTER ANIMATION (INTERSECTION OBSERVER)
// =========================================================
(function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-counter');
  if (!statElements.length) return;

  let hasAnimated = false;

  function runCounters() {
    if (hasAnimated) return;
    hasAnimated = true;

    statElements.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target')) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1600; // 1.6 seconds
      let startTime = null;

      function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Smooth easeOutCubic curve
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        el.textContent = currentVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      }

      requestAnimationFrame(step);
    });
  }

  const section = document.getElementById('stats-marquee') || document.querySelector('.stats-marquee-section');
  if (section && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounters();
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(section);
  } else {
    runCounters();
  }
})();