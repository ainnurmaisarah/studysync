import { validateEmail, validateLoginPassword } from '../utils/validation.js';
import {
  clearErrorsOnInput,
  clearFormAlert,
  showFormAlert,
  validateFields,
} from '../utils/form-helpers.js';

const form = document.getElementById('login-form');
const alertBox = document.getElementById('form-alert');
const emailInput = form.elements.email;
const passwordInput = form.elements.password;

clearErrorsOnInput([emailInput, passwordInput]);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearFormAlert(alertBox);

  const isValid = validateFields([
    { input: emailInput, check: () => validateEmail(emailInput.value) },
    { input: passwordInput, check: () => validateLoginPassword(passwordInput.value) },
  ]);
  if (!isValid) return;

  // The login API does not exist yet. Phase 4 replaces this message with a real request.
  showFormAlert(
    alertBox,
    'info',
    'Your details look valid, but logging in is not connected to the server yet. It will work once the backend is built in Phase 4.'
  );
});