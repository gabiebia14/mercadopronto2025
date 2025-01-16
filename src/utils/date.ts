import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ExpenseData } from '../types';

export const getAvailableMonths = (data: ExpenseData[]) => {
  const months = new Set<string>();
  
  data.forEach(item => {
    const monthKey = format(item.purchaseDate, 'yyyy-MM');
    const monthLabel = format(item.purchaseDate, 'MMMM/yyyy', { locale: ptBR });
    months.add(`${monthKey}|${monthLabel}`);
  });

  return Array.from(months)
    .map(month => {
      const [key, label] = month.split('|');
      return { value: key, label };
    })
    .sort((a, b) => b.value.localeCompare(a.value)); // Sort by date descending
};

export const filterDataByMonth = (data: ExpenseData[], monthKey: string | null) => {
  if (!monthKey) return data;
  
  const [year, month] = monthKey.split('-').map(Number);
  
  return data.filter(item => 
    item.purchaseDate.getFullYear() === year &&
    item.purchaseDate.getMonth() === month - 1
  );
};