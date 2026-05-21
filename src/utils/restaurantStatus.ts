/**
 * Verifica se um restaurante está aberto no momento atual.
 * 
 * @param openingTime Horário de abertura no formato "HH:mm"
 * @param closingTime Horário de fechamento no formato "HH:mm"
 * @returns boolean true se estiver aberto, false caso contrário
 */
export const isRestaurantOpen = (openingTime?: string, closingTime?: string): boolean => {
  if (!openingTime || !closingTime) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [hStart, mStart] = openingTime.split(":").map(Number);
  const [hEnd, mEnd] = closingTime.split(":").map(Number);

  const startMinutes = hStart * 60 + mStart;
  const endMinutes = hEnd * 60 + mEnd;

  // Caso o restaurante feche no dia seguinte (ex: das 18:00 às 02:00)
  if (endMinutes < startMinutes) {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }

  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
};
