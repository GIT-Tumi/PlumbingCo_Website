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

function setupServiceToggles() {
  const serviceHeadings = document.querySelectorAll('#services h3');
  serviceHeadings.forEach(heading => {
    heading.classList.add('clickable-heading');
    heading.addEventListener('click', () => {
      const next = heading.nextElementSibling;
      if (next && next.tagName.toLowerCase() === 'ul') {
        next.classList.toggle('collapsed');
        heading.classList.toggle('expanded');
      }
    });
  });
}

function setupEnquiryForm() {
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

