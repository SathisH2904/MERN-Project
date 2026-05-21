const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return 'Email is required';
  if (!EMAIL_REGEX.test(email.trim())) return 'Email must be a valid format';
  return null;
}

export function validateName(name) {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return 'Name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  return null;
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

export function validateTaskTitle(title) {
  if (!title || typeof title !== 'string' || !title.trim()) {
    return 'Task title is required';
  }
  return null;
}
