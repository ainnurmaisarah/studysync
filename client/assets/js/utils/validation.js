const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72; // bcrypt only uses the first 72 bytes

// Every validator returns an error message (string) or null when the value is valid.

export function validateFullName(value) {
  const name = value.trim();
  if (!name) return 'Please enter your full name.';
  if (name.length < 2) return 'Your name must be at least 2 characters.';
  if (name.length > 100) return 'Your name must be 100 characters or fewer.';
  return null;
}

export function validateEmail(value) {
  const email = value.trim();
  if (!email) return 'Please enter your email address.';
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return 'Please enter a valid email address.';
  }
  return null;
}

export function validateLoginPassword(value) {
  if (!value) return 'Please enter your password.';
  return null;
}

export function validateNewPassword(value) {
  if (!value) return 'Please choose a password.';
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Your password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (value.length > PASSWORD_MAX_LENGTH) {
    return `Your password must be ${PASSWORD_MAX_LENGTH} characters or fewer.`;
  }
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return 'Your password must include at least one letter and one number.';
  }
  return null;
}

export function validatePasswordMatch(password, confirmation) {
  if (!confirmation) return 'Please confirm your password.';
  if (password !== confirmation) return 'The passwords do not match.';
  return null;
}