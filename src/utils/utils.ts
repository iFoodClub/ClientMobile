export function passwordsMatch(password: string, confirmPassword: string) {
  return password === confirmPassword;
}

export function emailIsValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidCep(text: string): boolean {
  const digitsOnly = text.replace(/\D/g, "");
  return digitsOnly.length === 8;
}
