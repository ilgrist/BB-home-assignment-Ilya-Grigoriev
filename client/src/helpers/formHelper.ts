export function validateText(value: string, minLength: number = 3): string | null {
  if (value.length < minLength) {
    return `Must be at least ${minLength} characters`;
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return null;
}