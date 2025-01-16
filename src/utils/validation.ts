import { ExpenseData } from '../types';

export const validateReceiptData = (data: ExpenseData[]): string | null => {
  if (!Array.isArray(data) || data.length === 0) {
    return 'Nenhum item foi encontrado no recibo';
  }

  for (const item of data) {
    if (!item.productName?.trim()) {
      return 'Nome do produto inválido';
    }
    if (typeof item.unitPrice !== 'number' || item.unitPrice <= 0) {
      return 'Preço unitário inválido';
    }
    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      return 'Quantidade inválida';
    }
    if (!(item.purchaseDate instanceof Date) || isNaN(item.purchaseDate.getTime())) {
      return 'Data de compra inválida';
    }
    if (!item.store?.trim()) {
      return 'Nome do mercado inválido';
    }
  }

  return null;
};