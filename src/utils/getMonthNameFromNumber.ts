export const getMonthName = (monthNumber: number) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('es-CR', { month: 'long' });
  }