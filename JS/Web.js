document.addEventListener('DOMContentLoaded', () => {
  highlightCurrentNavLink();
  setupServiceToggles();
  setupEnquiryForm();
  setupContactCopyButton();
  addBackToTopButton();
});

function highlightCurrentNavLink() {
  const links = document.querySelectorAll('nav a');
  const locationFile = window.location.pathname.split('/').pop();

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === locationFile || (href === 'Home.html' && locationFile === '')) {
      link.classList.add('active');
    }
  });
}


