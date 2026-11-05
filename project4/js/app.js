/**
 * ============================================================================
 * UTAH TECH TENNIS CLUB - APPLICATION CONTROLLER & LOGIC
 * ============================================================================

*/
import { officersData, senatorsData } from './leadership-data.js';

const API_BASE_URL = 'http://localhost:8008';

document.addEventListener('DOMContentLoaded', () => {
  initLeadership();
  initFaqAccordion();
  initMobileNav();
  initScrollEffects();
  getMemberCount();
  loadWeather();
  initCommunityReviews();
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
function createOfficerCard(officer) {
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
        <span class="senator-committee">${officer.committee}</span>
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
        <span class="senator-committee">${senator.committee}</span>
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

/* Weather API Fetch */
async function loadWeather() {
  // Example using Open-Meteo (No API key required)
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=37.0965&longitude=-113.5684&current=temperature_2m,weather_code&daily=precipitation_probability_max&temperature_unit=fahrenheit&timezone=America%2FDenver';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const temp = Math.round(data.current.temperature_2m);
    const rainChance = data.daily?.precipitation_probability_max?.[0] ?? 0;
    const display = document.getElementById('weather-display');
    if (display) {
      display.innerText += ` ${temp}°F  |  ${rainChance}% 💧`;
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

/* Personal Groupme API Fetch */
async function getMemberCount() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/member-count`);
    if (!response.ok) return;
    const data = await response.json();
    const statElem = document.getElementsByClassName('stat-number')[1];
    if (statElem && data.count !== undefined) {
      statElem.innerText = data.count;
    }
  } catch (error) {
    console.warn('Could not load member count:', error);
  }
}

function initCommunityReviews() {
  const form = document.getElementById('message-form');
  const textarea = document.getElementById('message-input');
  const memberStatusSelect = document.getElementById('member-status-input');
  const sexSelect = document.getElementById('sex-input');
  const skillLevelSelect = document.getElementById('skill-level-input');
  const dNumberInput = document.getElementById('d-number-input');
  const editIdInput = document.getElementById('edit-message-id');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const formTitleLabel = document.getElementById('form-title-label');
  const formModeBadge = document.getElementById('form-mode-badge');
  const submitBtnText = document.getElementById('submit-btn-text');

  // Cancel edit handler
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', resetFormMode);
  }

  function resetFormMode() {
    if (editIdInput) editIdInput.value = '';
    if (form) form.reset();
    if (formTitleLabel) formTitleLabel.innerText = 'Leave a review or comment';
    if (formModeBadge) formModeBadge.innerText = 'New Review';
    if (submitBtnText) submitBtnText.innerText = 'Submit Feedback';
    if (cancelEditBtn) cancelEditBtn.style.display = 'none';
  }

  // Initial load of messages via GET /messages
  fetchCommunityReviews();

  if (form && textarea) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const content = textarea.value.trim();
      if (!content) return;

      const member_status = memberStatusSelect ? memberStatusSelect.value : undefined;
      const sex = sexSelect ? sexSelect.value : undefined;
      const skill_level = skillLevelSelect ? skillLevelSelect.value : undefined;
      const d_number = dNumberInput ? dNumberInput.value.trim() : undefined;
      const editingId = editIdInput ? editIdInput.value : '';

      const isUpdating = Boolean(editingId);
      const url = isUpdating ? `${API_BASE_URL}/messages/${editingId}` : `${API_BASE_URL}/messages`;
      const method = isUpdating ? 'PUT' : 'POST';

      const submitBtn = document.getElementById('submit-message-btn');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            member_status,
            sex,
            skill_level,
            d_number,
          }),
        });

        if (response.ok) {
          resetFormMode();
          await fetchCommunityReviews();
        } else {
          const errData = await response.json().catch(() => ({}));
          console.error('API Error:', response.status, errData);
          alert(errData.message || 'Operation failed. Please try again.');
        }
      } catch (err) {
        console.error('Error submitting review:', err);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
}

// Fetch all messages via GET /messages and render as interactive comment cards
async function fetchCommunityReviews() {
  const container = document.getElementById('messages-list');
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE_URL}/messages`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const messages = await response.json();

    container.innerHTML = '';

    if (!Array.isArray(messages) || messages.length === 0) {
      container.innerHTML = '<p class="empty-state">No feedback posted yet. Share the first review!</p>';
      return;
    }

    // Render messages in the order given by the server API
    messages.forEach((item, idx) => {
      // Support both object representations and legacy strings
      const content = typeof item === 'object' ? item.content : item;
      const id = typeof item === 'object' ? item.id : idx + 1;
      const dNum = typeof item === 'object' && item.d_number ? item.d_number.trim() : '';
      const memberStatus = typeof item === 'object' ? item.member_status : null;
      const sex = typeof item === 'object' ? item.sex : null;
      const skillLevel = typeof item === 'object' ? item.skill_level : null;

      // When d_number is NOT empty, replace "Anonymous Trailblazer" with d_number
      const displayName = dNum ? dNum : 'Anonymous Trailblazer';

      // Display index as #1, #2, #3... in order of appearance
      const avatarLabel = `#${idx + 1}`;

      const card = document.createElement('div');
      card.className = 'review-item-card';

      // Meta header
      const meta = document.createElement('div');
      meta.className = 'review-card-meta';
      meta.innerHTML = `
        <span class="anon-author-tag">
          <span class="anon-avatar-circle">${avatarLabel}</span>
          ${displayName}
        </span>
        <span>•</span>
        <span>${memberStatus ? memberStatus + ' Member' : 'Club Visitor'}</span>
      `;

      // Body text
      const body = document.createElement('p');
      body.className = 'review-body-text';
      body.textContent = content;

      // Card Action Bar (Pills on the left, Edit & Delete buttons on the right)
      const actionBar = document.createElement('div');
      actionBar.className = 'card-action-bar';

      // Attribute tags: Level & Sex pills on the same line
      const tagsContainer = document.createElement('div');
      tagsContainer.className = 'review-card-tags';

      if (skillLevel) {
        const skillPill = document.createElement('span');
        skillPill.className = 'review-attr-pill';
        skillPill.textContent = `${skillLevel} Level`;
        tagsContainer.appendChild(skillPill);
      }

      if (sex) {
        const sexPill = document.createElement('span');
        sexPill.className = 'review-attr-pill';
        sexPill.textContent = sex;
        tagsContainer.appendChild(sexPill);
      }

      // Edit Button (pre-fills form for Replace / PUT)
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'card-action-btn edit-btn';
      editBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
        Edit
      `;
      editBtn.addEventListener('click', () => {
        // Pre-fill form
        const editIdInput = document.getElementById('edit-message-id');
        const textarea = document.getElementById('message-input');
        const memberStatusSelect = document.getElementById('member-status-input');
        const sexSelect = document.getElementById('sex-input');
        const skillLevelSelect = document.getElementById('skill-level-input');
        const dNumberInput = document.getElementById('d-number-input');
        const formTitleLabel = document.getElementById('form-title-label');
        const formModeBadge = document.getElementById('form-mode-badge');
        const submitBtnText = document.getElementById('submit-btn-text');
        const cancelEditBtn = document.getElementById('cancel-edit-btn');

        if (editIdInput) editIdInput.value = id;
        if (textarea) textarea.value = content;
        if (memberStatusSelect && memberStatus) memberStatusSelect.value = memberStatus;
        if (sexSelect && sex) sexSelect.value = sex;
        if (skillLevelSelect && skillLevel) skillLevelSelect.value = skillLevel;
        if (dNumberInput) dNumberInput.value = dNum;

        if (formTitleLabel) formTitleLabel.innerText = `Edit Feedback #${idx + 1}`;
        if (formModeBadge) formModeBadge.innerText = `Editing Mode`;
        if (submitBtnText) submitBtnText.innerText = `Update Feedback`;
        if (cancelEditBtn) cancelEditBtn.style.display = 'inline-flex';
      });

      // Delete Button (with confirm dialog for DELETE)
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'card-action-btn delete-btn';
      deleteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
        Delete
      `;
      deleteBtn.addEventListener('click', async () => {
        const confirmed = window.confirm(`Are you sure you want to delete review #${idx + 1}?`);
        if (!confirmed) return;

        try {
          const delRes = await fetch(`${API_BASE_URL}/messages/${id}`, {
            method: 'DELETE',
          });

          if (delRes.ok) {
            const editIdInput = document.getElementById('edit-message-id');
            if (editIdInput && editIdInput.value == id) {
              const cancelBtn = document.getElementById('cancel-edit-btn');
              if (cancelBtn) cancelBtn.click();
            }
            await fetchCommunityReviews();
          } else {
            const errData = await delRes.json().catch(() => ({}));
            alert(errData.message || 'Failed to delete record.');
          }
        } catch (err) {
          console.error('Error deleting review:', err);
        }
      });

      // Button group on the right side
      const buttonsGroup = document.createElement('div');
      buttonsGroup.className = 'card-buttons-group';
      buttonsGroup.appendChild(editBtn);
      buttonsGroup.appendChild(deleteBtn);

      actionBar.appendChild(tagsContainer);
      actionBar.appendChild(buttonsGroup);

      card.appendChild(meta);
      card.appendChild(body);
      card.appendChild(actionBar);
      container.appendChild(card);
    });

    // Update count badge
    const badge = document.getElementById('reviews-count-badge');
    if (badge) badge.innerText = `${messages.length} Reviews`;
  } catch (err) {
    console.error('Error loading reviews:', err);
    container.innerHTML = '<p class="empty-state">Unable to load reviews at this time.</p>';
  }
}
