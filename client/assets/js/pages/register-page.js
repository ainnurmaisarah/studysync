import {
  validateEmail,
  validateFullName,
  validateNewPassword,
  validatePasswordMatch,
} from '../utils/validation.js';
import {
  clearErrorsOnInput,
  clearFormAlert,
  showFormAlert,
  validateFields,
} from '../utils/form-helpers.js';

const form = document.getElementById('register-form');
const alertBox = document.getElementById('form-alert');
const nameInput = form.elements.fullName;
const emailInput = form.elements.email;
const passwordInput = form.elements.password;
const confirmInput = form.elements.confirmPassword;

clearErrorsOnInput([nameInput, emailInput, passwordInput, confirmInput]);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearFormAlert(alertBox);

  const isValid = validateFields([
    { input: nameInput, check: () => validateFullName(nameInput.value) },
    { input: emailInput, check: () => validateEmail(emailInput.value) },
    { input: passwordInput, check: () => validateNewPassword(passwordInput.value) },
    {
      input: confirmInput,
      check: () => validatePasswordMatch(passwordInput.value, confirmInput.value),
    },
  ]);
  if (!isValid) return;

  // The registration API does not exist yet. Phase 4 replaces this message with a real request.
  showFormAlert(
    alertBox,
    'info',
    'Your details look valid, but account creation is not connected to the server yet. It will work once the backend is built in Phase 4.'
  );
});