export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidSouthAfricanPhone = (value: string): boolean => {
  const normalized = value.replace(/[\s()-]/g, '').replace(/^\+27/, '0');
  return /^0[1-9]\d{8}$/.test(normalized);
};

export const isValidName = (value: string): boolean =>
  value.trim().length >= 2 && value.trim().length <= 100;
