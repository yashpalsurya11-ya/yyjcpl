/* footer.js - simple subscribe demo + back-to-top + year update */
document.addEventListener('DOMContentLoaded', () => {
  // newsletter demo
  const form = document.getElementById('footer-subscribe');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('footer-email');
      if(!email || !/^\S+@\S+\.\S+$/.test(email.value)){
        alert('Please enter a valid email.');
        return;
      }
      // demo: show success then clear
      alert('Thanks — subscribed!');
      email.value = '';
    });
  }

  // back to top
  const topBtn = document.getElementById('footer-top');
  if(topBtn){
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // set year
  const year = document.getElementById('footer-year');
  if(year) year.textContent = new Date().getFullYear();
});
