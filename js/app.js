/**
 * ============================================================================
 * UTAH TECH TENNIS CLUB - APPLICATION CONTROLLER & LOGIC
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initLeadership();
  initFaqAccordion();
  initMobileNav();
  initScrollEffects();
  initStatCounters();
});

/**
 * ============================================================================
 * 1. LEADERSHIP CONTROLLER
 * ============================================================================
 * - Enforces exact fixed order for 4 officers: President -> VP -> Treasurer -> Secretary
 * - Randomizes order of 8 senators on every single page load using Fisher-Yates shuffle
 */
function initLeadership() {
  const officersContainer = document.getElementById('officers-container');
  const senatorsContainer = document.getElementById('senators-container');
  // Render 4 Officers in strict order (President, VP, Treasurer, Secretary)
  if (officersContainer && typeof officersData !== 'undefined') {
    renderOfficers(officersData, officersContainer);
  }

  // Shuffle & Render 8 Senators on every page load
  if (senatorsContainer && typeof senatorsData !== 'undefined') {
    renderShuffledSenators();
  }

  function renderShuffledSenators() {
    const randomizedSenators = shuffleArray([...senatorsData]);
    senatorsContainer.innerHTML = '';

    randomizedSenators.forEach((senator, index) => {
      const card = createSenatorCard(senator, index + 1);
      senatorsContainer.appendChild(card);
    });
  }
}

/**
 * Fisher-Yates Array Shuffle
 * Guarantees a truly uniform random permutation every time.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Creates HTML Element for an Officer Card
 */
function createOfficerCard(officer, positionNumber) {
  const card = document.createElement('div');
  card.className = 'leader-card officer-card';
  card.setAttribute('data-role', officer.role.toLowerCase());

  card.innerHTML = `
    <div class="card-glow-border"></div>
    <div class="card-inner">
      <div class="card-tech-header">
        <span class="tech-badge officer-badge">
          <span class="badge-dot"></span>${officer.role}
        </span>
        <span class="officer-order-tag">#0${positionNumber}</span>
      </div>

      <div class="leader-image-container">
        <img 
          src="${officer.image}" 
          alt="${officer.name} - ${officer.role}"
          class="leader-img"
          loading="lazy"
          onerror="this.src='Tennis_Club_Institutional_Stacked_insta.png'; this.classList.add('fallback-logo');"
        />
        <div class="image-tech-scanline"></div>
      </div>

      <div class="leader-info">
        <h3 class="leader-name">${officer.name}</h3>
        <p class="leader-role-sub">${officer.role}</p>
        <div class="leader-meta">
          <span class="meta-tag"><i class="tech-icon-circle"></i>${officer.major}</span>
          <span class="meta-tag">${officer.year}</span>
        </div>
        <p class="leader-bio">${officer.bio}</p>
        ${officer.email ? `
          <a href="mailto:${officer.email}" class="leader-contact-link">
            <svg class="contact-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            ${officer.email}
          </a>
        ` : ''}
      </div>
    </div>
  `;

  return card;
}

function renderOfficers(officers, container) {
  container.innerHTML = '';
  officers.forEach((officer, idx) => {
    container.appendChild(createOfficerCard(officer, idx + 1));
  });
}

/**
 * Creates HTML Element for a Senator Card
 */
function createSenatorCard(senator, displayOrder) {
  const card = document.createElement('div');
  card.className = 'leader-card senator-card';

  card.innerHTML = `
    <div class="card-glow-border"></div>
    <div class="card-inner">
      <div class="card-tech-header">
        <span class="tech-badge senator-badge">
          <span class="badge-dot red"></span>Senator
        </span>
        <span class="senator-committee">${senator.committee || 'Student Senate'}</span>
      </div>

      <div class="leader-image-container senator-img-wrapper">
        <img 
          src="${senator.image}" 
          alt="${senator.name} - Utah Tech Tennis Senator"
          class="leader-img"
          loading="lazy"
          onerror="this.src='Tennis_Club_Institutional_Stacked_insta.png'; this.classList.add('fallback-logo');"
        />
        <div class="image-tech-scanline"></div>
      </div>

      <div class="leader-info">
        <h4 class="leader-name senator-name">${senator.name}</h4>
        <div class="leader-meta senator-meta">
          <span class="meta-tag">${senator.major}</span>
          <span class="meta-tag">${senator.year}</span>
        </div>
        <p class="leader-bio senator-bio">${senator.bio}</p>
      </div>
    </div>
  `;

  return card;
}

/**
 * ============================================================================
 * 2. FAQ INTERACTIVE ACCORDION
 * ============================================================================
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other FAQ items for a clean accordion experience
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        const answer = item.querySelector('.faq-answer');
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      }
    });
  });
}

/**
 * ============================================================================
 * 3. MOBILE NAVIGATION DRAWER & SMOOTH SCROLL
 * ============================================================================
 */
function initMobileNav() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('is-open');
      navMenu.classList.toggle('is-active');
    });

    // Close menu when clicking on any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('is-open');
        navMenu.classList.remove('is-active');
      });
    });
  }
}

/**
 * ============================================================================
 * 4. STICKY NAV GLOW & ACTIVE LINK SPYING
 * ============================================================================
 */
function initScrollEffects() {
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
