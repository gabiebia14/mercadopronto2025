import { ExpenseData } from '../types';
import { supabaseService } from '../services/supabase';
import { format, parseISO } from 'date-fns';

export const fetchExpenseData = async (): Promise<ExpenseData[]> => {
  try {
    const { data, error } = await supabaseService.getReceipts();
    
    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Convert Supabase data to ExpenseData format
    const validData = data.map(item => ({
      productName: item.nome_produto,
      unitPrice: Number(item.preco_unitario),
      quantity: Number(item.quantidade),
      purchaseDate: parseISO(item.data_compra),
      store: item.mercado
    }));

    return validData;
  } catch (error) {
    console.error('Error fetching expense data:', error);
    throw new Error('Falha ao carregar dados. Por favor, tente novamente mais tarde.');
  }
};