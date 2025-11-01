// Função para remover tudo que não for dígito
const clean = (value: string) => {
  return value.replace(/\D/g, "");
};

/**
 * Aplica a máscara de CPF: 000.000.000-00
 */
export function cpfMask(value: string): string {
  return clean(value)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .slice(0, 14); // Limita o tamanho total
}

/**
 * Aplica a máscara de CNPJ: 00.000.000/0000-00
 */
export function cnpjMask(value: string): string {
  return clean(value)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
    .replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5")
    .slice(0, 18); // Limita o tamanho total
}

/**
 * Aplica a máscara de Data: DD/MM/AAAA
 */
export function dateMask(value: string): string {
  return clean(value)
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3")
    .slice(0, 10); // Limita o tamanho total
}

/**
 * Aplica a máscara de CEP: 12345-678
 */
export function cepMask(value: string): string {
  return clean(value)
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 9); // Limita o tamanho total
}

/**
 * Converte um valor numérico para formato de moeda brasileira: R$xx,xx
 */
export function numberToCurrency(value: number | string | undefined): string {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return "";
  }
  
  return `R$${numValue.toFixed(2).replace(".", ",")}`;
}

/**
 * Converte uma string formatada como moeda (R$xx,xx) para número
 */
export function currencyToNumber(value: string): number {
  if (!value) {
    return 0;
  }
  
  // Remove R$, espaços e converte vírgula para ponto
  const cleaned = value.replace(/R\$|\s/g, "").replace(",", ".");
  
  const numValue = parseFloat(cleaned);
  
  return isNaN(numValue) ? 0 : numValue;
}

/**
 * Aplica a máscara de moeda brasileira enquanto o usuário digita: R$xx,xx
 */
export function currencyMask(value: string): string {
  if (!value) {
    return "";
  }
  
  // Remove tudo exceto dígitos
  const digits = value.replace(/\D/g, "");
  
  if (digits === "") {
    return "";
  }
  
  // Converte para número e divide por 100 para ter centavos
  const numValue = parseInt(digits, 10) / 100;
  
  return `R$${numValue.toFixed(2).replace(".", ",")}`;
}