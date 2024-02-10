export const currencyFormat = (number: number) => {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'crc',
    maximumFractionDigits: 0
  }).format(number)
}
