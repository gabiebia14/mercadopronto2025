import React, { useState } from 'react';
import { ReceiptData } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Receipt, Pencil } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import EditReceiptDialog from './EditReceiptDialog';

interface ReceiptsListProps {
  receipts: ReceiptData[];
  onReceiptUpdate: (receiptId: string, items: ExpenseData[]) => Promise<void>;
}

const ReceiptsList: React.FC<ReceiptsListProps> = ({ receipts, onReceiptUpdate }) => {
  const [editingReceipt, setEditingReceipt] = useState<ReceiptData | null>(null);
  
  // Sort receipts by date (newest first)
  const sortedReceipts = [...receipts].sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  );

  const handleEdit = (receipt: ReceiptData) => {
    setEditingReceipt(receipt);
  };

  const handleSave = async (items: ExpenseData[]) => {
    if (editingReceipt?.id) {
      await onReceiptUpdate(editingReceipt.id, items);
      setEditingReceipt(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {sortedReceipts.map((receipt) => (
          <div
            key={receipt.id}
            className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Receipt className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {format(receipt.date, 'dd/MM/yyyy', { locale: ptBR })}
                    </h3>
                    <p className="text-sm text-gray-500">{receipt.store}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(receipt.total)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {receipt.items.length} {receipt.items.length === 1 ? 'item' : 'itens'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEdit(receipt)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Editar recibo"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingReceipt && (
        <EditReceiptDialog
          isOpen={true}
          onClose={() => setEditingReceipt(null)}
          onSave={handleSave}
          initialData={editingReceipt.items}
        />
      )}
    </>
  );
};

export default ReceiptsList;