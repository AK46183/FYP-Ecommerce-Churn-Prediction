const EMAIL_RE = /^\S+@\S+\.\S+$/;

const registerValidation = (data = {}) => {
  const errors = [];
  if (!data.name || !String(data.name).trim()) errors.push('Name is required');
  if (!data.email) errors.push('Email is required');
  else if (!EMAIL_RE.test(data.email)) errors.push('Enter a valid email address');
  if (!data.password || data.password.length < 6) errors.push('Password must be at least 6 characters');
  return errors;
};

const loginValidation = (data = {}) => {
  const errors = [];
  if (!data.email) errors.push('Email is required');
  if (!data.password) errors.push('Password is required');
  return errors;
};

module.exports = { registerValidation, loginValidation, EMAIL_RE };
