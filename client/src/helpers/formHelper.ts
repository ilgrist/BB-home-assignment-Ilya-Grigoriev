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

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateFile(file: File): string | null {
  if (!file) return null;

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return 'Only PNG, JPG, and PDF files are allowed';
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'File size must not exceed 5MB';
  }

  return null;
}