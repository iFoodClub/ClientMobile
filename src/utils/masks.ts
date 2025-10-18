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
