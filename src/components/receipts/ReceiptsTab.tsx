import React, { useState, useEffect } from 'react';
import { ExpenseData, ReceiptData } from '../../types';
import ReceiptUploader from './ReceiptUploader';
import { processReceipt } from '../../utils/ocr';
import ReceiptsList from './ReceiptsList';
import { supabaseService } from '../../services/supabase';
import { parseISO } from 'date-fns';

interface ReceiptsTabProps {
  onDataUpdate: (newData: ExpenseData[]) => void;
}

const ReceiptsTab: React.FC<ReceiptsTabProps> = ({ onDataUpdate }) => {
  const [allReceipts, setAllReceipts] = useState<ReceiptData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseService.getReceipts();
      
      if (error) throw error;
      
      if (data) {
        const receipts: ReceiptData[] = data.map(receipt => ({
          id: receipt.id,
          date: parseISO(receipt.data_compra),
          store: receipt.mercado,
          items: receipt.items as ExpenseData[],
          total: receipt.total
        }));
        setAllReceipts(receipts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar recibos');
      console.error('Error loading receipts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      const items = await processReceipt(file);
      await loadReceipts(); // Reload all receipts
      onDataUpdate(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar recibo');
      console.error('Error processing receipt:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReceiptUpdate = async (receiptId: string, items: ExpenseData[]) => {
    try {
      const total = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      await supabaseService.updateReceipt(receiptId, { items, total });
      await loadReceipts(); // Reload to get updated data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar recibo');
      console.error('Error updating receipt:', err);
    }
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={loadReceipts}
            className="mt-2 text-red-600 hover:text-red-800 font-medium"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Enviar Novo Recibo</h2>
            <ReceiptUploader onUpload={handleUpload} />
            {isProcessing && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Processando recibo...</p>
              </div>
            )}
          </div>
          
          {/* Receipts History Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Histórico de Recibos</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Carregando recibos...</p>
              </div>
            ) : allReceipts.length > 0 ? (
              <ReceiptsList 
                receipts={allReceipts} 
                onReceiptUpdate={handleReceiptUpdate}
              />
            ) : (
              <p className="text-center text-gray-500 py-8">
                Nenhum recibo processado ainda
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptsTab;