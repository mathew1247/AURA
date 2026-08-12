// ----------------------------------------------------
// EMPOWHER Interactive Onboarding Journey Logic Engine
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

  // ================= STATE MODEL =================
  let currentStep = 0;
  const maxSteps = 14;

  const profile = {
    user_id: 'USER_' + Math.floor(1000 + Math.random() * 9000),
    status: 'student',
    basic: {
      name: 'Ananya',
      age: 21,
      gender: 'Female',
      state: 'Tamil Nadu',
      district: 'Chennai'
    },
    education: {
      level: 'Undergraduate',
      degree: 'B.Sc',
      specialization: 'Computer Science',
      current_year: '3rd Year',
      graduation_year: '2025'
    },
    employment: {
      role: '',
      experience: '',
      industry: '',
      next_goal: ''
    },
    unemployed: {
      previous_status: '',
      looking_for: []
    },
    entrepreneur: {
      stage: '',
      support_needed: []
    },
    career: {
      target_roles: ['Data Analyst'],
      goals: ['Find a Job']
    },
    skills: [
      { name: 'Python', status: 'known' },
      { name: 'SQL', status: 'known' },
      { name: 'Excel', status: 'learning' }
    ],
    financial: {
      income_range: '₹1–3 Lakh'
    },
    preferences: {
      work_location: ['Remote', 'Same State'],
      work_mode: ['Hybrid'],
      learning_mode: ['Interactive'],
      learning_time: '30–60 min/day',
      learning_budget: 'Free only'
    },
    support_interests: ['Government Schemes', 'Jobs', 'Certifications']
  };

  // Skill Tree Categories & Data
  const skillCategories = [
    {
      name: '💻 Technology',
      skills: ['Python', 'Java', 'JavaScript', 'HTML/CSS', 'React', 'Node.js', 'Flask']
    },
    {
      name: '📊 Data',
      skills: ['SQL', 'Excel', 'Power BI', 'Tableau', 'Statistics', 'Pandas']
    },
    {
      name: '🎨 Design',
      skills: ['UI/UX Design', 'Figma', 'Photoshop', 'Illustrator', 'Canva']
    },
    {
      name: '📈 Business',
      skills: ['Management', 'Strategy', 'Project Management', 'Agile']
    },
    {
      name: '📣 Communication',
      skills: ['Public Speaking', 'Content Writing', 'English Communication', 'Negotiation']
    },
    {
      name: '💰 Finance',
      skills: ['Accounting', 'Tally', 'Taxation', 'Budgeting']
    },
    {
      name: '🤖 AI & Machine Learning',
      skills: ['Prompt Engineering', 'Machine Learning', 'Deep Learning']
    },
    {
      name: '📱 Marketing',
      skills: ['Digital Marketing', 'SEO', 'Social Media', 'Ads']
    }
  ];

  // ================= DOM ELEMENT REFERENCES =================
  const progressText = document.getElementById('progressText');
  const progressBarFill = document.getElementById('progressBarFill');

  const characterSpeechBubble = document.getElementById('characterSpeechBubble');
  const guideCharacterImg = document.getElementById('guideCharacterImg');
  const orbitSkillsContainer = document.getElementById('orbitSkillsContainer');
  const envFooterText = document.getElementById('envFooterText');

  const btnBack = document.getElementById('btnBack');
  const btnContinue = document.getElementById('btnContinue');
  const btnContinueText = document.getElementById('btnContinueText');
  const btnContinueIcon = document.getElementById('btnContinueIcon');

  // Input References
  const nameInput = document.getElementById('nameInput');
  const ageDisplay = document.getElementById('ageDisplay');
  const ageSlider = document.getElementById('ageSlider');
  const ageMinusBtn = document.getElementById('ageMinusBtn');
  const agePlusBtn = document.getElementById('agePlusBtn');

  const btnAutoLoc = document.getElementById('btnAutoLoc');
  const btnManualLoc = document.getElementById('btnManualLoc');
  const stateSelect = document.getElementById('stateSelect');
  const cityInput = document.getElementById('cityInput');
  const locDisplayBadge = document.getElementById('locDisplayBadge');

  const statusGrid = document.getElementById('statusGrid');
  const dynamicStatusFormContent = document.getElementById('dynamicStatusFormContent');

  const skillTreeContainer = document.getElementById('skillTreeContainer');
  const questGrid = document.getElementById('questGrid');
  const targetRoleGrid = document.getElementById('targetRoleGrid');
  const workLocGrid = document.getElementById('workLocGrid');
  const incomeGrid = document.getElementById('incomeGrid');
  const learningFormatGrid = document.getElementById('learningFormatGrid');
  const supportGrid = document.getElementById('supportGrid');

  const summaryAvatar = document.getElementById('summaryAvatar');
  const summaryName = document.getElementById('summaryName');
  const summarySub = document.getElementById('summarySub');

  // ================= DYNAMIC STEP SEQUENCE SYSTEM =================
  let currentStepIndex = 0;

  function getStepSequence(status) {
    if (status === 'student') {
      return [0, 1, 2, 3, 4, 5, 6, 8, 13, 14];
    } else if (status === 'employed') {
      return [0, 1, 2, 3, 4, 5, 6, 8, 9, 13, 14];
    } else if (status === 'unemployed') {
      return [0, 1, 2, 3, 4, 5, 6, 8, 9, 13, 14];
    }
    return [0, 1, 2, 3, 4, 5, 6, 8, 13, 14];
  }

  // ================= INIT ENGINE =================
  initSkillTree();
  updateStepView();
  renderOrbitSkills();

  // ================= STEP NAVIGATION HANDLERS =================
  btnContinue.addEventListener('click', () => {
    try {
      saveCurrentStepData();
    } catch (err) {
      console.warn("Save step data warning:", err);
    }

    const sequence = getStepSequence(profile.status);
    const activeStepNumber = sequence[currentStepIndex];

    if (activeStepNumber === 14) {
      // Finalize and save to localStorage
      localStorage.setItem('userStatus', profile.status);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      window.location.href = 'index.html';
      return;
    }

    if (currentStepIndex < sequence.length - 1) {
      currentStepIndex++;
      updateStepView();

      // Trigger Happy React Animation on Character
      if (guideCharacterImg) {
        guideCharacterImg.classList.add('react-happy');
        setTimeout(() => guideCharacterImg.classList.remove('react-happy'), 600);
      }
    }
  });

  btnBack.addEventListener('click', () => {
    if (currentStepIndex > 0) {
      currentStepIndex--;
      updateStepView();
    }
  });

  // ================= UPDATE STEP VIEW =================
  function updateStepView() {
    const sequence = getStepSequence(profile.status);
    const activeStepNumber = sequence[currentStepIndex];
    currentStep = activeStepNumber;

    const totalUserSteps = sequence.length - 2;
    const displayStepNum = Math.min(currentStepIndex, totalUserSteps);

    const percent = Math.round((currentStepIndex / (sequence.length - 1)) * 100);
    if (progressText) progressText.textContent = `STEP ${displayStepNum} OF ${totalUserSteps}`;
    if (progressBarFill) progressBarFill.style.width = `${percent}%`;

    // Render dynamic status form if entering Step 5
    if (activeStepNumber === 5) {
      renderStatusSpecificForm();
    }

    // Toggle active step panel
    document.querySelectorAll('.step-container').forEach((el) => {
      const idNum = parseInt(el.id.replace('step', ''), 10);
      if (idNum === activeStepNumber) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Update back button disabled state
    if (btnBack) btnBack.disabled = (currentStepIndex === 0 || activeStepNumber === 13 || activeStepNumber === 14);

    // Update Continue button text
    if (btnContinueText && btnContinueIcon) {
      if (activeStepNumber === 0) {
        btnContinueText.textContent = "Start My Journey →";
        btnContinueIcon.className = "fa-solid fa-arrow-right";
      } else if (activeStepNumber === 14) {
        btnContinueText.textContent = "Explore My Journey →";
        btnContinueIcon.className = "fa-solid fa-rocket";
      } else {
        btnContinueText.textContent = "Continue →";
        btnContinueIcon.className = "fa-solid fa-arrow-right";
      }
    }

    // Dynamic Dialogue & Environmental Text
    updateCharacterDialogue();

    // Trigger AI Step Processing logic if on Step 13
    if (activeStepNumber === 13) {
      runAISimulation();
    }

    // Trigger Celebration logic if on Step 14
    if (activeStepNumber === 14) {
      renderSummaryCard();
      launchConfetti();
    }
  }

  // ================= DYNAMIC CHARACTER DIALOGUE =================
  function updateCharacterDialogue() {
    const name = profile.basic.name || "friend";

    const dialogues = [
      /* Step 0 */ "Hi! I'm your Empowher Guide. Let's build your personalized future journey together! ✨",
      /* Step 1 */ "Where are you right now? Choose your status (Student, Employed, Unemployed).",
      /* Step 2 */ `Nice! What should we call you?`,
      /* Step 3 */ `${profile.basic.age} is a fantastic age! We'll match relevant growth programs.`,
      /* Step 4 */ `📍 ${profile.basic.state} has great local programs!`,
      /* Step 5 */ `Customizing details for your ${profile.status} path!`,
      /* Step 6 */ `Build your skill tree! Select skills you know (✓) or are learning (◐).`,
      /* Step 7 */ `Awesome quest choice: ${profile.career.goals[0] || 'Find a Job'}!`,
      /* Step 8 */ `${profile.career.target_roles[0] || 'Target Role'} is a high-demand career path!`,
      /* Step 9 */ `Flexibility preferences set! Matching job locations.`,
      /* Step 10 */ `Thank you! We'll match financial subsidies and government assistance.`,
      /* Step 11 */ `Interactive study fits quick daily learning routines!`,
      /* Step 12 */ `Great selection! Customizing your ecosystem support options.`,
      /* Step 13 */ `Hold tight! AI engine is crunching your profile parameters...`,
      /* Step 14 */ `Woohoo, ${name}! Your custom Empowher journey is fully prepared!`
    ];

    if (characterSpeechBubble) {
      characterSpeechBubble.textContent = dialogues[currentStep] || dialogues[0];
    }
    if (envFooterText) {
      const sequence = getStepSequence(profile.status);
      const totalUserSteps = sequence.length - 2;
      const displayStepNum = Math.min(currentStepIndex, totalUserSteps);
      envFooterText.textContent = `Step ${displayStepNum} of ${totalUserSteps} • ${percentComplete()}% Unlocked`;
    }
  }

  function percentComplete() {
    const sequence = getStepSequence(profile.status);
    return Math.round((currentStepIndex / (sequence.length - 1)) * 100);
  }

  // ================= STEP 1: STATUS SELECTION =================
  if (statusGrid) {
    setupChoiceGrid(statusGrid, false);
  }

  // ================= RENDER DYNAMIC STATUS-SPECIFIC FORM (STEP 5) =================
  function renderStatusSpecificForm() {
    if (!dynamicStatusFormContent) return;

    if (profile.status === 'student') {
      dynamicStatusFormContent.innerHTML = `
        <span class="step-badge"><i class="fa-solid fa-graduation-cap"></i> Student Journey</span>
        <h1 class="step-title">Tell us about your studies</h1>
        <p class="step-subtitle">Help us understand your education level and specialization.</p>

        <div style="display: flex; flex-direction: column; gap: 18px; margin-top: 12px;">
          <div class="form-row-2">
            <div>
              <label style="font-size: 13px; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 6px;">Education Level</label>
              <select id="studentEduLevel" class="select-custom">
                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="Diploma">Diploma</option>
                <option value="Undergraduate" selected>Undergraduate (B.Tech, B.Sc, B.A, B.Com, BCA)</option>
                <option value="Postgraduate">Postgraduate (M.Tech, M.Sc, MBA)</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style="font-size: 13px; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 6px;">Degree / Course</label>
              <select id="studentDegree" class="select-custom">
                <option value="B.Sc" selected>B.Sc</option>
                <option value="B.Tech">B.Tech</option>
                <option value="B.A">B.A</option>
                <option value="B.Com">B.Com</option>
                <option value="BCA">BCA</option>
                <option value="M.Tech">M.Tech</option>
                <option value="M.Sc">M.Sc</option>
                <option value="MBA">MBA</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div class="form-row-2">
            <div>
              <label style="font-size: 13px; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 6px;">Specialization</label>
              <input type="text" id="studentSpec" class="select-custom" value="${profile.education.specialization || 'Computer Science'}" placeholder="e.g. Computer Science">
            </div>
            <div>
              <label style="font-size: 13px; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 6px;">Current Year</label>
              <select id="studentYear" class="select-custom">
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year" selected>3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Final Year">Final Year</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label style="font-size: 14px; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 10px;">What are you looking for right now?</label>
            <div class="cards-grid cols-3" id="studentLookingForGrid">
              <div class="choice-card selected" data-val="Internship">
                <div class="choice-title">Internship</div>
                <i class="fa-solid fa-circle-check choice-check"></i>
              </div>
              <div class="choice-card selected" data-val="Job after graduation">
                <div class="choice-title">Job after Graduation</div>
                <i class="fa-solid fa-circle-check choice-check"></i>
              </div>
              <div class="choice-card" data-val="Skill Courses">
                <div class="choice-title">Skill Courses</div>
                <i class="fa-solid fa-circle-check choice-check"></i>
              </div>
              <div class="choice-card" data-val="Scholarships">
                <div class="choice-title">Scholarships</div>
                <i class="fa-solid fa-circle-check choice-check"></i>
              </div>
              <div class="choice-card" data-val="Higher studies">
                <div class="choice-title">Higher Studies</div>
                <i class="fa-solid fa-circle-check choice-check"></i>
              </div>
            </div>
          </div>
        </div>
      `;

      setupChoiceGrid(document.getElementById('studentLookingForGrid'), true);
    } 
    else if (profile.status === 'employed') {
      dynamicStatusFormContent.innerHTML = `
        <span class="step-badge"><i class="fa-solid fa-briefcase"></i> Employment Details</span>
        <h1 class="step-title">Tell us about your current job</h1>
        <p class="step-subtitle">We'll help you upskill, switch roles, or increase your compensation.</p>

        <div style="display: flex; flex-direction: column; gap: 18px; margin-top: 12px;">
          <div class="form-row-2">
            <div>
              <label style="font-size: 13px; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 6px;">Current Job Title / Role</label>
              <input type="text" id="employedRole" class="select-custom" value="${profile.employment.role || 'Software Developer'}" placeholder="e.g. Junior Developer">
            </div>
            <div>
              <label style="font-size: 13px; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 6px;">Years of Experience</label>
              <select id="employedExp" class="select-custom">
                <option value="0-1 years">0-1 years</option>
                <option value="1-3 years" selected>1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
          </div>

          <div>
            <label style="font-size: 13px; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 6px;">Industry</label>
            <select id="employedIndustry" class="select-custom">
              <option value="IT & Tech" selected>IT & Tech</option>
              <option value="Banking & Finance">Banking & Finance</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Retail & E-commerce">Retail & E-commerce</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style="font-size: 14px; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 10px;">What would you like to achieve next?</label>
            <div class="cards-grid cols-2" id="employedNextGrid">
              <div class="choice-card selected" data-val="Grow in current career">
                <div class="choice-title">Grow in current career</div>
                <i class="fa-solid fa-circle-check choice-check"></i>
              </div>
              <div class="choice-card" data-val="Switch career">
                <div class="choice-title">Switch career / domain</div>
                <i class="fa-solid fa-circle-check choice-check"></i>
              </div>
              <div class="choice-card" data-val="Get a better job">
                <div class="choice-title">Get a better high-paying job</div>
                <i class="fa-solid fa-circle-check choice-check"></i>
              </div>
              <div class="choice-card" data-val="Learn new skills">
                <div class="choice-title">Learn new skills & certifications</div>
                <i class="fa-solid fa-circle-check choice-check"></i>
              </div>
            </div>
          </div>
        </div>
      `;

      setupChoiceGrid(document.getElementById('employedNextGrid'), false);
    } 
    else if (profile.status === 'unemployed') {
      dynamicStatusFormContent.innerHTML = `
        <span class="step-badge"><i class="fa-solid fa-magnifying-glass"></i> Career Restart</span>
        <h1 class="step-title">What were you doing previously?</h1>
        <p class="step-subtitle">Tell us your background so we can connect you to immediate job opportunities or training.</p>

        <div style="display: flex; flex-direction: column; gap: 18px; margin-top: 12px;">
          <div>
            <label style="font-size: 14px; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 8px;">Previous Status</label>
            <div class="cards-grid cols-3" id="unemployedPrevGrid">
              <div class="choice-card selected" data-val="Recent Graduate">
                <div class="choice-title">Recent Graduate</div>
                <i class="fa-solid fa-circle-check choice-check"></i>
              </div>
              <div class="choice-card" data-val="Previously Employed">
                <div class="choice-title">Previously Employed</div>
                <i class="fa-solid fa-circle-check choice-check"></i>
              </div>
              <div class="choice-card" data-val="Career Break">
                <div class="choice-title">Career Break / Sabbatical</div>
                <i class="fa-solid fa-circle-check choice-check"></i>
              </div>
            </div>
          </div>

          <div>
            <label style="font-size: 14px; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 8px;">What are you looking for right now?</label>
            <div class="cards-grid cols-2" id="unemployedLookingGrid">
              <div class="choice-card selected" data-val="Immediate Job">
                <div class="choice-title">Immediate Job Opportunities</div>
                <i class="fa-solid fa-circle-check choice-check"></i>
              </div>
              <div class="choice-card" data-val="Skill Training">
                <div class="choice-title">Free Skill Training Programs</div>
                <i class="fa-solid fa-circle-check choice-check"></i>
              </div>
              <div class="choice-card" data-val="Government Support">
                <div class="choice-title">Government Allowances & Schemes</div>
                <i class="fa-solid fa-circle-check choice-check"></i>
              </div>
              <div class="choice-card" data-val="Career Guidance">
                <div class="choice-title">1-on-1 Mentorship & Resume Help</div>
                <i class="fa-solid fa-circle-check choice-check"></i>
              </div>
            </div>
          </div>
        </div>
      `;

      setupChoiceGrid(document.getElementById('unemployedPrevGrid'), false);
      setupChoiceGrid(document.getElementById('unemployedLookingGrid'), true);
    }
  }

  // ================= SAVE DATA AT EACH STEP =================
  function saveCurrentStepData() {
    // Step 1: Status
    if (statusGrid) {
      const selectedStatus = statusGrid.querySelector('.choice-card.selected');
      if (selectedStatus) {
        profile.status = selectedStatus.getAttribute('data-status') || 'student';
      }
    }

    // Step 2: Name
    if (nameInput && nameInput.value) {
      profile.basic.name = nameInput.value.trim();
    }

    // Step 3: Age
    if (ageSlider && ageSlider.value) {
      profile.basic.age = parseInt(ageSlider.value, 10);
    }

    // Step 4: Location
    if (stateSelect && cityInput) {
      profile.basic.state = stateSelect.value;
      profile.basic.district = (cityInput.value && cityInput.value.trim()) || 'Chennai';
    }

    // Step 5: Save status-specific branch fields
    if (profile.status === 'student') {
      const studentEduLevel = document.getElementById('studentEduLevel');
      const studentDegree = document.getElementById('studentDegree');
      const studentSpec = document.getElementById('studentSpec');
      const studentYear = document.getElementById('studentYear');

      if (studentEduLevel) profile.education.level = studentEduLevel.value;
      if (studentDegree) profile.education.degree = studentDegree.value;
      if (studentSpec) profile.education.specialization = studentSpec.value.trim();
      if (studentYear) profile.education.current_year = studentYear.value;
    }
    else if (profile.status === 'employed') {
      const employedRole = document.getElementById('employedRole');
      const employedExp = document.getElementById('employedExp');
      const employedIndustry = document.getElementById('employedIndustry');
      const employedNextGrid = document.getElementById('employedNextGrid');

      if (employedRole) profile.employment.role = employedRole.value.trim();
      if (employedExp) profile.employment.experience = employedExp.value;
      if (employedIndustry) profile.employment.industry = employedIndustry.value;
      if (employedNextGrid) {
        const sel = employedNextGrid.querySelector('.choice-card.selected');
        if (sel) profile.employment.next_goal = sel.getAttribute('data-val');
      }
    }
    else if (profile.status === 'unemployed') {
      const unemployedPrevGrid = document.getElementById('unemployedPrevGrid');
      const unemployedLookingGrid = document.getElementById('unemployedLookingGrid');

      if (unemployedPrevGrid) {
        const sel = unemployedPrevGrid.querySelector('.choice-card.selected');
        if (sel) profile.unemployed.previous_status = sel.getAttribute('data-val');
      }
      if (unemployedLookingGrid) {
        const sels = Array.from(unemployedLookingGrid.querySelectorAll('.choice-card.selected')).map(el => el.getAttribute('data-val'));
        profile.unemployed.looking_for = sels;
      }
    }
    else if (profile.status === 'entrepreneur') {
      const entrepreneurStageGrid = document.getElementById('entrepreneurStageGrid');
      const entrepreneurSupportGrid = document.getElementById('entrepreneurSupportGrid');

      if (entrepreneurStageGrid) {
        const sel = entrepreneurStageGrid.querySelector('.choice-card.selected');
        if (sel) profile.entrepreneur.stage = sel.getAttribute('data-val');
      }
      if (entrepreneurSupportGrid) {
        const sels = Array.from(entrepreneurSupportGrid.querySelectorAll('.choice-card.selected')).map(el => el.getAttribute('data-val'));
        profile.entrepreneur.support_needed = sels;
      }
    }

    // Step 7: Goals
    if (questGrid) {
      const selectedQuests = Array.from(questGrid.querySelectorAll('.choice-card.selected')).map(el => el.getAttribute('data-quest'));
      if (selectedQuests.length) {
        profile.career.goals = selectedQuests;
      }
    }

    // Step 8: Target Role
    if (targetRoleGrid) {
      const selectedRoles = Array.from(targetRoleGrid.querySelectorAll('.tag-chip.selected')).map(el => el.getAttribute('data-role'));
      if (selectedRoles.length) {
        profile.career.target_roles = selectedRoles;
      }
    }

    // Step 9: Work Location
    if (workLocGrid) {
      const selectedLocs = Array.from(workLocGrid.querySelectorAll('.choice-card.selected')).map(el => el.getAttribute('data-loc'));
      if (selectedLocs.length) {
        profile.preferences.work_location = selectedLocs;
      }
    }

    // Step 10: Income
    if (incomeGrid) {
      const selectedInc = incomeGrid.querySelector('.choice-card.selected');
      if (selectedInc) {
        profile.financial.income_range = selectedInc.getAttribute('data-inc');
      }
    }

    // Step 11: Learning Format
    if (learningFormatGrid) {
      const selectedFmt = learningFormatGrid.querySelector('.choice-card.selected');
      if (selectedFmt) {
        profile.preferences.learning_mode = [selectedFmt.getAttribute('data-fmt')];
      }
    }

    // Step 12: Support Interests
    if (supportGrid) {
      const selectedSup = Array.from(supportGrid.querySelectorAll('.choice-card.selected')).map(el => el.getAttribute('data-sup'));
      if (selectedSup.length) {
        profile.support_interests = selectedSup;
      }
    }
  }

  // ================= STEP 3: AGE SLIDER CONTROLS =================
  ageSlider.addEventListener('input', (e) => {
    ageDisplay.textContent = e.target.value;
    profile.basic.age = parseInt(e.target.value, 10);
  });

  ageMinusBtn.addEventListener('click', () => {
    let val = parseInt(ageSlider.value, 10);
    if (val > 18) {
      val--;
      ageSlider.value = val;
      ageDisplay.textContent = val;
      profile.basic.age = val;
    }
  });

  agePlusBtn.addEventListener('click', () => {
    let val = parseInt(ageSlider.value, 10);
    if (val < 60) {
      val++;
      ageSlider.value = val;
      ageDisplay.textContent = val;
      profile.basic.age = val;
    }
  });

  // ================= STEP 4: LOCATION HANDLER =================
  btnAutoLoc.addEventListener('click', () => {
    btnAutoLoc.classList.add('active');
    btnManualLoc.classList.remove('active');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          stateSelect.value = "Tamil Nadu";
          cityInput.value = "Chennai";
          updateLocBadge();
        },
        () => {
          stateSelect.value = "Tamil Nadu";
          cityInput.value = "Chennai";
          updateLocBadge();
        }
      );
    }
  });

  btnManualLoc.addEventListener('click', () => {
    btnManualLoc.classList.add('active');
    btnAutoLoc.classList.remove('active');
  });

  stateSelect.addEventListener('change', updateLocBadge);
  cityInput.addEventListener('input', updateLocBadge);

  function updateLocBadge() {
    locDisplayBadge.innerHTML = `<i class="fa-solid fa-map-pin"></i> 📍 ${stateSelect.value} • ${cityInput.value || 'District'}`;
  }

  // ================= CHOICE CARDS MULTI/SINGLE SELECT ENGINE =================
  setupChoiceGrid(questGrid, true);
  setupChoiceGrid(workLocGrid, true);
  setupChoiceGrid(incomeGrid, false);
  setupChoiceGrid(learningFormatGrid, false);
  setupChoiceGrid(supportGrid, true);

  // Target Roles tag chips
  targetRoleGrid.querySelectorAll('.tag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      targetRoleGrid.querySelectorAll('.tag-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      profile.career.target_roles = [chip.getAttribute('data-role')];
    });
  });

  function setupChoiceGrid(container, allowMultiple = false) {
    if (!container) return;
    const cards = container.querySelectorAll('.choice-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        if (!allowMultiple) {
          cards.forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
        } else {
          card.classList.toggle('selected');
        }
      });
    });
  }

  // ================= STEP 6: VISUAL SKILL TREE =================
  function initSkillTree() {
    if (!skillTreeContainer) return;
    skillTreeContainer.innerHTML = '';

    skillCategories.forEach(cat => {
      const catBlock = document.createElement('div');
      catBlock.className = 'skill-category-block';

      const catHeader = document.createElement('div');
      catHeader.className = 'skill-cat-header';
      catHeader.innerHTML = `
        <span class="skill-cat-title">${cat.name}</span>
        <i class="fa-solid fa-chevron-down" style="font-size: 12px; color: var(--text-muted);"></i>
      `;

      const chipsGrid = document.createElement('div');
      chipsGrid.className = 'skill-chips-grid';

      cat.skills.forEach(skillName => {
        const chip = document.createElement('div');
        chip.className = 'skill-chip';

        // Check if in profile
        const existing = profile.skills.find(s => s.name === skillName);
        if (existing) {
          if (existing.status === 'known') chip.classList.add('state-known');
          if (existing.status === 'learning') chip.classList.add('state-learning');
        }

        chip.innerHTML = getSkillChipHTML(skillName, existing ? existing.status : 'none');

        chip.addEventListener('click', () => {
          toggleSkillState(skillName, chip);
        });

        chipsGrid.appendChild(chip);
      });

      catBlock.appendChild(catHeader);
      catBlock.appendChild(chipsGrid);
      skillTreeContainer.appendChild(catBlock);
    });
  }

  function getSkillChipHTML(skillName, status) {
    if (status === 'known') {
      return `<i class="fa-solid fa-check"></i> ${skillName}`;
    } else if (status === 'learning') {
      return `<i class="fa-solid fa-circle-half-stroke"></i> ${skillName}`;
    } else {
      return `<i class="fa-solid fa-plus" style="font-size: 11px; opacity: 0.5;"></i> ${skillName}`;
    }
  }

  function toggleSkillState(skillName, chipElem) {
    let existingIndex = profile.skills.findIndex(s => s.name === skillName);
    let currentStatus = existingIndex >= 0 ? profile.skills[existingIndex].status : 'none';

    let nextStatus = 'none';
    if (currentStatus === 'none') nextStatus = 'known';
    else if (currentStatus === 'known') nextStatus = 'learning';
    else if (currentStatus === 'learning') nextStatus = 'none';

    // Update profile
    if (nextStatus === 'none') {
      if (existingIndex >= 0) profile.skills.splice(existingIndex, 1);
      chipElem.className = 'skill-chip';
    } else if (nextStatus === 'known') {
      if (existingIndex >= 0) profile.skills[existingIndex].status = 'known';
      else profile.skills.push({ name: skillName, status: 'known' });
      chipElem.className = 'skill-chip state-known';
    } else if (nextStatus === 'learning') {
      if (existingIndex >= 0) profile.skills[existingIndex].status = 'learning';
      else profile.skills.push({ name: skillName, status: 'learning' });
      chipElem.className = 'skill-chip state-learning';
    }

    chipElem.innerHTML = getSkillChipHTML(skillName, nextStatus);
    renderOrbitSkills();
  }

  // ================= ORBITING SKILL BADGES ON CHARACTER =================
  function renderOrbitSkills() {
    if (!orbitSkillsContainer) return;
    orbitSkillsContainer.innerHTML = '';

    profile.skills.slice(0, 4).forEach((sk, idx) => {
      const badge = document.createElement('div');
      badge.className = `floating-skill-chip ${sk.status}`;

      const positions = [
        { top: '15%', left: '5%' },
        { top: '25%', right: '5%' },
        { bottom: '25%', left: '2%' },
        { bottom: '15%', right: '2%' }
      ];

      const pos = positions[idx % positions.length];
      badge.style.top = pos.top || 'auto';
      badge.style.bottom = pos.bottom || 'auto';
      badge.style.left = pos.left || 'auto';
      badge.style.right = pos.right || 'auto';

      const icon = sk.status === 'known' ? '✓' : '◐';
      badge.innerHTML = `<span>${sk.name}</span> <strong>${icon}</strong>`;

      orbitSkillsContainer.appendChild(badge);
    });
  }

  // ================= STEP 13: AI SIMULATION ENGINE =================
  function runAISimulation() {
    const item1 = document.getElementById('aiItem1');
    const item2 = document.getElementById('aiItem2');
    const item3 = document.getElementById('aiItem3');
    const item4 = document.getElementById('aiItem4');

    setTimeout(() => {
      item1.className = 'ai-check-item done';
      item1.innerHTML = '<i class="fa-solid fa-circle-check"></i> Profile parameters analyzed';
      item2.className = 'ai-check-item';
      item2.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Matching Tamil Nadu schemes...';
    }, 600);

    setTimeout(() => {
      item2.className = 'ai-check-item done';
      item2.innerHTML = '<i class="fa-solid fa-circle-check"></i> 7 Tamil Nadu schemes matched';
      item3.className = 'ai-check-item';
      item3.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Identifying job opportunities...';
    }, 1200);

    setTimeout(() => {
      item3.className = 'ai-check-item done';
      item3.innerHTML = '<i class="fa-solid fa-circle-check"></i> 12 Job opportunities matched';
      item4.className = 'ai-check-item';
      item4.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Mapping skill gap courses...';
    }, 1800);

    setTimeout(() => {
      item4.className = 'ai-check-item done';
      item4.innerHTML = '<i class="fa-solid fa-circle-check"></i> 5 Skill gap courses matched';
    }, 2400);

    // Auto advance to Step 14 after 2.8s
    setTimeout(() => {
      const sequence = getStepSequence(profile.status);
      if (sequence[currentStepIndex] === 13) {
        currentStepIndex = sequence.length - 1;
        updateStepView();
      }
    }, 2800);
  }

  // ================= STEP 14: SUMMARY CARD RENDERER =================
  function renderSummaryCard() {
    const name = profile.basic.name || "Ananya";
    summaryName.textContent = name;
    summaryAvatar.textContent = name.charAt(0).toUpperCase();

    let detailsStr = "";
    if (profile.status === 'student') {
      detailsStr = `Student • ${profile.education.degree} ${profile.education.specialization} • ${profile.basic.district}`;
    } else if (profile.status === 'employed') {
      detailsStr = `Employed • ${profile.employment.role || 'Professional'} (${profile.employment.industry || 'Tech'}) • ${profile.basic.district}`;
    } else if (profile.status === 'unemployed') {
      detailsStr = `Career Restart • ${profile.unemployed.previous_status || 'Looking for work'} • ${profile.basic.district}`;
    } else if (profile.status === 'entrepreneur') {
      detailsStr = `Entrepreneur • ${profile.entrepreneur.stage || 'Business Founder'} • ${profile.basic.district}`;
    }

    summarySub.textContent = detailsStr;
  }

  // ================= CELEBRATION CONFETTI ENGINE =================
  function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const numberOfPieces = 80;
    const colors = ['#FF1744', '#6C5CE7', '#00B894', '#FFB300', '#00CEC9'];

    for (let i = 0; i < numberOfPieces; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 4 + 2,
        rotation: Math.random() * 360
      });
    }

    function animateConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.speed;
        p.rotation += 2;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (pieces.some(p => p.y < canvas.height)) {
        requestAnimationFrame(animateConfetti);
      }
    }

    animateConfetti();
  }

});
