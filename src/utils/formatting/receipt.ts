import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ExpenseData } from '../../types';
import { formatCurrency } from './currency';

export const formatReceiptData = (data: ExpenseData[]): string => {
  if (!data.length) return 'Nenhum item encontrado no recibo.';

  const total = data.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const store = data[0]?.store;
  const date = data[0]?.purchaseDate;

  let output = `📍 ${store}\n📅 ${format(date, 'dd/MM/yyyy', { locale: ptBR })}\n\n`;
  
  output += data.map(item => 
    `${item.productName}\n` +
    `${item.quantity}x ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.unitPrice * item.quantity)}`
  ).join('\n\n');
  
  output += `\n\n💰 Total: ${formatCurrency(total)}`;
  
  return output;
};