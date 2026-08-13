// ----------------------------------------------------
// EMPOWHER Dedicated Financial Benefits Page Logic
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const userProfile = JSON.parse(localStorage.getItem('userProfile')) || null;

  // Update profile name in header & add profile menu toggle
  const profileMenuBtn = document.getElementById('profileMenuBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const logoutBtn = document.getElementById('logoutBtn');

  if (userProfile && userProfile.basic && userProfile.basic.name) {
    const userNameElem = document.querySelector('.user-profile-chip .user-name');
    if (userNameElem) userNameElem.textContent = userProfile.basic.name;
    const dropdownNameElem = document.getElementById('dropdownUserName');
    if (dropdownNameElem) dropdownNameElem.textContent = userProfile.basic.name;
  }

  if (profileMenuBtn && profileDropdown) {
    profileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target) && !profileMenuBtn.contains(e.target)) {
        profileDropdown.classList.remove('active');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('userStatus');
      localStorage.removeItem('userProfile');
      window.location.href = 'onboarding.html';
    });
  }

  // References
  const finGridTrack = document.getElementById('finGridTrack');
  const finSearchFilterInput = document.getElementById('finSearchFilterInput');
  const finSearchInput = document.getElementById('finSearchInput');
  const finPills = document.querySelectorAll('.fin-pill');

  const modal = document.getElementById('finDetailModal');
  const closeBtn = document.getElementById('finModalCloseBtn');
  const cancelBtn = document.getElementById('finModalCancelBtn');

  const modalType = document.getElementById('modalFinType');
  const modalTitle = document.getElementById('modalFinTitle');
  const modalProvider = document.getElementById('modalFinProvider');
  const modalAmount = document.getElementById('modalFinAmount');
  const modalState = document.getElementById('modalFinState');
  const modalEligibility = document.getElementById('modalFinEligibility');
  const modalDocs = document.getElementById('modalFinDocs');
  const modalApplyBtn = document.getElementById('modalFinApplyBtn');

  let allFinancialData = [];
  let currentCategory = 'all';
  let searchQuery = '';

  // Fetch financial benefits data
  fetch('tn_financial_benefits.json')
    .then(res => res.json())
    .then(data => {
      allFinancialData = data.financial_benefits || [];
      renderFinancialGrid();
    })
    .catch(err => {
      console.error('Error loading tn_financial_benefits.json:', err);
    });

  function renderFinancialGrid() {
    if (!finGridTrack) return;
    finGridTrack.innerHTML = '';

    const matchedData = JSON.parse(localStorage.getItem('matchedData')) || null;
    const matchedBenefits = matchedData ? (matchedData.matchedBenefits || []) : [];

    const filtered = allFinancialData.filter(item => {
      const typeLower = (item.type || '').toLowerCase();
      const nameLower = (item.name || '').toLowerCase();
      const eligStr = (item.eligibility || []).join(' ').toLowerCase();

      let matchCat = false;
      if (currentCategory === 'all') matchCat = true;
      else if (currentCategory === 'both' && (eligStr.includes('both') || eligStr.includes('male & female') || (!eligStr.includes('gender: female') && !eligStr.includes('gender: male')))) matchCat = true;
      else if (currentCategory === 'male' && eligStr.includes('gender: male')) matchCat = true;
      else if (currentCategory === 'female' && (eligStr.includes('gender: female') || eligStr.includes('pregnant women') || eligStr.includes('female student'))) matchCat = true;
      else if (currentCategory === 'stipend' && (typeLower.includes('stipend') || typeLower.includes('education'))) matchCat = true;
      else if (currentCategory === 'income' && (typeLower.includes('income') || typeLower.includes('basic'))) matchCat = true;
      else if (currentCategory === 'maternity' && (typeLower.includes('maternity') || typeLower.includes('health'))) matchCat = true;
      else if (currentCategory === 'business' && (typeLower.includes('capital') || typeLower.includes('subsidy') || typeLower.includes('business'))) matchCat = true;

      const q = searchQuery.toLowerCase();
      const matchSearch = !q || (
        nameLower.includes(q) ||
        typeLower.includes(q) ||
        (item.provider || '').toLowerCase().includes(q) ||
        eligStr.includes(q)
      );

      return matchCat && matchSearch;
    });

    // Sort matched financial benefits to the top
    filtered.sort((a, b) => {
      const aMatched = matchedBenefits.includes(a.id) ? 1 : 0;
      const bMatched = matchedBenefits.includes(b.id) ? 1 : 0;
      return bMatched - aMatched;
    });

    if (filtered.length === 0) {
      finGridTrack.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: #64748B;">
          <i class="fa-solid fa-folder-open" style="font-size: 36px; margin-bottom: 12px; opacity: 0.5;"></i>
          <h3>No Financial Benefits Found</h3>
          <p>Try searching with another keyword or choosing 'All Benefits'.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'fin-card';

      let genderTag = 'Both (Men & Women)';
      const eligStr = (item.eligibility || []).join(' ').toLowerCase();
      if (eligStr.includes('gender: male')) genderTag = 'Male Students';
      else if (eligStr.includes('gender: female') || eligStr.includes('female student') || eligStr.includes('pregnant women')) genderTag = 'Female';

      const isMatched = matchedBenefits.includes(item.id);
      const aiBadgeHtml = isMatched ? `<span class="fin-type-tag" style="background: #FFF1F2; color: #FF1744; border-color: #FECDD3; margin-left: 8px;"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Match</span>` : '';

      card.innerHTML = `
        <div>
          <div class="fin-card-header">
            <div class="fin-icon-box">
              <i class="fa-solid fa-indian-rupee-sign"></i>
            </div>
            <div style="display: flex; gap: 6px;">
              <span class="fin-type-tag">${item.type}</span>
              ${aiBadgeHtml}
            </div>
          </div>

          <h3 class="fin-card-title">${item.name}</h3>
          <div class="fin-card-provider"><i class="fa-solid fa-building-columns"></i> ${item.provider}</div>

          <div style="margin-bottom: 12px;">
            <span style="background: #F1F5F9; border: 1px solid #E2E8F0; color: #475569; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 12px;">👥 ${genderTag}</span>
          </div>

          <div class="fin-amount-badge">
            <i class="fa-solid fa-circle-check"></i> ${item.amount}
          </div>
        </div>

        <div class="fin-card-footer">
          <button class="btn-view-fin">View Details & Apply</button>
        </div>
      `;

      const viewBtn = card.querySelector('.btn-view-fin');
      viewBtn.addEventListener('click', () => openDetailModal(item));

      finGridTrack.appendChild(card);
    });
  }

  function openDetailModal(item) {
    if (!modal) return;

    modalType.textContent = item.type;
    modalTitle.textContent = item.name;
    modalProvider.textContent = item.provider;
    modalAmount.textContent = item.amount;
    modalState.textContent = item.state || 'Tamil Nadu';

    modalEligibility.innerHTML = (item.eligibility || []).map(e => `<li><i class="fa-solid fa-check" style="color: #047857;"></i> ${e}</li>`).join('');
    modalDocs.innerHTML = (item.documents_required || []).map(d => `<li><i class="fa-solid fa-file-check" style="color: #047857;"></i> ${d}</li>`).join('');

    modalApplyBtn.href = item.application_url || '#';

    modal.classList.add('active');
  }

  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.remove('active'));
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  finPills.forEach(pill => {
    pill.addEventListener('click', () => {
      finPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category');
      renderFinancialGrid();
    });
  });

  if (finSearchFilterInput) {
    finSearchFilterInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderFinancialGrid();
    });
  }

  if (finSearchInput) {
    finSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderFinancialGrid();
    });
  }
});
