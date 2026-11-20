const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,189}\.[^\s@]{2,}$/;

// Naya password: 8+ characters, kam az kam ek harf aur ek number
const passwordProblem = (pw) => {
  if (typeof pw !== 'string' || pw.length < 8) return 'Password must be at least 8 characters';
  if (pw.length > 128) return 'Password is too long';
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return 'Password must contain at least one letter and one number';
  return null;
};

const registerValidation = (data = {}) => {
  const errors = [];
  if (typeof data.name !== 'string' || !data.name.trim()) errors.push('Name is required');
  else if (data.name.trim().length > 80) errors.push('Name is too long');
  if (!data.email) errors.push('Email is required');
  else if (typeof data.email !== 'string' || data.email.length > 254 || !EMAIL_RE.test(data.email)) errors.push('Enter a valid email address');
  const pw = passwordProblem(data.password);
  if (pw) errors.push(pw);
  return errors;
};

const loginValidation = (data = {}) => {
  const errors = [];
  if (typeof data.email !== 'string' || !data.email) errors.push('Email is required');
  if (typeof data.password !== 'string' || !data.password) errors.push('Password is required');
  else if (data.password.length > 128) errors.push('Invalid email or password');
  return errors;
};

module.exports = { registerValidation, loginValidation, passwordProblem, EMAIL_RE };
