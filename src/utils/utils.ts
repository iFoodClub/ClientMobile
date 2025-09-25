export function passwordsMatch(password: string, confirmPassword: string) {
  return password === confirmPassword;
}

export function emailIsValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
