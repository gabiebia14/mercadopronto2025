import { ExpenseData } from '../types';
import { validateReceiptData } from './validation';

const parseDate = (dateStr: string): Date => {
  try {
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    if (isNaN(date.getTime())) {
      throw new Error(`Data inválida: ${dateStr}`);
    }
    
    return date;
  } catch (error) {
    throw new Error(`Erro ao processar data: ${dateStr}`);
  }
};

const parsePrice = (priceStr: string): number => {
  try {
    const price = parseFloat(priceStr.replace('R$', '').replace(',', '.').trim());
    
    if (isNaN(price) || price <= 0) {
      throw new Error(`Preço inválido: ${priceStr}`);
    }
    
    return price;
  } catch (error) {
    throw new Error(`Erro ao processar preço: ${priceStr}`);
  }
};

export const parseReceiptData = (tableText: string): ExpenseData[] => {
  try {
    const lines = tableText.split('\n').filter(line => line.trim());
    
    const headerRow = lines.findIndex(line => 
      line.toLowerCase().includes('a- nome do produto')
    );
    
    if (headerRow === -1) {
      throw new Error('Formato do recibo não reconhecido');
    }
    
    const dataRows = lines.slice(headerRow + 1);
    const parsedData = dataRows
      .filter(line => line.includes('|'))
      .map(line => {
        const [productName, unitPrice, quantity, date, total, store] = 
          line.split('|').map(cell => cell.trim());

        if (!productName || !unitPrice || !quantity || !date || !total || !store) {
          throw new Error('Linha do recibo com dados incompletos');
        }

        const parsedUnitPrice = parsePrice(unitPrice);
        const parsedQuantity = parseFloat(quantity);
        const parsedTotal = parsePrice(total);

        // Validate that total matches unit price * quantity
        const calculatedTotal = parsedUnitPrice * parsedQuantity;
        if (Math.abs(calculatedTotal - parsedTotal) > 0.01) {
          throw new Error(`Valor total inconsistente para o produto ${productName}`);
        }

        return {
          productName,
          unitPrice: parsedUnitPrice,
          quantity: parsedQuantity,
          purchaseDate: parseDate(date),
          store
        };
      });

    const validationError = validateReceiptData(parsedData);
    if (validationError) {
      throw new Error(validationError);
    }

    return parsedData;
  } catch (error) {
    throw error instanceof Error 
      ? error 
      : new Error('Erro ao processar dados do recibo');
  }
};