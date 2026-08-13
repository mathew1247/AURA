// ----------------------------------------------------
// EMPOWHER Dedicated Government Schemes Page Logic
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const userProfile = JSON.parse(localStorage.getItem('userProfile')) || null;

  // Update profile name in header if available
  if (userProfile && userProfile.basic && userProfile.basic.name) {
    const userNameElem = document.querySelector('.user-profile-chip .user-name');
    if (userNameElem) {
      userNameElem.textContent = userProfile.basic.name;
    }
  }

  // References
  const schemesGridTrack = document.getElementById('schemesGridTrack');
  const schemeSearchInput = document.getElementById('schemeSearchInput');
  const globalSearchInput = document.getElementById('globalSearchInput');
  const categoryPills = document.querySelectorAll('.cat-pill');

  const modal = document.getElementById('schemePageDetailModal');
  const closeBtn = document.getElementById('schemePageModalCloseBtn');
  const cancelBtn = document.getElementById('modalSchemeCancelBtn');

  const modalBadge = document.getElementById('modalSchemeBadge');
  const modalTitle = document.getElementById('modalSchemeTitle');
  const modalSub = document.getElementById('modalSchemeSub');
  const modalDesc = document.getElementById('modalSchemeDesc');
  const modalBenefits = document.getElementById('modalSchemeBenefits');
  const modalEligibility = document.getElementById('modalSchemeEligibility');
  const modalDocs = document.getElementById('modalSchemeDocs');
  const modalProcess = document.getElementById('modalSchemeProcess');
  const modalOfficialBtn = document.getElementById('modalSchemeOfficialBtn');

  let allSchemesData = [];
  let currentCategory = 'all';
  let searchQuery = '';

  // Fetch schemes data
  fetch('tamil_nadu_schemes.json')
    .then(res => res.json())
    .then(data => {
      allSchemesData = data.schemes || [];
      renderSchemesGrid();
    })
    .catch(err => {
      console.error('Error loading tamil_nadu_schemes.json:', err);
    });

  function renderSchemesGrid() {
    if (!schemesGridTrack) return;
    schemesGridTrack.innerHTML = '';

    const matchedData = JSON.parse(localStorage.getItem('matchedData')) || null;
    const matchedSchemes = matchedData ? (matchedData.matchedSchemes || []) : [];

    const filtered = allSchemesData.filter(scheme => {
      const catLower = (scheme.Category || '').toLowerCase();
      const genderVal = ((scheme.Eligibility && scheme.Eligibility.Gender) || '').toLowerCase();

      let matchCat = false;
      if (currentCategory === 'all') matchCat = true;
      else if (currentCategory === 'both' && (genderVal.includes('both') || genderVal.includes('male & female') || genderVal.includes('boys & girls'))) matchCat = true;
      else if (currentCategory === 'male' && (genderVal.includes('male') || genderVal.includes('boys'))) matchCat = true;
      else if (currentCategory === 'female' && (genderVal.includes('female') || genderVal.includes('women') || genderVal.includes('girls'))) matchCat = true;
      else if (currentCategory === 'education' && (catLower.includes('education') || catLower.includes('scholarship'))) matchCat = true;
      else if (currentCategory === 'financial' && (catLower.includes('financial') || catLower.includes('welfare') || catLower.includes('income'))) matchCat = true;
      else if (currentCategory === 'skill' && (catLower.includes('skill') || catLower.includes('career'))) matchCat = true;
      else if (currentCategory === 'maternity' && (catLower.includes('maternity') || catLower.includes('health') || catLower.includes('mother'))) matchCat = true;
      else if (currentCategory === 'entrepreneurship' && (catLower.includes('entrepreneur') || catLower.includes('business') || catLower.includes('self-employment'))) matchCat = true;

      // Search query match
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || (
        (scheme.Name || '').toLowerCase().includes(q) ||
        (scheme.Description || '').toLowerCase().includes(q) ||
        (scheme.Category || '').toLowerCase().includes(q) ||
        genderVal.includes(q)
      );

      return matchCat && matchSearch;
    });

    // Sort matched schemes to the top
    filtered.sort((a, b) => {
      const aMatched = matchedSchemes.includes(a.id) ? 1 : 0;
      const bMatched = matchedSchemes.includes(b.id) ? 1 : 0;
      return bMatched - aMatched;
    });

    if (filtered.length === 0) {
      schemesGridTrack.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: #64748B;">
          <i class="fa-solid fa-folder-open" style="font-size: 36px; margin-bottom: 12px; opacity: 0.5;"></i>
          <h3>No Government Schemes Found</h3>
          <p>Try searching with a different keyword or selecting 'All Schemes'.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(scheme => {
      const card = document.createElement('div');
      card.className = 'scheme-page-card';

      // Benefit summary label
      let benefitLabel = 'Direct Aid / Benefit';
      if (scheme.Benefits && scheme.Benefits.length > 0) {
        benefitLabel = scheme.Benefits[0];
      }

      const genderTag = (scheme.Eligibility && scheme.Eligibility.Gender) ? scheme.Eligibility.Gender : 'Both (Men & Women)';
      const isMatched = matchedSchemes.includes(scheme.id);
      const aiBadgeHtml = isMatched ? `<span class="scheme-tag" style="background: #FFF1F2; color: #FF1744; border-color: #FECDD3;"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Recommended</span>` : '';

      card.innerHTML = `
        <div>
          <div class="scheme-card-header">
            <div class="scheme-icon-box">
              <i class="fa-solid fa-building-columns"></i>
            </div>
            <span class="scheme-govt-tag">${scheme['Government Level'] || 'State'} Scheme • TN</span>
          </div>

          <h3 class="scheme-card-title">${scheme.Name}</h3>
          <p class="scheme-card-desc">${scheme.Description}</p>

          <div class="scheme-badge-tags">
            ${aiBadgeHtml}
            <span class="scheme-tag" style="background: #EEF2FF; color: #4F46E5; border-color: #C7D2FE;">👥 ${genderTag}</span>
            <span class="scheme-tag">${scheme.Category}</span>
          </div>
        </div>

        <div class="scheme-card-footer">
          <div class="scheme-benefit-amount" style="font-size: 13px; max-width: 170px; font-weight: 700;">
            <i class="fa-solid fa-circle-check" style="color: #00B894;"></i> ${benefitLabel.slice(0, 35)}...
          </div>
          <button class="btn-view-scheme">View Details</button>
        </div>
      `;

      const viewBtn = card.querySelector('.btn-view-scheme');
      viewBtn.addEventListener('click', () => openDetailModal(scheme));

      schemesGridTrack.appendChild(card);
    });
  }

  function openDetailModal(scheme) {
    if (!modal) return;

    modalBadge.textContent = `${scheme['Government Level'] || 'State'} Scheme • Active 2026`;
    modalTitle.textContent = scheme.Name;
    modalSub.textContent = `Govt. of ${scheme.States ? scheme.States.join(', ') : 'Tamil Nadu'}`;
    modalDesc.textContent = scheme.Description;

    // Benefits
    modalBenefits.innerHTML = (scheme.Benefits || []).map(b => `<li><i class="fa-solid fa-check"></i> ${b}</li>`).join('');

    // Eligibility
    if (scheme.Eligibility) {
      modalEligibility.innerHTML = Object.entries(scheme.Eligibility).map(([k, v]) => `
        <div class="eligibility-item">
          <div class="eligibility-label">${k}</div>
          <div class="eligibility-value">${v}</div>
        </div>
      `).join('');
    } else {
      modalEligibility.innerHTML = '<p style="font-size: 13px; color: #64748B;">Open to all residents of Tamil Nadu meeting state criteria.</p>';
    }

    // Docs
    modalDocs.innerHTML = (scheme.Documents || []).map(d => `<li><i class="fa-solid fa-file-check"></i> ${d}</li>`).join('');

    // Process
    modalProcess.textContent = scheme['Application Process'] || 'Apply online via official portal or visit local District Social Welfare Office.';

    // URL
    modalOfficialBtn.href = scheme['Official URL'] || '#';

    modal.classList.add('active');
  }

  // Modal Close Events
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.remove('active'));
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // Category Filter Pills
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category');
      renderSchemesGrid();
    });
  });

  // Search Input Handlers
  if (schemeSearchInput) {
    schemeSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderSchemesGrid();
    });
  }

  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderSchemesGrid();
    });
  }
});
