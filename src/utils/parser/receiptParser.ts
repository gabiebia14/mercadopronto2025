import { ExpenseData } from '../../types';
import { validateReceiptData } from './validation';

const parseDate = (dateStr: string): Date => {
  try {
    // Support multiple date formats
    const formats = [
      /(\d{2})\/(\d{2})\/(\d{4})/,  // DD/MM/YYYY
      /(\d{2})-(\d{2})-(\d{4})/,    // DD-MM-YYYY
      /(\d{4})\/(\d{2})\/(\d{2})/   // YYYY/MM/DD
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        const [_, d1, d2, d3] = match;
        // Assume first format (most common in Brazil)
        const date = new Date(parseInt(d3), parseInt(d2) - 1, parseInt(d1));
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }
    throw new Error(`Data inválida: ${dateStr}`);
  } catch (error) {
    throw new Error(`Erro ao processar data: ${dateStr}`);
  }
};

const parsePrice = (priceStr: string): number => {
  try {
    // Remove currency symbols and spaces
    const cleaned = priceStr.replace(/[R$\s]/g, '');
    // Support both comma and dot as decimal separator
    const normalized = cleaned.replace(',', '.');
    const price = parseFloat(normalized);

    if (isNaN(price) || price < 0) {
      throw new Error(`Preço inválido: ${priceStr}`);
    }

    // Round to 2 decimal places
    return Math.round(price * 100) / 100;
  } catch (error) {
    throw new Error(`Erro ao processar preço: ${priceStr}`);
  }
};

const parseQuantity = (qtyStr: string): number => {
  try {
    // Support both comma and dot as decimal separator
    const normalized = qtyStr.replace(',', '.');
    const qty = parseFloat(normalized);

    if (isNaN(qty) || qty <= 0) {
      throw new Error(`Quantidade inválida: ${qtyStr}`);
    }

    // Round to 3 decimal places for weight
    return Math.round(qty * 1000) / 1000;
  } catch (error) {
    throw new Error(`Erro ao processar quantidade: ${qtyStr}`);
  }
};

const extractStoreAndDate = (lines: string[]): { store: string; date: Date } => {
  let store = '';
  let date: Date | null = null;

  // Common store name patterns
  const storePatterns = [
    /REDE SOL/i,
    /POTY/i,
    /MERCADO/i,
    /SUPERMERCADO/i,
    /ATACADO/i,
    /ATACADAO/i
  ];

  // Look for store name and date in first 10 lines
  for (let i = 0; i < Math.min(10, lines.length) && (!store || !date); i++) {
    const line = lines[i].trim();

    // Find store name
    if (!store) {
      for (const pattern of storePatterns) {
        if (pattern.test(line)) {
          store = line.split(/[-–:]/).shift()?.trim() || '';
          break;
        }
      }
    }

    // Find date
    if (!date && /\d{2}.\d{2}.\d{4}/.test(line)) {
      try {
        const dateMatch = line.match(/(\d{2}.\d{2}.\d{4})/);
        if (dateMatch) {
          date = parseDate(dateMatch[1]);
        }
      } catch (e) {
        // Continue searching if date parse fails
      }
    }
  }

  if (!store || !date) {
    throw new Error('Não foi possível encontrar o nome da loja ou data da compra');
  }

  return { store, date };
};

export const parseReceiptData = (text: string): ExpenseData[] => {
  try {
    // Split into lines and clean
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Extract store and date
    const { store, date } = extractStoreAndDate(lines);

    // Find product table section
    const tableStartIndex = lines.findIndex(line => 
      /PRODUTO|ITEM|DESCRIÇÃO/i.test(line) && 
      /(QTDE?|QUANT)/i.test(line) && 
      /PREÇO|VALOR/i.test(line)
    );

    if (tableStartIndex === -1) {
      throw new Error('Não foi possível encontrar a tabela de produtos');
    }

    const products: ExpenseData[] = [];
    let currentProduct: Partial<ExpenseData> = {};

    // Process product lines
    for (let i = tableStartIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines or total lines
      if (!line || /TOTAL|SUBTOTAL/i.test(line)) {
        continue;
      }

      // Try to extract product info
      if (line.includes('R$')) {
        const parts = line.split(/\s+/);
        
        // Find price positions (R$)
        const pricePositions = parts.reduce((acc, part, index) => {
          if (part.includes('R$')) acc.push(index);
          return acc;
        }, [] as number[]);

        if (pricePositions.length >= 2) {
          try {
            // Extract product name (everything before quantity)
            const qtyIndex = pricePositions[0] - 1;
            const productName = parts.slice(0, qtyIndex).join(' ');
            
            // Extract quantity and prices
            const quantity = parseQuantity(parts[qtyIndex]);
            const unitPrice = parsePrice(parts[pricePositions[0]]);

            // Validate total matches unit price * quantity
            const total = parsePrice(parts[pricePositions[1]]);
            const calculatedTotal = Math.round(unitPrice * quantity * 100) / 100;

            if (Math.abs(calculatedTotal - total) <= 0.01) {
              products.push({
                productName,
                unitPrice,
                quantity,
                purchaseDate: date,
                store
              });
            }
          } catch (e) {
            // Skip invalid lines
            continue;
          }
        }
      }
    }

    if (products.length === 0) {
      throw new Error('Nenhum produto foi encontrado no recibo');
    }

    // Validate all products
    const validationError = validateReceiptData(products);
    if (validationError) {
      throw new Error(validationError);
    }

    return products;
  } catch (error) {
    throw error instanceof Error 
      ? error 
      : new Error('Erro ao processar dados do recibo');
  }
};