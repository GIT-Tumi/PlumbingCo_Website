// Run initialization when the HTML document has been fully loaded.
// This keeps markup and behavior separate and prevents queries on missing nodes.
document.addEventListener('DOMContentLoaded', () => {
  // Highlight the current navigation link based on the URL
  highlightCurrentNavLink();

  // Make the Services section headings toggle their following lists
  setupServiceToggles();

  // Enable enhanced behaviour for the enquiries form (validation, feedback)
  setupEnquiryForm();

  // Add a small utility button that copies contact details to the clipboard
  setupContactCopyButton();

  // Add a floating Back-to-Top button for improved navigation on long pages
  addBackToTopButton();
});

function highlightCurrentNavLink() {
  const links = document.querySelectorAll('nav a');
  const locationFile = window.location.pathname.split('/').pop();
  // Compare each link's href to the current filename (treat root as index.html)
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
    // Add an affordance class and toggle the next <ul> on click. This
    // creates a simple accessible accordion-like behavior for services.
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
    // Enable the submit button only when the native HTML validation passes
    submitButton.disabled = !form.checkValidity();
    // Clear any status message once the form becomes valid
    if (statusMessage.textContent && form.checkValidity()) {
      statusMessage.textContent = '';
    }
  }

  function validateField(field) {
    // Apply a visual error class when the field is invalid.
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
      // Inform the user about missing/invalid fields; the browser will
      // also show individual validation hints if supported.
      statusMessage.textContent = 'Please complete all required fields before submitting your enquiry.';
      return;
    }

    const name = form.querySelector('#name').value.trim();
    const serviceType = serviceSelect.options[serviceSelect.selectedIndex].text;
    // Show a simple client-side confirmation message. (No network call.)
    statusMessage.textContent = `Thank you, ${name || 'customer'}! Your enquiry about ${serviceType} has been received.`;
    statusMessage.classList.add('form-feedback');
    // Temporarily disable the submit button while showing the message
    submitButton.disabled = true;
    form.reset();
    toggleExtraServiceDetails();
    formFields.forEach(field => field.classList.remove('field-error'));

    // Clear the success message after a short delay and re-enable submit
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
      // Notify the user that the clipboard write succeeded
      showInlineMessage(contactSection, 'Contact details copied to clipboard!');
    } catch (error) {
      // If clipboard API fails (e.g., unsupported), provide a fallback message
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
