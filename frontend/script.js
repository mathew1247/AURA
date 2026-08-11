// ----------------------------------------------------
// EMPOWHER Dashboard Interactive Frontend Logic
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

  // --- Retrieve stored user status for future personalization ---
  const userStatus = localStorage.getItem('userStatus');
  console.log('EMPowHER Dashboard loaded for userStatus:', userStatus);

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

  const heroPrevBtn = document.getElementById('heroPrevBtn');
  const heroNextBtn = document.getElementById('heroNextBtn');

  // --- Card Data Details ---
  const cardData = {
    sukanya: {
      badge: 'Government Scheme',
      title: 'Sukanya Samriddhi Yojana',
      img: 'assets/sukanya_scheme.png',
      desc: 'A small deposit scheme for the girl child launched as a part of the "Beti Bachao Beti Padhao" campaign. Currently offering a high interest rate of 8.2% per annum with complete tax benefits under Section 80C.'
    },
    webdev: {
      badge: 'Online Course',
      title: 'Full-Stack Web Development Course',
      img: 'assets/web_dev_course.png',
      desc: 'Master HTML, CSS, JavaScript, React, and Node.js with live mentorship, real-world hands-on projects, portfolio building, and guaranteed career placement assistance.'
    },
    job: {
      badge: 'Latest Job Openings',
      title: 'Find Your Dream Job',
      img: 'assets/dream_job.png',
      desc: 'Explore curated high-paying job opportunities from top tech companies and organizations supporting diversity, equity, and flexible remote work setups.'
    },
    legal: {
      badge: 'Get Expert Support',
      title: 'Free Legal Aid & Guidance',
      img: 'assets/legal_help.png',
      desc: 'Connect with certified female legal counsel and rights advocates for confidential advice on workplace laws, property rights, business contracts, and personal safety.'
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

  // --- Card Click Handler for Detail Modal ---
  recCards.forEach(card => {
    card.addEventListener('click', () => {
      const cardId = card.getAttribute('data-card-id');
      const data = cardData[cardId];
      if (data) {
        modalImg.src = data.img;
        modalBadge.textContent = data.badge;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        detailModal.classList.add('active');
      }
    });
  });

  modalCloseBtn.addEventListener('click', () => {
    detailModal.classList.remove('active');
  });

  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) {
      detailModal.classList.remove('active');
    }
  });

  // --- AI Chat Drawer Handler ---
  function openChat(initialPrompt = '') {
    chatDrawer.classList.add('active');
    if (initialPrompt) {
      handleUserSendMessage(initialPrompt);
    }
  }

  function closeChat() {
    chatDrawer.classList.remove('active');
  }

  openChatBtn.addEventListener('click', () => openChat());
  chatCloseBtn.addEventListener('click', closeChat);

  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      openChat(prompt);
    });
  });

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-msg', sender);
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function getAiResponse(userText) {
    const textLower = userText.toLowerCase();
    if (textLower.includes('scheme') || textLower.includes('eligible')) {
      return "Based on your profile, you are eligible for the Sukanya Samriddhi Yojana, Mudra Loan for female entrepreneurs, and Stand-Up India funding programs!";
    } else if (textLower.includes('career') || textLower.includes('guidance')) {
      return "I can help you build a personalized career transition plan! We offer skill gap analysis, resume reviews, and targeted web development or leadership courses.";
    } else if (textLower.includes('job') || textLower.includes('opportunity')) {
      return "Currently there are 140+ active remote and hybrid job openings matching your skillset in Web Development, Management, and Design!";
    } else {
      return "I'm here to support your journey! You can ask me about government financial schemes, job openings, mentorship, or legal assistance.";
    }
  }

  function handleUserSendMessage(overrideText = null) {
    const text = overrideText || chatInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    if (!overrideText) chatInput.value = '';

    // Show typing indicator / simulated AI response
    setTimeout(() => {
      const aiReply = getAiResponse(text);
      appendMessage('bot', aiReply);
    }, 600);
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
  const heroTitles = [
    { title: 'Hi, I\'m your<br><span class="highlight-red">AI</span> Personal Assistant', subtitle: 'I\'m here to guide, inform and empower you at every step of your journey.' },
    { title: 'Discover Top<br><span class="highlight-red">Government</span> Schemes', subtitle: 'Explore financial aid, interest subventions, and welfare initiatives tailored for you.' },
    { title: 'Accelerate Your<br><span class="highlight-red">Career</span> Growth', subtitle: 'Access skill training programs, tech bootcamps, and top tier job opportunities.' }
  ];
  let heroIdx = 0;

  function updateHeroSlide() {
    const heroTitleElem = document.querySelector('.hero-title');
    const heroSubElem = document.querySelector('.hero-subtitle');
    
    heroTitleElem.style.opacity = '0';
    heroSubElem.style.opacity = '0';
    
    setTimeout(() => {
      heroTitleElem.innerHTML = heroTitles[heroIdx].title;
      heroSubElem.innerHTML = heroTitles[heroIdx].subtitle;
      heroTitleElem.style.opacity = '1';
      heroSubElem.style.opacity = '1';
    }, 200);
  }

  heroNextBtn.addEventListener('click', () => {
    heroIdx = (heroIdx + 1) % heroTitles.length;
    updateHeroSlide();
  });

  heroPrevBtn.addEventListener('click', () => {
    heroIdx = (heroIdx - 1 + heroTitles.length) % heroTitles.length;
    updateHeroSlide();
  });

});
