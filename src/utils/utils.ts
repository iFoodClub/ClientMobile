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

export function formatPriceToNumber(price: number | string): number {
  if (typeof price === "number") return price;
  if (!price) return 0;
  const cleanPrice = price
    .replace(/[R$\s ]/g, "") // Remove R$, espaços e NBSP
    .replace(/\./g, "")      // Remove pontos de milhar
    .replace(",", ".");      // Troca vírgula decimal por ponto
  return Number(cleanPrice) || 0;
}

export function getOrderBadgeByStatus(status: OrderStatus) {
  switch (status) {
    case OrderStatus.PENDING:
      return {
        bg: "bg-green-500/20",
        border: "border-green-500",
        text: "text-green-700",
      };

    case OrderStatus.SENT:
      return {
        bg: "bg-yellow-500/20",
        border: "border-yellow-500",
        text: "text-yellow-700",
      };

    case OrderStatus.PREPARING:
      return {
        bg: "bg-blue-500/20",
        border: "border-blue-500",
        text: "text-blue-700",
      };

    case OrderStatus.DELIVERED:
      return {
        bg: "bg-green-500/20",
        border: "border-green-500",
        text: "text-green-700",
      };

    case OrderStatus.CANCELED:
      return {
        bg: "bg-red-500/20",
        border: "border-red-500",
        text: "text-red-700",
      };

    default:
      return {
        bg: "bg-gray-500/20",
        border: "border-gray-500",
        text: "text-gray-700",
      };
  }
}

export function translateWeekDay(day: string): string {
  const days: Record<string, string> = {
    Monday: "Segunda-feira",
    Tuesday: "Terça-feira",
    Wednesday: "Quarta-feira",
    Thursday: "Quinta-feira",
    Friday: "Sexta-feira",
    Saturday: "Sábado",
    Sunday: "Domingo",
  };

  return days[day] || day;
}
