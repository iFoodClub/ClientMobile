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

export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined || price === "") {
    return "R$ 0,00";
  }

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numericPrice)) {
    return "R$ --,--";
  }

  const fixedPrice = numericPrice.toFixed(2);
  const priceWithComma = fixedPrice.replace(".", ",");

  return `R$ ${priceWithComma}`;
}
