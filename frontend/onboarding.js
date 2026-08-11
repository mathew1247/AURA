// ----------------------------------------------------
// EMPOWHER Onboarding Flow - Status Selection Handler
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.status-card');
  const continueBtn = document.getElementById('continueBtn');
  let selectedStatus = null;

  // Handle card selection
  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected state from all cards
      cards.forEach(c => c.classList.remove('selected'));

      // Add selected state to clicked card
      card.classList.add('selected');
      selectedStatus = card.getAttribute('data-status');

      // Enable Continue button
      continueBtn.disabled = false;
      continueBtn.classList.remove('disabled');
    });
  });

  // Handle Continue button click
  continueBtn.addEventListener('click', () => {
    if (selectedStatus) {
      // Store userStatus in localStorage
      localStorage.setItem('userStatus', selectedStatus);
      
      // Navigate to existing EMPowHER dashboard
      window.location.href = 'index.html';
    }
  });
});
