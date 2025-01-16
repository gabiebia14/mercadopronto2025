import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { ExpenseData, ReceiptData } from '../types';
import { format } from 'date-fns';

type Tables = Database['public']['Tables'];
type Receipt = Tables['receipts']['Row'];

export const supabaseService = {
  async getReceipts() {
    const { data: session } = await supabase.auth.getSession();
    return await supabase
      .from('receipts')
      .select('*')
      .eq('user_id', session?.session?.user?.id)
      .order('data_compra', { ascending: false });
  },

  async createReceipt(data: {
    items: ExpenseData[];
    date: Date;
    store: string;
    total: number;
  }) {
    const { data: session } = await supabase.auth.getSession();
    return await supabase
      .from('receipts')
      .insert({
        data_compra: format(data.date, 'yyyy-MM-dd'),
        mercado: data.store,
        items: data.items,
        total: data.total,
        user_id: session?.session?.user?.id
      })
      .select()
      .single();
  },

  async updateReceipt(id: string, data: { items: ExpenseData[]; total: number }) {
    const { data: session } = await supabase.auth.getSession();
    return await supabase
      .from('receipts')
      .update({
        items: data.items,
        total: data.total
      })
      .eq('id', id)
      .eq('user_id', session?.session?.user?.id)
      .select()
      .single();
  },

  async getReceiptsByDateRange(startDate: string, endDate: string) {
    const { data: session } = await supabase.auth.getSession();
    return await supabase
      .from('receipts')
      .select('*')
      .eq('user_id', session?.session?.user?.id)
      .gte('data_compra', startDate)
      .lte('data_compra', endDate)
      .order('data_compra', { ascending: false });
  },

  async getReceiptsByStore(store: string) {
    const { data: session } = await supabase.auth.getSession();
    return await supabase
      .from('receipts')
      .select('*')
      .eq('user_id', session?.session?.user?.id)
      .ilike('mercado', `%${store}%`)
      .order('data_compra', { ascending: false });
  }
};