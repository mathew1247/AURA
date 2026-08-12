// ----------------------------------------------------
// EMPOWHER Dashboard Interactive Frontend Logic
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

  // --- Retrieve stored user status & profile for future personalization foundation ---
  const userStatus = localStorage.getItem('userStatus');
  const userProfile = JSON.parse(localStorage.getItem('userProfile')) || null;
  console.log('EMPowHER Dashboard loaded for userStatus:', userStatus, 'userProfile:', userProfile);

  // If onboarding is not completed, redirect to onboarding page first
  if (!userStatus || !userProfile) {
    window.location.href = 'onboarding.html';
    return;
  }

  // Update UI with stored profile name if available
  if (userProfile && userProfile.basic && userProfile.basic.name) {
    const userNameElem = document.querySelector('.user-profile-chip .user-name');
    if (userNameElem) {
      userNameElem.textContent = userProfile.basic.name;
    }

    const firstBotMsg = document.querySelector('#chatBody .chat-msg.bot');
    if (firstBotMsg) {
      const firstName = userProfile.basic.name.split(' ')[0];
      firstBotMsg.textContent = `Hello ${firstName}! 👋 I'm your AI Personal Assistant. How can I help empower your personal and professional growth today?`;
    }
  }

  // Profile Menu Click to re-run Onboarding Journey
  const profileMenuBtn = document.getElementById('profileMenuBtn');
  if (profileMenuBtn) {
    profileMenuBtn.title = 'Click to update your onboarding profile';
    profileMenuBtn.style.cursor = 'pointer';
    profileMenuBtn.addEventListener('click', () => {
      if (confirm('Would you like to edit your onboarding profile?')) {
        window.location.href = 'onboarding.html';
      }
    });
  }
  // --- Element References ---
  const topNavItems = document.querySelectorAll('.nav-item');
  const sidebarItems = document.querySelectorAll('.menu-item');
  const dockItems = document.querySelectorAll('.dock-item');

  const searchInput = document.getElementById('searchInput');
  const recCards = document.querySelectorAll('.rec-card');

  const openChatBtn = document.getElementById('openChatBtn');
  const chatDrawer = document.getElementById('chatDrawer');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatBody = document.getElementById('chatBody');
  const promptChips = document.querySelectorAll('.btn-chip');

  const detailModal = document.getElementById('detailModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');

  // --- Card Data Details ---
  const cardData = {
    schemes: {
      badge: '🏛️ Matched Schemes',
      title: 'Matched Government Schemes',
      img: 'assets/sukanya_scheme.png',
      desc: '7 personalized Tamil Nadu government schemes matched for your profile including Pudhumai Penn Scheme (₹1,000/mo), Moovalur Ramamirtham Ammiyar Higher Education Scheme, and UYEGP Self-Employment Subsidies.'
    },
    skillgap: {
      badge: '🎯 AI Skill Analyzer',
      title: 'AI Skill Gap Analyzer',
      img: 'assets/web_dev_course.png',
      desc: 'Smart skill audit analyzing your target career role against top market demands. Recommends instant micro-courses in Python, SQL, Excel, and Data Analytics.'
    },
    job: {
      badge: '💼 Verified Job Matches',
      title: 'Female-Friendly Job Matches',
      img: 'assets/dream_job.png',
      desc: '12 new curated job openings from verified inclusive employers offering flexible remote work, equal pay policies, and mentorship.'
    },
    legal: {
      badge: '⚖️ 24/7 Helpline',
      title: '24/7 Free Legal Rights Helpline',
      img: 'assets/legal_help.png',
      desc: 'Direct confidential legal assistance covering workplace rights, POSH Act regulations, maternity leave benefits, and equal pay advocacy.'
    }
  };

  // --- Top Navigation Tabs Handler ---
  topNavItems.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      topNavItems.forEach(item => item.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // --- Sidebar Items Handler ---
  sidebarItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      sidebarItems.forEach(m => m.classList.remove('active'));
      item.classList.add('active');

      const viewName = item.getAttribute('data-view');
      if (viewName === 'ai-assistant') {
        openChat();
      }
    });
  });

  // --- Floating Dock Items Handler ---
  dockItems.forEach(dock => {
    dock.addEventListener('click', () => {
      dockItems.forEach(d => d.classList.remove('active'));
      dock.classList.add('active');

      const dockType = dock.getAttribute('data-dock');
      if (dockType === 'bot') {
        openChat();
      }
    });
  });

  // --- Quick Action Power Hub Card Handlers ---
  const matchedSchemesModal = document.getElementById('matchedSchemesModal');
  const skillGapModal = document.getElementById('skillGapModal');
  const jobMatchesModal = document.getElementById('jobMatchesModal');
  const legalHelplineModal = document.getElementById('legalHelplineModal');

  // --- Dropdown Sub-Item Event Handlers ---
  const navJobsBtn = document.getElementById('navJobsBtn');
  const navSkillGapBtn = document.getElementById('navSkillGapBtn');
  const navLegalBtn = document.getElementById('navLegalBtn');
  const topOpenChatBtn = document.getElementById('topOpenChatBtn');

  // Card Click Routing Handlers
  const cardGovSchemes = document.getElementById('cardGovSchemes');
  const cardJobs = document.getElementById('cardJobs');
  const cardSkillGaps = document.getElementById('cardSkillGaps');
  const cardCourses = document.getElementById('cardCourses');
  const cardLegalSupport = document.getElementById('cardLegalSupport');
  const cardHealthcare = document.getElementById('cardHealthcare');
  const compactFinancialCard = document.getElementById('compactFinancialCard');
  const compactCertificationsCard = document.getElementById('compactCertificationsCard');
  const seeAllBtn = document.getElementById('seeAllBtn');
  if (seeAllBtn) seeAllBtn.addEventListener('click', (e) => { e.preventDefault(); if (matchedSchemesModal) matchedSchemesModal.classList.add('active'); });

  if (cardGovSchemes) cardGovSchemes.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); if (matchedSchemesModal) matchedSchemesModal.classList.add('active'); });
  if (cardJobs) cardJobs.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); if (jobMatchesModal) jobMatchesModal.classList.add('active'); });

  document.querySelectorAll('.rec-card, [data-card-id="schemes"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const cardId = el.getAttribute('data-card-id');
      if (cardId === 'schemes' || !cardId) {
        if (matchedSchemesModal) matchedSchemesModal.classList.add('active');
      } else if (cardId === 'skillgap') {
        if (skillGapModal) skillGapModal.classList.add('active');
      } else if (cardId === 'job') {
        if (jobMatchesModal) jobMatchesModal.classList.add('active');
      } else if (cardId === 'legal') {
        if (legalHelplineModal) legalHelplineModal.classList.add('active');
      }
    });
  });

  if (compactFinancialCard) compactFinancialCard.addEventListener('click', () => { window.location.href = 'financial_benefits.html'; });
  
  if (cardSkillGaps) cardSkillGaps.addEventListener('click', () => { if (skillGapModal) skillGapModal.classList.add('active'); });
  if (cardCourses) cardCourses.addEventListener('click', () => { alert('📚 Showing 5 AI-Recommended Courses tailored for ' + (userProfile?.goal || 'your goals') + ':\n1. Power BI Complete Bootcamp\n2. Tableau Data Visualization Masterclass\n3. Advanced SQL for Analytics\n4. Python for Data Science\n5. Data Storytelling & Business Insights'); });
  if (cardLegalSupport) cardLegalSupport.addEventListener('click', () => { if (legalHelplineModal) legalHelplineModal.classList.add('active'); });
  if (cardHealthcare) cardHealthcare.addEventListener('click', () => { alert('🏥 Local Healthcare & Welfare Resources (Tamil Nadu):\n1. Makkalai Thedi Maruthuvam Doorstep Healthcare\n2. Dr. Muthulakshmi Reddy Maternal Health Assistance\n3. CMCHIS Health Insurance Coverage'); });
  if (compactCertificationsCard) compactCertificationsCard.addEventListener('click', () => { alert('🏆 Recommended Certifications for ' + (userProfile?.goal || 'your goals') + ':\n1. Google Data Analytics Professional Certificate\n2. Microsoft Certified: Power BI Data Analyst Associate\n3. Tableau Certified Data Analyst'); });

  if (navJobsBtn) navJobsBtn.addEventListener('click', () => { window.location.href = 'jobs.html'; });
  if (navSkillGapBtn) navSkillGapBtn.addEventListener('click', (e) => { e.preventDefault(); if (skillGapModal) skillGapModal.classList.add('active'); });
  if (navLegalBtn) navLegalBtn.addEventListener('click', (e) => { e.preventDefault(); if (legalHelplineModal) legalHelplineModal.classList.add('active'); });
  if (topOpenChatBtn) topOpenChatBtn.addEventListener('click', (e) => { e.preventDefault(); openChat(); });entDefault(); openChat(); });

  // Modal Close Control Helpers
  function setupModalClose(modalElem, closeBtnId, cancelBtnId) {
    if (!modalElem) return;
    const closeBtn = document.getElementById(closeBtnId);
    const cancelBtn = document.getElementById(cancelBtnId);

    if (closeBtn) closeBtn.addEventListener('click', () => modalElem.classList.remove('active'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => modalElem.classList.remove('active'));

    modalElem.addEventListener('click', (e) => {
      if (e.target === modalElem) modalElem.classList.remove('active');
    });
  }

  setupModalClose(detailModal, 'modalCloseBtn', null);
  setupModalClose(matchedSchemesModal, 'matchedSchemesCloseBtn', 'matchedSchemesCancelBtn');
  setupModalClose(skillGapModal, 'skillGapCloseBtn', 'skillGapCancelBtn');
  setupModalClose(jobMatchesModal, 'jobMatchesCloseBtn', 'jobMatchesCancelBtn');
  setupModalClose(legalHelplineModal, 'legalHelplineCloseBtn', 'legalHelplineCancelBtn');

  // --- AI Chat Drawer Handler ---
  function openChat(initialPrompt = '') {
    if (chatDrawer) chatDrawer.classList.add('active');
    if (initialPrompt) {
      handleUserSendMessage(initialPrompt);
    }
  }

  function closeChat() {
    if (chatDrawer) chatDrawer.classList.remove('active');
  }

  if (openChatBtn) openChatBtn.addEventListener('click', () => openChat());
  if (chatCloseBtn) chatCloseBtn.addEventListener('click', closeChat);

  if (promptChips) {
    promptChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        openChat(prompt);
      });
    });
  }

  function appendMessage(sender, text) {
    if (!chatBody) return;
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-msg', sender);
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Dialogue history array to keep conversation context
  let chatMessages = [
    {
      role: "assistant",
      content: `Hello ${(userProfile && userProfile.basic && userProfile.basic.name) ? userProfile.basic.name.split(' ')[0] : 'there'}! 👋 I'm your AI Personal Assistant. How can I help empower your personal and professional growth today?`
    }
  ];

  function handleUserSendMessage(overrideText = null) {
    const text = overrideText || (chatInput ? chatInput.value.trim() : '');
    if (!text) return;

    appendMessage('user', text);
    chatMessages.push({ role: "user", content: text });
    if (!overrideText && chatInput) chatInput.value = '';

    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.style.opacity = '0.7';
    typingIndicator.textContent = "Thinking...";
    chatBody.appendChild(typingIndicator);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Send query to the backend Cerebras endpoint
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: chatMessages })
    })
      .then(response => response.json())
      .then(data => {
        typingIndicator.remove();
        if (data.reply && data.reply.content) {
          chatMessages.push(data.reply);
          appendMessage('bot', data.reply.content);
        } else {
          appendMessage('bot', data.error || "Sorry, I encountered an error. Please try again.");
        }
      })
      .catch(error => {
        typingIndicator.remove();
        console.error("Chat API Error:", error);
        appendMessage('bot', "Could not connect to the assistant server. Make sure the backend is running.");
      });
  }

  chatSendBtn.addEventListener('click', () => handleUserSendMessage());
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleUserSendMessage();
    }
  });

  // --- Live Search Filter ---
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();

    recCards.forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      const subtitle = card.querySelector('.card-subtitle').textContent.toLowerCase();
      if (title.includes(query) || subtitle.includes(query)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });

    sidebarItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.opacity = '1';
      } else if (query !== '') {
        item.style.opacity = '0.3';
      } else {
        item.style.opacity = '1';
      }
    });
  });

  // --- Hero Slider Animation ---
  const firstNameVal = (userProfile && userProfile.basic && userProfile.basic.name) ? userProfile.basic.name.split(' ')[0] : '';
  const greeting = firstNameVal ? `Hi ${firstNameVal}, I'm your` : "Hi, I'm your";

  const heroTitles = [
    { title: `${greeting}<br><span class="highlight-red">AI</span> Personal Assistant`, subtitle: 'I\'m here to guide, inform and empower you at every step of your journey.' },
    { title: 'Discover Top<br><span class="highlight-red">Government</span> Schemes', subtitle: 'Explore financial aid, interest subventions, and welfare initiatives tailored for you.' },
    { title: 'Accelerate Your<br><span class="highlight-red">Career</span> Growth', subtitle: 'Access skill training programs, tech bootcamps, and top tier job opportunities.' }
  ];
  let heroIdx = 0;

  function updateHeroSlide() {
    const heroTitleElem = document.querySelector('.hero-title');
    const heroSubElem = document.querySelector('.hero-subtitle');

    if (heroTitleElem && heroSubElem) {
      heroTitleElem.style.opacity = '0';
      heroSubElem.style.opacity = '0';

      setTimeout(() => {
        heroTitleElem.innerHTML = heroTitles[heroIdx].title;
        heroSubElem.innerHTML = heroTitles[heroIdx].subtitle;
        heroTitleElem.style.opacity = '1';
        heroSubElem.style.opacity = '1';
      }, 200);
    }
  }

  // Set the initial customized slide contents
  updateHeroSlide();

  heroNextBtn.addEventListener('click', () => {
    heroIdx = (heroIdx + 1) % heroTitles.length;
    updateHeroSlide();
  });

  heroPrevBtn.addEventListener('click', () => {
    heroIdx = (heroIdx - 1 + heroTitles.length) % heroTitles.length;
    updateHeroSlide();
  });

  // --- Real-Time Success Stories Carousel Slider ---
  const storiesTrack = document.getElementById('storiesTrack');
  const storyPrevBtn = document.getElementById('storyPrevBtn');
  const storyNextBtn = document.getElementById('storyNextBtn');
  let storyIndex = 0;

  function updateStoriesSlider() {
    if (!storiesTrack) return;
    const cards = storiesTrack.querySelectorAll('.story-card');
    if (cards.length === 0) return;
    const cardWidth = cards[0].offsetWidth + 16;
    const maxShift = cards.length - 3;
    const maxIndex = maxShift > 0 ? maxShift : cards.length - 1;

    if (storyIndex > maxIndex) storyIndex = 0;
    if (storyIndex < 0) storyIndex = maxIndex;

    storiesTrack.style.transform = `translateX(-${storyIndex * cardWidth}px)`;
  }

  if (storyNextBtn && storyPrevBtn) {
    storyNextBtn.addEventListener('click', () => {
      storyIndex++;
      updateStoriesSlider();
    });

    storyPrevBtn.addEventListener('click', () => {
      storyIndex--;
      updateStoriesSlider();
    });

    // Auto-slide every 5 seconds
    setInterval(() => {
      storyIndex++;
      updateStoriesSlider();
    }, 5000);
  }

  // --- Government Schemes Dynamic Fetch & Modal Handler ---
  let tnSchemesData = [];

  // Fetch TN Schemes JSON
  fetch('tamil_nadu_schemes.json')
    .then(res => res.json())
    .then(data => {
      if (data && data.schemes) {
        tnSchemesData = data.schemes;
        console.log('Loaded TN Schemes:', tnSchemesData.length);
      }
    })
    .catch(err => console.error('Error loading tamil_nadu_schemes.json:', err));

  const schemeDetailModal = document.getElementById('schemeDetailModal');
  const schemeModalCloseBtn = document.getElementById('schemeModalCloseBtn');
  const schemeModalCancelBtn = document.getElementById('schemeModalCancelBtn');
  const schemeModalBadge = document.getElementById('schemeModalBadge');
  const schemeModalTitle = document.getElementById('schemeModalTitle');
  const schemeModalSub = document.getElementById('schemeModalSub');
  const schemeModalDesc = document.getElementById('schemeModalDesc');
  const schemeModalBenefits = document.getElementById('schemeModalBenefits');
  const schemeModalEligibility = document.getElementById('schemeModalEligibility');
  const schemeModalDocs = document.getElementById('schemeModalDocs');
  const schemeModalProcess = document.getElementById('schemeModalProcess');
  const schemeOfficialRegisterBtn = document.getElementById('schemeOfficialRegisterBtn');

  function openSchemeModal(scheme) {
    if (!schemeDetailModal) return;

    schemeModalBadge.textContent = scheme.Category || 'Government Scheme';
    schemeModalTitle.textContent = scheme.Name || 'Scheme Details';
    schemeModalSub.textContent = `Govt. of Tamil Nadu • ${scheme['Government Level'] || 'State'} Level`;
    schemeModalDesc.textContent = scheme.Description || '';

    // Render Benefits List
    schemeModalBenefits.innerHTML = '';
    if (scheme.Benefits && Array.isArray(scheme.Benefits)) {
      scheme.Benefits.forEach(b => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${b}</span>`;
        schemeModalBenefits.appendChild(li);
      });
    }

    // Render Eligibility Grid
    schemeModalEligibility.innerHTML = '';
    if (scheme.Eligibility && typeof scheme.Eligibility === 'object') {
      Object.entries(scheme.Eligibility).forEach(([key, val]) => {
        const div = document.createElement('div');
        div.className = 'eligibility-item';
        div.innerHTML = `<span class="eligibility-label">${key}</span><span class="eligibility-val">${val}</span>`;
        schemeModalEligibility.appendChild(div);
      });
    }

    // Render Documents Checklist
    schemeModalDocs.innerHTML = '';
    if (scheme.Documents && Array.isArray(scheme.Documents)) {
      scheme.Documents.forEach(doc => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-file-check"></i> <span>${doc}</span>`;
        schemeModalDocs.appendChild(li);
      });
    }

    // Process & URL
    schemeModalProcess.textContent = scheme['Application Process'] || 'Apply online via the official portal.';
    schemeOfficialRegisterBtn.setAttribute('href', scheme['Official URL'] || '#');

    schemeDetailModal.classList.add('active');
  }

  function closeSchemeModal() {
    if (schemeDetailModal) schemeDetailModal.classList.remove('active');
  }

  if (schemeModalCloseBtn) schemeModalCloseBtn.addEventListener('click', closeSchemeModal);
  if (schemeModalCancelBtn) schemeModalCancelBtn.addEventListener('click', closeSchemeModal);
  if (schemeDetailModal) {
    schemeDetailModal.addEventListener('click', (e) => {
      if (e.target === schemeDetailModal) closeSchemeModal();
    });
  }

  // --- Show Schemes View in Main Dashboard ---
  function showGovernmentSchemesView() {
    const mainContent = document.querySelector('.dashboard-content');
    if (!mainContent) return;

    let schemesSection = document.getElementById('govSchemesSectionView');
    if (!schemesSection) {
      schemesSection = document.createElement('section');
      schemesSection.id = 'govSchemesSectionView';
      schemesSection.className = 'section-container';

      const sectionHeader = `
        <div class="section-header">
          <div class="section-title-box">
            <h2 class="section-title">Government Schemes & Welfare Initiatives</h2>
            <span class="section-subtitle-tag" style="color: var(--text-muted); font-size: 13px;">Financial aid, higher education assurance, and self-employment subsidies in Tamil Nadu</span>
          </div>
        </div>
        <div class="schemes-grid" id="schemesGridTrack"></div>
      `;
      schemesSection.innerHTML = sectionHeader;

      const recSection = document.querySelector('.section-container');
      if (recSection && recSection.parentNode) {
        recSection.parentNode.insertBefore(schemesSection, recSection.nextSibling);
      } else {
        mainContent.appendChild(schemesSection);
      }
    }

    schemesSection.scrollIntoView({ behavior: 'smooth' });

    const gridTrack = document.getElementById('schemesGridTrack');
    if (!gridTrack) return;
    gridTrack.innerHTML = '';

    const listToRender = tnSchemesData.length > 0 ? tnSchemesData : [
      {
        id: 'tn-pudhumai-penn',
        Name: 'Pudhumai Penn Scheme',
        Description: 'Financial assistance scheme providing ₹1,000 monthly aid to female students from TN Govt schools pursuing higher education.',
        Category: 'Education & Women Empowerment',
        'Government Level': 'State',
        Benefits: ['Monthly ₹1,000 direct bank deposit until degree completion.'],
        Eligibility: { Gender: 'Female', 'School Education': 'Govt School (Class 6-12)' },
        Documents: ['Aadhaar Card', 'School Study Certificate', 'Bank Passbook'],
        'Official URL': 'https://penkalvi.tn.gov.in/'
      }
    ];

    listToRender.forEach(scheme => {
      const card = document.createElement('div');
      card.className = 'scheme-card';

      let benefitText = '₹1,000 / month';
      if (scheme.Benefits && scheme.Benefits.length > 0) {
        const firstB = scheme.Benefits[0];
        if (firstB.includes('₹')) {
          const match = firstB.match(/₹[\d,]+/);
          if (match) benefitText = match[0];
        } else if (firstB.toLowerCase().includes('subsidy')) {
          benefitText = 'Financial Subsidy';
        }
      }

      card.innerHTML = `
        <div class="scheme-card-header">
          <div class="scheme-provider-badge">
            <div class="scheme-avatar-icon"><i class="fa-solid fa-building-columns"></i></div>
            <div class="scheme-provider-info">
              <span class="scheme-provider-name">Govt. of Tamil Nadu</span>
              <span class="scheme-posted-time">State Scheme • Active 2026</span>
            </div>
          </div>
          <button class="scheme-save-btn" title="Save Scheme">
            <i class="fa-regular fa-bookmark"></i> Save
          </button>
        </div>

        <div class="scheme-card-body">
          <h3 class="scheme-card-title">${scheme.Name}</h3>
          <p class="scheme-card-short-desc">${scheme.Description}</p>
          <div class="scheme-chips-row">
            <span class="scheme-chip-tag">${scheme.Category || 'Welfare'}</span>
            <span class="scheme-chip-tag">${scheme.Eligibility?.Gender || 'Women'}</span>
            <span class="scheme-chip-tag">Tamil Nadu</span>
          </div>
        </div>

        <div class="scheme-card-footer">
          <div class="scheme-benefit-highlight">
            <span class="benefit-sub">Direct Benefit / Aid</span>
            <span class="benefit-amount">${benefitText}</span>
          </div>
          <button class="btn-view-scheme-details" data-scheme-id="${scheme.id}">
            View Details
          </button>
        </div>
      `;

      const saveBtn = card.querySelector('.scheme-save-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          saveBtn.classList.toggle('saved');
          if (saveBtn.classList.contains('saved')) {
            saveBtn.innerHTML = `<i class="fa-solid fa-bookmark"></i> Saved`;
          } else {
            saveBtn.innerHTML = `<i class="fa-regular fa-bookmark"></i> Save`;
          }
        });
      }

      const viewBtn = card.querySelector('.btn-view-scheme-details');
      if (viewBtn) {
        viewBtn.addEventListener('click', () => {
          openSchemeModal(scheme);
        });
      }

      gridTrack.appendChild(card);
    });
  }

  // --- Attach Triggers to Navigation & Recommendation Cards ---
  sidebarItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const viewName = item.getAttribute('data-view');
      if (viewName === 'gov-schemes') {
        e.preventDefault();
        if (matchedSchemesModal) matchedSchemesModal.classList.add('active');
      }
    });
  });

  topNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const tabName = item.getAttribute('data-tab');
      if (tabName === 'opportunities') {
        e.preventDefault();
        if (matchedSchemesModal) matchedSchemesModal.classList.add('active');
      }
    });
  });

  recCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const cardId = card.getAttribute('data-card-id');
      if (cardId === 'schemes' || !cardId) {
        if (matchedSchemesModal) matchedSchemesModal.classList.add('active');
      } else if (cardId === 'skillgap') {
        if (skillGapModal) skillGapModal.classList.add('active');
      } else if (cardId === 'job') {
        if (jobMatchesModal) jobMatchesModal.classList.add('active');
      } else if (cardId === 'legal') {
        if (legalHelplineModal) legalHelplineModal.classList.add('active');
      }
    });
  });

  promptChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const promptText = chip.getAttribute('data-prompt');
      if (promptText && promptText.includes('schemes')) {
        if (matchedSchemesModal) matchedSchemesModal.classList.add('active');
      } else {
        openChat(promptText);
      }
    });
  });
