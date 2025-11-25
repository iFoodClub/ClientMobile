import { OrderStatus } from "../interfaces/apiResponses";

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

export function formatPriceToNumber(price: number): number {
  const fixedPrice = price.toString().replace(",", ".");
  return Number(fixedPrice);
}

export function getOrderBadgeByStatus(status: OrderStatus) {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-green-100";
    case OrderStatus.CONFIRMED:
      return "bg-yellow-100";
    case OrderStatus.PREPARING:
      return "bg-blue-100";
    case OrderStatus.DELIVERED:
      return "bg-green-100";
    case OrderStatus.CANCELED:
      return "bg-red-100";
  }
}
