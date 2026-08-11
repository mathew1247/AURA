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

  // Dialogue history array to keep conversation context
  let chatMessages = [
    { 
      role: "assistant", 
      content: `Hello ${(userProfile && userProfile.basic && userProfile.basic.name) ? userProfile.basic.name.split(' ')[0] : 'there'}! 👋 I'm your AI Personal Assistant. How can I help empower your personal and professional growth today?` 
    }
  ];

  function handleUserSendMessage(overrideText = null) {
    const text = overrideText || chatInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    chatMessages.push({ role: "user", content: text });
    if (!overrideText) chatInput.value = '';

    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('chat-msg', 'bot');
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

});
