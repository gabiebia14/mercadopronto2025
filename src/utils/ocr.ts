import { ExpenseData } from '../types';
import { processImageWithGemini } from './gemini';
import { supabaseService } from '../services/supabase';

export const processReceipt = async (file: File): Promise<ExpenseData[]> => {
  try {
    const items = await processImageWithGemini(file);
    
    if (items.length === 0) {
      throw new Error('Nenhum item encontrado no recibo');
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    // Create a single receipt entry with all items
    await supabaseService.createReceipt({
      items,
      date: items[0].purchaseDate,
      store: items[0].store,
      total
    });

    return items;
  } catch (error) {
    console.error('Receipt processing error:', error);
    throw error;
  }
};