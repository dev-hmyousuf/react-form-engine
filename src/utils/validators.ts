export const validators = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  email_strict: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  url: /^https?:\/\/.+/,
  phone: /^\+?[\d\s-()]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^\d+$/,
  alpha: /^[a-zA-Z]+$/,
};

export const getValidatorRegex = (pattern: string | RegExp): RegExp => {
  if (pattern instanceof RegExp) return pattern;
  return validators[pattern as keyof typeof validators] || new RegExp(pattern);
};

export const validateRequired = (value: any): boolean => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return value != null && value !== '';
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validatePattern = (value: string, pattern: string | RegExp): boolean => {
  const regex = getValidatorRegex(pattern);
  return regex.test(value);
};

export const validateAcceptedDomains = (email: string, domains: string[]): boolean => {
  const domain = email.split('@')[1];
  return domains.includes(domain);
};

export const validateMatchField = (value: any, matchValue: any): boolean => {
  return value === matchValue;
};

export const validatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  const score = [hasLower, hasUpper, hasNumber, hasSpecial, isLongEnough].filter(Boolean).length;

  if (score <= 2) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
};