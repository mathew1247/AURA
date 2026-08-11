// ----------------------------------------------------
// EMPOWHER Conditional Profile Onboarding Logic
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

  // --- State Variables ---
  let selectedStatus = localStorage.getItem('userStatus') || null;
  let selectedSkills = [];
  let selectedGoal = null;
  let hasExperienceChoice = null;

  // --- Element References ---
  const stepStatusView = document.getElementById('stepStatusView');
  const stepFormView = document.getElementById('stepFormView');
  const stepTransitionView = document.getElementById('stepTransitionView');

  const statusCards = document.querySelectorAll('.status-card');
  const continueBtn = document.getElementById('continueBtn');
  const backToStatusBtn = document.getElementById('backToStatusBtn');

  const formTitle = document.getElementById('formTitle');
  const formSubtitle = document.getElementById('formSubtitle');
  const dynamicFormFields = document.getElementById('dynamicFormFields');
  const profileForm = document.getElementById('profileForm');

  // If userStatus was already stored, pre-select card
  if (selectedStatus) {
    statusCards.forEach(c => {
      if (c.getAttribute('data-status') === selectedStatus) {
        c.classList.add('selected');
        continueBtn.disabled = false;
        continueBtn.classList.remove('disabled');
      }
    });
  }

  // --- Step 1: Status Selection Handlers ---
  statusCards.forEach(card => {
    card.addEventListener('click', () => {
      statusCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedStatus = card.getAttribute('data-status');
      continueBtn.disabled = false;
      continueBtn.classList.remove('disabled');
    });
  });

  continueBtn.addEventListener('click', () => {
    if (selectedStatus) {
      localStorage.setItem('userStatus', selectedStatus);
      showFormView(selectedStatus);
    }
  });

  backToStatusBtn.addEventListener('click', () => {
    stepFormView.style.display = 'none';
    stepStatusView.style.display = 'flex';
  });

  // --- Step 2: Render Conditional Profile Form ---
  function showFormView(status) {
    stepStatusView.style.display = 'none';
    stepFormView.style.display = 'flex';
    window.scrollTo(0, 0);

    selectedSkills = [];
    selectedGoal = null;

    if (status === 'student') {
      renderStudentForm();
    } else if (status === 'employed') {
      renderEmployedForm();
    } else if (status === 'looking_for_work') {
      renderLookingForWorkForm();
    }
  }

  // --- 1. STUDENT FORM RENDERER ---
  function renderStudentForm() {
    formTitle.textContent = "Tell us about your education";
    formSubtitle.textContent = "Help us understand where you are today so we can personalize your Empowher journey.";

    dynamicFormFields.innerHTML = `
      <!-- Section 1: Basic Information -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-regular fa-user"></i> Basic Information</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Full Name <span class="req">*</span></label>
            <input type="text" id="fullName" class="form-input" placeholder="e.g. Ananya Sharma" required>
            <div class="error-text">Please enter your full name</div>
          </div>
          <div class="form-group">
            <label class="form-label">Age <span class="req">*</span></label>
            <input type="number" id="age" class="form-input" placeholder="e.g. 21" min="15" max="100" required>
            <div class="error-text">Please enter a valid age</div>
          </div>
          <div class="form-group">
            <label class="form-label">State <span class="req">*</span></label>
            <select id="state" class="form-select" required>
              <option value="">Select State</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Telangana">Telangana</option>
              <option value="Other">Other</option>
            </select>
            <div class="error-text">Please select your state</div>
          </div>
          <div class="form-group">
            <label class="form-label">City / District <span class="req">*</span></label>
            <input type="text" id="city" class="form-input" placeholder="e.g. Mumbai" required>
            <div class="error-text">Please enter your city</div>
          </div>
        </div>
      </div>

      <!-- Section 2: Education -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-solid fa-graduation-cap"></i> Education Details</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Education Level <span class="req">*</span></label>
            <select id="eduLevel" class="form-select" required>
              <option value="">Select Education Level</option>
              <option value="10th">10th</option>
              <option value="12th">12th</option>
              <option value="Diploma">Diploma</option>
              <option value="Undergraduate">Undergraduate (B.Tech, B.Sc, B.A, B.Com)</option>
              <option value="Postgraduate">Postgraduate (M.Tech, M.Sc, M.A, MBA)</option>
              <option value="Other">Other</option>
            </select>
            <div class="error-text">Please select your education level</div>
          </div>
          <div class="form-group">
            <label class="form-label">Degree / Course</label>
            <input type="text" id="degree" class="form-input" placeholder="e.g. B.Tech Computer Science">
          </div>
          <div class="form-group">
            <label class="form-label">Specialization</label>
            <input type="text" id="specialization" class="form-input" placeholder="e.g. Artificial Intelligence">
          </div>
          <div class="form-group">
            <label class="form-label">Current Year</label>
            <select id="currentYear" class="form-select">
              <option value="">Select Current Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Final Year">Final Year</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Expected Graduation Year</label>
            <select id="gradYear" class="form-select">
              <option value="">Select Graduation Year</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028+</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Section 3: Skills -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-solid fa-lightbulb"></i> What skills do you have?</h2>
        <p class="form-section-desc">Select skills you possess or are currently learning.</p>
        <div class="skills-chips-wrapper" id="skillsWrapper">
          ${renderSkillChips(['Python', 'Java', 'JavaScript', 'SQL', 'Excel', 'Data Analytics', 'Web Development', 'Communication', 'Leadership', 'Problem Solving', 'Digital Marketing'])}
        </div>
        <div class="add-skill-box">
          <input type="text" id="customSkillInput" class="form-input input-sm" placeholder="Add custom skill...">
          <button type="button" class="btn-secondary-sm" id="addCustomSkillBtn"><i class="fa-solid fa-plus"></i> Add Skill</button>
        </div>
      </div>

      <!-- Section 4: Career Goal -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-solid fa-bullseye"></i> What do you want to achieve?</h2>
        <div class="cards-select-grid" id="goalCardsGrid">
          ${renderGoalCard('Find a Job', 'fa-briefcase', 'Find a Job')}
          ${renderGoalCard('Get an Internship', 'fa-user-graduate', 'Get an Internship')}
          ${renderGoalCard('Learn New Skills', 'fa-book-open', 'Learn New Skills')}
          ${renderGoalCard('Get Certified', 'fa-award', 'Get Certified')}
          ${renderGoalCard('Prepare for Higher Studies', 'fa-university', 'Prepare for Higher Studies')}
          ${renderGoalCard('Start a Business', 'fa-rocket', 'Start a Business')}
          ${renderGoalCard('Explore Opportunities', 'fa-compass', 'Explore Opportunities')}
        </div>
        <div id="targetRoleGroup" class="form-group style-conditional" style="display: none; margin-top: 18px;">
          <label class="form-label">Target Role</label>
          <input type="text" id="targetRole" class="form-input" placeholder="e.g. Data Analyst, Software Developer, UI/UX Designer">
        </div>
      </div>

      <!-- Section 5: Preferences -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-solid fa-sliders"></i> Preferences</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Preferred Work Location</label>
            <select id="prefLocation" class="form-select">
              <option value="Nearby">Nearby</option>
              <option value="Same State">Same State</option>
              <option value="Anywhere in India">Anywhere in India</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Work Preference</label>
            <select id="workPref" class="form-select">
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>
      </div>
    `;

    attachDynamicListeners();
  }


  // --- 2. EMPLOYED FORM RENDERER ---
  function renderEmployedForm() {
    formTitle.textContent = "Tell us about your career";
    formSubtitle.textContent = "Help us understand your current career so Empowher can identify your next opportunities.";

    dynamicFormFields.innerHTML = `
      <!-- Section 1: Basic Information -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-regular fa-user"></i> Basic Information</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Full Name <span class="req">*</span></label>
            <input type="text" id="fullName" class="form-input" placeholder="e.g. Priya Nair" required>
            <div class="error-text">Please enter your full name</div>
          </div>
          <div class="form-group">
            <label class="form-label">Age <span class="req">*</span></label>
            <input type="number" id="age" class="form-input" placeholder="e.g. 28" min="18" max="100" required>
            <div class="error-text">Please enter a valid age</div>
          </div>
          <div class="form-group">
            <label class="form-label">State <span class="req">*</span></label>
            <select id="state" class="form-select" required>
              <option value="">Select State</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Other">Other</option>
            </select>
            <div class="error-text">Please select your state</div>
          </div>
          <div class="form-group">
            <label class="form-label">City / District <span class="req">*</span></label>
            <input type="text" id="city" class="form-input" placeholder="e.g. Bengaluru" required>
            <div class="error-text">Please enter your city</div>
          </div>
        </div>
      </div>

      <!-- Section 2: Current Work -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-solid fa-briefcase"></i> Current Work</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Current Job Title <span class="req">*</span></label>
            <input type="text" id="jobTitle" class="form-input" placeholder="e.g. Senior Software Engineer" required>
            <div class="error-text">Please enter your current job title</div>
          </div>
          <div class="form-group">
            <label class="form-label">Industry <span class="req">*</span></label>
            <select id="industry" class="form-select" required>
              <option value="">Select Industry</option>
              <option value="IT & Software">IT & Software</option>
              <option value="Finance & Banking">Finance & Banking</option>
              <option value="Healthcare & Medical">Healthcare & Medical</option>
              <option value="Education & EdTech">Education & EdTech</option>
              <option value="E-Commerce & Retail">E-Commerce & Retail</option>
              <option value="Manufacturing & Engineering">Manufacturing & Engineering</option>
              <option value="Media & Marketing">Media & Marketing</option>
              <option value="Other">Other</option>
            </select>
            <div class="error-text">Please select your industry</div>
          </div>
          <div class="form-group">
            <label class="form-label">Years of Experience <span class="req">*</span></label>
            <select id="experience" class="form-select" required>
              <option value="">Select Experience</option>
              <option value="0–1">0–1 Year</option>
              <option value="1–3">1–3 Years</option>
              <option value="3–5">3–5 Years</option>
              <option value="5–10">5–10 Years</option>
              <option value="10+">10+ Years</option>
            </select>
            <div class="error-text">Please select your experience level</div>
          </div>
          <div class="form-group">
            <label class="form-label">Employment Type</label>
            <select id="employmentType" class="form-select">
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div class="form-group full-width">
            <label class="form-label">Current Company <span class="optional">(Optional)</span></label>
            <input type="text" id="company" class="form-input" placeholder="e.g. Acme Tech Solutions">
          </div>
        </div>
      </div>

      <!-- Section 3: Education -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-solid fa-graduation-cap"></i> Education Background</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Highest Education Level <span class="req">*</span></label>
            <select id="eduLevel" class="form-select" required>
              <option value="">Select Education Level</option>
              <option value="10th">10th</option>
              <option value="12th">12th</option>
              <option value="Diploma">Diploma</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Other">Other</option>
            </select>
            <div class="error-text">Please select education level</div>
          </div>
          <div class="form-group">
            <label class="form-label">Degree / Course</label>
            <input type="text" id="degree" class="form-input" placeholder="e.g. B.Sc Computer Science">
          </div>
          <div class="form-group">
            <label class="form-label">Specialization</label>
            <input type="text" id="specialization" class="form-input" placeholder="e.g. Information Technology">
          </div>
        </div>
      </div>

      <!-- Section 4: Skills -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-solid fa-lightbulb"></i> Skills & Expertise</h2>
        <div class="skills-chips-wrapper" id="skillsWrapper">
          ${renderSkillChips(['Python', 'SQL', 'Excel', 'Communication', 'Leadership', 'Project Management', 'Data Analysis', 'Marketing', 'Finance', 'Design', 'Programming'])}
        </div>
        <div class="add-skill-box">
          <input type="text" id="customSkillInput" class="form-input input-sm" placeholder="Add custom skill...">
          <button type="button" class="btn-secondary-sm" id="addCustomSkillBtn"><i class="fa-solid fa-plus"></i> Add Skill</button>
        </div>
      </div>

      <!-- Section 5: Career Goal -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-solid fa-bullseye"></i> What do you want to achieve next?</h2>
        <div class="cards-select-grid" id="goalCardsGrid">
          ${renderGoalCard('Grow in My Current Career', 'fa-arrow-trend-up', 'Grow in My Current Career')}
          ${renderGoalCard('Find a Better Job', 'fa-briefcase', 'Find a Better Job')}
          ${renderGoalCard('Change Career', 'fa-arrows-rotate', 'Change Career')}
          ${renderGoalCard('Learn New Skills', 'fa-book-open', 'Learn New Skills')}
          ${renderGoalCard('Get Certified', 'fa-award', 'Get Certified')}
          ${renderGoalCard('Increase My Income', 'fa-indian-rupee-sign', 'Increase My Income')}
        </div>
        <div class="form-grid style-conditional" style="margin-top: 18px;">
          <div class="form-group">
            <label class="form-label">Target Role</label>
            <input type="text" id="targetRole" class="form-input" placeholder="e.g. Engineering Lead, Product Manager">
          </div>
          <div class="form-group">
            <label class="form-label">Desired Industry</label>
            <input type="text" id="desiredIndustry" class="form-input" placeholder="e.g. FinTech, Artificial Intelligence">
          </div>
        </div>
      </div>

      <!-- Section 6: Job Preferences -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-solid fa-sliders"></i> Job Preferences</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Preferred Location</label>
            <select id="prefLocation" class="form-select">
              <option value="Same City">Same City</option>
              <option value="Anywhere in India">Anywhere in India</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Work Mode</label>
            <select id="workMode" class="form-select">
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Preferred Employment Type</label>
            <select id="employmentTypePref" class="form-select">
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>
      </div>
    `;

    attachDynamicListeners();
  }


  // --- 3. LOOKING FOR WORK FORM RENDERER ---
  function renderLookingForWorkForm() {
    formTitle.textContent = "Let's find your next opportunity";
    formSubtitle.textContent = "Tell us about your experience and goals so we can find relevant opportunities for you.";

    dynamicFormFields.innerHTML = `
      <!-- Section 1: Basic Information -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-regular fa-user"></i> Basic Information</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Full Name <span class="req">*</span></label>
            <input type="text" id="fullName" class="form-input" placeholder="e.g. Sunita Rao" required>
            <div class="error-text">Please enter your full name</div>
          </div>
          <div class="form-group">
            <label class="form-label">Age <span class="req">*</span></label>
            <input type="number" id="age" class="form-input" placeholder="e.g. 24" min="18" max="100" required>
            <div class="error-text">Please enter a valid age</div>
          </div>
          <div class="form-group">
            <label class="form-label">State <span class="req">*</span></label>
            <select id="state" class="form-select" required>
              <option value="">Select State</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Other">Other</option>
            </select>
            <div class="error-text">Please select your state</div>
          </div>
          <div class="form-group">
            <label class="form-label">City / District <span class="req">*</span></label>
            <input type="text" id="city" class="form-input" placeholder="e.g. Pune" required>
            <div class="error-text">Please enter your city</div>
          </div>
        </div>
      </div>

      <!-- Section 2: Education -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-solid fa-graduation-cap"></i> Highest Education Level</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Education Level <span class="req">*</span></label>
            <select id="eduLevel" class="form-select" required>
              <option value="">Select Education Level</option>
              <option value="10th">10th</option>
              <option value="12th">12th</option>
              <option value="Diploma">Diploma</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Other">Other</option>
            </select>
            <div class="error-text">Please select education level</div>
          </div>
          <div class="form-group">
            <label class="form-label">Degree / Course</label>
            <input type="text" id="degree" class="form-input" placeholder="e.g. B.Com Finance">
          </div>
          <div class="form-group">
            <label class="form-label">Specialization</label>
            <input type="text" id="specialization" class="form-input" placeholder="e.g. Accounting">
          </div>
        </div>
      </div>

      <!-- Section 3: Experience -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-solid fa-briefcase"></i> Previous Work Experience</h2>
        <p class="form-section-desc">Do you have previous work experience?</p>
        <div class="experience-toggle-grid">
          <div class="radio-card" data-exp="yes">
            <i class="fa-solid fa-circle-check radio-icon"></i>
            <div>
              <div class="radio-title">Yes</div>
              <div class="radio-subtitle">I have previous work experience</div>
            </div>
          </div>
          <div class="radio-card" data-exp="no">
            <i class="fa-solid fa-circle-check radio-icon"></i>
            <div>
              <div class="radio-title">No — I'm a Fresher</div>
              <div class="radio-subtitle">I am starting my career journey</div>
            </div>
          </div>
        </div>

        <!-- Conditional Experience Fields -->
        <div id="prevExpFields" class="form-grid style-conditional" style="display: none; margin-top: 20px;">
          <div class="form-group">
            <label class="form-label">Previous Job Title</label>
            <input type="text" id="prevJobTitle" class="form-input" placeholder="e.g. Operations Assistant">
          </div>
          <div class="form-group">
            <label class="form-label">Previous Industry</label>
            <input type="text" id="prevIndustry" class="form-input" placeholder="e.g. Retail, Customer Service">
          </div>
          <div class="form-group">
            <label class="form-label">Years of Experience</label>
            <select id="prevExperience" class="form-select">
              <option value="0–1">0–1 Year</option>
              <option value="1–3">1–3 Years</option>
              <option value="3–5">3–5 Years</option>
              <option value="5+">5+ Years</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Previous Work Type</label>
            <select id="prevWorkType" class="form-select">
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
        </div>

        <div id="fresherNoteMsg" class="fresher-encouragement-card" style="display: none; margin-top: 18px;">
          <i class="fa-solid fa-seedling"></i>
          <span>That's okay! We'll help you build your path and land your first opportunity.</span>
        </div>
      </div>

      <!-- Section 4: Skills -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-solid fa-lightbulb"></i> Skills</h2>
        <div class="skills-chips-wrapper" id="skillsWrapper">
          ${renderSkillChips(['Python', 'Java', 'SQL', 'Excel', 'Communication', 'Leadership', 'Data Analysis', 'Digital Marketing', 'Customer Service', 'Design'])}
        </div>
        <div class="add-skill-box">
          <input type="text" id="customSkillInput" class="form-input input-sm" placeholder="Add custom skill...">
          <button type="button" class="btn-secondary-sm" id="addCustomSkillBtn"><i class="fa-solid fa-plus"></i> Add Skill</button>
        </div>
      </div>

      <!-- Section 5: Job Goal -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-solid fa-bullseye"></i> What kind of opportunity are you looking for?</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Target Job Role <span class="req">*</span></label>
            <input type="text" id="targetRole" class="form-input" placeholder="e.g. Business Analyst, Data Entry Specialist" required>
            <div class="error-text">Please enter your target job role</div>
          </div>
          <div class="form-group">
            <label class="form-label">Preferred Industry</label>
            <input type="text" id="preferredIndustry" class="form-input" placeholder="e.g. IT, Healthcare, Banking">
          </div>
        </div>

        <div class="cards-select-grid" id="goalCardsGrid" style="margin-top: 16px;">
          ${renderGoalCard('Get My First Job', 'fa-briefcase', 'Get My First Job')}
          ${renderGoalCard('Find a Better Opportunity', 'fa-arrow-trend-up', 'Find a Better Opportunity')}
          ${renderGoalCard('Change Career', 'fa-arrows-rotate', 'Change Career')}
          ${renderGoalCard('Build New Skills', 'fa-book-open', 'Build New Skills')}
          ${renderGoalCard('Get Certified', 'fa-award', 'Get Certified')}
        </div>
      </div>

      <!-- Section 6: Work Preferences -->
      <div class="form-section">
        <h2 class="form-section-title"><i class="fa-solid fa-sliders"></i> Work Preferences</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Preferred Location</label>
            <select id="prefLocation" class="form-select">
              <option value="Nearby">Nearby</option>
              <option value="Same State">Same State</option>
              <option value="Anywhere in India">Anywhere in India</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Work Type</label>
            <select id="workType" class="form-select">
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
              <option value="Any">Any</option>
            </select>
          </div>
        </div>
      </div>
    `;

    attachDynamicListeners();
  }


  // --- Helper UI Components Generators ---
  function renderSkillChips(defaultSkills) {
    return defaultSkills.map(skill => `
      <div class="skill-chip" data-skill="${skill}">
        <span>${skill}</span>
        <i class="fa-solid fa-plus"></i>
      </div>
    `).join('');
  }

  function renderGoalCard(title, iconClass, value) {
    return `
      <div class="goal-card" data-goal="${value}">
        <i class="fa-solid ${iconClass}"></i>
        <span>${title}</span>
      </div>
    `;
  }


  // --- Attach Listeners to Dynamic Form Elements ---
  function attachDynamicListeners() {
    // Skill chips multi-select logic
    const chips = document.querySelectorAll('.skill-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const skillName = chip.getAttribute('data-skill');
        if (chip.classList.contains('selected')) {
          chip.classList.remove('selected');
          chip.querySelector('i').className = 'fa-solid fa-plus';
          selectedSkills = selectedSkills.filter(s => s !== skillName);
        } else {
          chip.classList.add('selected');
          chip.querySelector('i').className = 'fa-solid fa-check';
          selectedSkills.push(skillName);
        }
      });
    });

    // Custom skill add button
    const addCustomSkillBtn = document.getElementById('addCustomSkillBtn');
    const customSkillInput = document.getElementById('customSkillInput');
    const skillsWrapper = document.getElementById('skillsWrapper');

    if (addCustomSkillBtn && customSkillInput) {
      addCustomSkillBtn.addEventListener('click', () => {
        const val = customSkillInput.value.trim();
        if (val && !selectedSkills.includes(val)) {
          selectedSkills.push(val);
          const newChip = document.createElement('div');
          newChip.className = 'skill-chip selected';
          newChip.setAttribute('data-skill', val);
          newChip.innerHTML = `<span>${val}</span> <i class="fa-solid fa-check"></i>`;
          skillsWrapper.appendChild(newChip);

          newChip.addEventListener('click', () => {
            if (newChip.classList.contains('selected')) {
              newChip.classList.remove('selected');
              newChip.querySelector('i').className = 'fa-solid fa-plus';
              selectedSkills = selectedSkills.filter(s => s !== val);
            } else {
              newChip.classList.add('selected');
              newChip.querySelector('i').className = 'fa-solid fa-check';
              selectedSkills.push(val);
            }
          });

          customSkillInput.value = '';
        }
      });
    }

    // Goal cards single select logic
    const goalCards = document.querySelectorAll('.goal-card');
    const targetRoleGroup = document.getElementById('targetRoleGroup');

    goalCards.forEach(gCard => {
      gCard.addEventListener('click', () => {
        goalCards.forEach(c => c.classList.remove('selected'));
        gCard.classList.add('selected');
        selectedGoal = gCard.getAttribute('data-goal');

        // Conditional display for target role in Student form
        if (targetRoleGroup) {
          if (selectedGoal === 'Find a Job' || selectedGoal === 'Get an Internship') {
            targetRoleGroup.style.display = 'block';
          } else {
            targetRoleGroup.style.display = 'none';
          }
        }
      });
    });

    // Experience radio card selection logic (Looking For Work Form)
    const radioCards = document.querySelectorAll('.radio-card');
    const prevExpFields = document.getElementById('prevExpFields');
    const fresherNoteMsg = document.getElementById('fresherNoteMsg');

    radioCards.forEach(rCard => {
      rCard.addEventListener('click', () => {
        radioCards.forEach(c => c.classList.remove('selected'));
        rCard.classList.add('selected');
        hasExperienceChoice = rCard.getAttribute('data-exp');

        if (hasExperienceChoice === 'yes') {
          if (prevExpFields) prevExpFields.style.display = 'grid';
          if (fresherNoteMsg) fresherNoteMsg.style.display = 'none';
        } else {
          if (prevExpFields) prevExpFields.style.display = 'none';
          if (fresherNoteMsg) fresherNoteMsg.style.display = 'flex';
        }
      });
    });
  }


  // --- Form Validation & Submission ---
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset previous errors
    const formGroups = profileForm.querySelectorAll('.form-group');
    formGroups.forEach(g => g.classList.remove('has-error'));

    let isValid = true;
    let firstErrorElement = null;

    // Validate required fields
    const requiredInputs = profileForm.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        const group = input.closest('.form-group');
        if (group) group.classList.add('has-error');
        if (!firstErrorElement) firstErrorElement = input;
      }
    });

    if (!isValid) {
      if (firstErrorElement) {
        firstErrorElement.focus();
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Assemble structured userProfile object
    const userProfile = buildUserProfileObject(selectedStatus);

    // Save to localStorage
    localStorage.setItem('userStatus', selectedStatus);
    localStorage.setItem('userProfile', JSON.stringify(userProfile));

    // Save to MongoDB database via backend
    fetch('/api/onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userProfile)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Profile saved to database:', data);
    })
    .catch(error => {
      console.error('Failed to save profile to database:', error);
    });

    // Show Step 3 Transition & Experience Building Screen
    showTransitionScreen();
  });


  // --- Build Structured Profile Object ---
  function buildUserProfileObject(status) {
    const getValue = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    const baseProfile = {
      status: status,
      basic: {
        name: getValue('fullName'),
        age: getValue('age'),
        state: getValue('state'),
        city: getValue('city')
      },
      education: {
        level: getValue('eduLevel'),
        degree: getValue('degree'),
        specialization: getValue('specialization'),
        currentYear: getValue('currentYear'),
        graduationYear: getValue('gradYear')
      },
      skills: selectedSkills,
      goal: {
        primary: selectedGoal || '',
        targetRole: getValue('targetRole')
      },
      preferences: {
        location: getValue('prefLocation'),
        workType: getValue('workPref') || getValue('workType') || getValue('employmentTypePref')
      }
    };

    if (status === 'employed') {
      baseProfile.currentWork = {
        jobTitle: getValue('jobTitle'),
        industry: getValue('industry'),
        experienceYears: getValue('experience'),
        employmentType: getValue('employmentType'),
        company: getValue('company'),
        desiredIndustry: getValue('desiredIndustry'),
        workMode: getValue('workMode')
      };
    } else if (status === 'looking_for_work') {
      baseProfile.workExperience = {
        hasExperience: hasExperienceChoice || 'no',
        previousJobTitle: getValue('prevJobTitle'),
        previousIndustry: getValue('prevIndustry'),
        experienceYears: getValue('prevExperience'),
        previousWorkType: getValue('prevWorkType'),
        preferredIndustry: getValue('preferredIndustry')
      };
    }

    return baseProfile;
  }


  // --- Step 3: Transition & Redirect ---
  function showTransitionScreen() {
    stepFormView.style.display = 'none';
    stepTransitionView.style.display = 'flex';
    window.scrollTo(0, 0);

    const steps = [
      document.getElementById('tStep1'),
      document.getElementById('tStep2'),
      document.getElementById('tStep3'),
      document.getElementById('tStep4')
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        step.classList.add('completed');
      }, (index + 1) * 450);
    });

    // Redirect to Existing Empowher Dashboard
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2400);
  }

});
