// ----------------------------------------------------
// EMPOWHER Dedicated Jobs & Careers Page Logic
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const userProfile = JSON.parse(localStorage.getItem('userProfile')) || null;

  if (userProfile && userProfile.basic && userProfile.basic.name) {
    const userNameElem = document.querySelector('.user-profile-chip .user-name');
    if (userNameElem) userNameElem.textContent = userProfile.basic.name;
  }

  // References
  const jobsGridTrack = document.getElementById('jobsGridTrack');
  const jobSearchFilterInput = document.getElementById('jobSearchFilterInput');
  const jobSearchInput = document.getElementById('jobSearchInput');
  const jobsPills = document.querySelectorAll('.jobs-pill');

  const modal = document.getElementById('jobDetailModal');
  const closeBtn = document.getElementById('jobModalCloseBtn');
  const cancelBtn = document.getElementById('jobModalCancelBtn');

  const modalMode = document.getElementById('modalJobMode');
  const modalTitle = document.getElementById('modalJobTitle');
  const modalCompany = document.getElementById('modalJobCompany');
  const modalSalary = document.getElementById('modalJobSalary');
  const modalType = document.getElementById('modalJobType');
  const modalSkills = document.getElementById('modalJobSkills');
  const modalExp = document.getElementById('modalJobExp');
  const modalApplyBtn = document.getElementById('modalJobApplyBtn');

  let allJobsData = [];
  let currentCategory = 'all';
  let searchQuery = '';

  // Fetch jobs data
  fetch('jobs.json')
    .then(res => res.json())
    .then(data => {
      allJobsData = data.jobs || [];
      renderJobsGrid();
    })
    .catch(err => {
      console.error('Error loading jobs.json:', err);
    });

  function renderJobsGrid() {
    if (!jobsGridTrack) return;
    jobsGridTrack.innerHTML = '';

    const filtered = allJobsData.filter(item => {
      const catLower = (item.category || '').toLowerCase();
      const modeLower = (item.work_mode || '').toLowerCase();
      const titleLower = (item.title || '').toLowerCase();
      const genderLower = (item.gender_eligibility || '').toLowerCase();

      let matchCat = false;
      if (currentCategory === 'all' || currentCategory === 'both') matchCat = true;
      else if (currentCategory === 'web' && (catLower.includes('web') || titleLower.includes('web') || titleLower.includes('developer'))) matchCat = true;
      else if (currentCategory === 'data' && (catLower.includes('data') || titleLower.includes('data') || titleLower.includes('analyst'))) matchCat = true;
      else if (currentCategory === 'remote' && modeLower.includes('remote')) matchCat = true;
      else if (currentCategory === 'hr' && (catLower.includes('hr') || catLower.includes('human') || titleLower.includes('recruiter'))) matchCat = true;

      const q = searchQuery.toLowerCase();
      const matchSearch = !q || (
        titleLower.includes(q) ||
        (item.company || '').toLowerCase().includes(q) ||
        (item.location || '').toLowerCase().includes(q) ||
        genderLower.includes(q) ||
        (item.required_skills || []).some(s => s.toLowerCase().includes(q))
      );

      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      jobsGridTrack.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: #64748B;">
          <i class="fa-solid fa-folder-open" style="font-size: 36px; margin-bottom: 12px; opacity: 0.5;"></i>
          <h3>No Jobs Found</h3>
          <p>Try searching with another keyword or selecting 'All Jobs'.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'job-card';

      const skillsHtml = (item.required_skills || []).slice(0, 4).map(s => `<span class="job-skill-chip">${s}</span>`).join('');
      const genderTag = item.gender_eligibility || 'Both (Male & Female)';

      card.innerHTML = `
        <div>
          <div class="job-card-header">
            <div class="job-icon-box">
              <i class="fa-solid fa-briefcase"></i>
            </div>
            <span class="job-mode-tag">${item.work_mode || 'Full-time'}</span>
          </div>

          <h3 class="job-card-title">${item.title}</h3>
          <div class="job-company"><i class="fa-solid fa-building"></i> ${item.company} • ${item.location}</div>

          <div style="margin-bottom: 10px;">
            <span style="background: #EEF2FF; border: 1px solid #C7D2FE; color: #4F46E5; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 12px;">👥 ${genderTag}</span>
          </div>

          <div class="job-salary-badge">
            <i class="fa-solid fa-money-bill-wave"></i> ${item.salary_range}
          </div>

          <div class="job-skills-list">
            ${skillsHtml}
          </div>
        </div>

        <div class="job-card-footer">
          <button class="btn-apply-job">View Job & Apply</button>
        </div>
      `;

      const viewBtn = card.querySelector('.btn-apply-job');
      viewBtn.addEventListener('click', () => openDetailModal(item));

      jobsGridTrack.appendChild(card);
    });
  }

  function openDetailModal(item) {
    if (!modal) return;

    modalMode.textContent = item.work_mode || 'Full-Time';
    modalTitle.textContent = item.title;
    modalCompany.textContent = `${item.company} • ${item.location}`;
    modalSalary.textContent = item.salary_range;
    modalType.textContent = item.employment_type || 'Full-time';

    modalSkills.innerHTML = (item.required_skills || []).map(s => `<span class="job-skill-chip" style="font-size: 12px; padding: 6px 12px; background: #EEF2FF; color: #4F46E5; border-color: #C7D2FE;">✓ ${s}</span>`).join('');
    modalExp.textContent = `${item.experience_required} • Posted on ${item.posted_date || 'August 2026'}`;

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

  jobsPills.forEach(pill => {
    pill.addEventListener('click', () => {
      jobsPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category');
      renderJobsGrid();
    });
  });

  if (jobSearchFilterInput) {
    jobSearchFilterInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderJobsGrid();
    });
  }

  if (jobSearchInput) {
    jobSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderJobsGrid();
    });
  }
});
