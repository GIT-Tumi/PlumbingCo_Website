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
  const form = document.querySelector('#enquiry-form');
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const serviceSelect = form.querySelector('#service');
  const serviceContainer = serviceSelect.closest('div');

  const statusMessage = document.createElement('div');
  statusMessage.className = 'form-status';
  statusMessage.setAttribute('aria-live', 'polite');
  form.appendChild(statusMessage);

  const extraDetailsContainer = document.createElement('div');
  extraDetailsContainer.className = 'form-group extra-service-details';
  extraDetailsContainer.style.display = 'none';
  extraDetailsContainer.innerHTML = `
    <label for="other-details">Please describe your request:</label>
    <textarea id="other-details" name="other_details" rows="3"></textarea>
  `;
  serviceContainer.insertAdjacentElement('afterend', extraDetailsContainer);

  const otherDetailsField = extraDetailsContainer.querySelector('textarea');
  const formFields = [...form.querySelectorAll('input, select, textarea')];

  function updateSubmitState() {
    submitButton.disabled = !form.checkValidity();
    if (statusMessage.textContent && form.checkValidity()) {
      statusMessage.textContent = '';
    }
  }

  function validateField(field) {
    if (field.checkValidity()) {
      field.classList.remove('field-error');
      return true;
    }

    field.classList.add('field-error');
    return false;
  }

  function updateFieldErrors() {
    formFields.forEach(field => validateField(field));
  }

  function toggleExtraServiceDetails() {
    const showExtra = serviceSelect.value === 'other';
    extraDetailsContainer.style.display = showExtra ? 'block' : 'none';
    otherDetailsField.required = showExtra;
    if (!showExtra) {
      otherDetailsField.value = '';
      otherDetailsField.classList.remove('field-error');
    }
    updateSubmitState();
  }

  serviceSelect.addEventListener('change', () => {
    toggleExtraServiceDetails();
    validateField(serviceSelect);
  });

  formFields.forEach(field => {
    field.addEventListener('input', () => {
      validateField(field);
      updateSubmitState();
    });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();

    if (!form.checkValidity()) {
      updateFieldErrors();
      statusMessage.textContent = 'Please complete all required fields before submitting your enquiry.';
      return;
    }

    const name = form.querySelector('#name').value.trim();
    const serviceType = serviceSelect.options[serviceSelect.selectedIndex].text;

    statusMessage.textContent = `Thank you, ${name || 'customer'}! Your enquiry about ${serviceType} has been received.`;
    statusMessage.classList.add('form-feedback');
    submitButton.disabled = true;
    form.reset();
    toggleExtraServiceDetails();
    formFields.forEach(field => field.classList.remove('field-error'));

    setTimeout(() => {
      statusMessage.textContent = '';
      statusMessage.classList.remove('form-feedback');
      updateSubmitState();
    }, 5500);
  });

  toggleExtraServiceDetails();
  updateSubmitState();
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
