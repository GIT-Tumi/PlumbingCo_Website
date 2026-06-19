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
    if (href === locationFile || (href === 'index.html' && locationFile === '')) {
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

    const feedback = document.createElement('div');
    feedback.className = 'form-feedback';
    feedback.textContent = 'Thank you! Your enquiry has been received and we will contact you soon.';
    form.appendChild(feedback);
    form.reset();

    setTimeout(() => {
      feedback.remove();
    }, 5000);
  });
}

function setupContactCopyButton() {
  const contactSection = document.querySelector('#contact');
  if (!contactSection) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-contact-button';
  button.textContent = 'Copy contact details';
  contactSection.appendChild(button);

  button.addEventListener('click', async () => {
    const contactText = [...contactSection.querySelectorAll('p')]
      .map(el => el.textContent.trim())
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(contactText);
      showInlineMessage(contactSection, 'Contact details copied to clipboard!');
    } catch (error) {
      showInlineMessage(contactSection, 'Unable to copy automatically. Please select and copy manually.');
    }
  });
}

function showInlineMessage(container, text) {
  const existing = container.querySelector('.inline-message');
  if (existing) existing.remove();

  const message = document.createElement('div');
  message.className = 'inline-message';
  message.textContent = text;
  container.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 3500);
}

function addBackToTopButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'back-to-top';
  button.textContent = '↑ Top';
  document.body.appendChild(button);

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    button.style.display = window.scrollY > 220 ? 'block' : 'none';
  });
}
