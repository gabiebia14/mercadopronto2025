import React, { useState } from 'react';
import { ExpenseData } from '../../types';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface EditReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExpenseData[]) => void;
  initialData: ExpenseData[];
}

const EditReceiptDialog: React.FC<EditReceiptDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [items, setItems] = useState<ExpenseData[]>(initialData);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const newItem: ExpenseData = {
      productName: '',
      quantity: 1,
      unitPrice: 0,
      purchaseDate: items[0]?.purchaseDate || new Date(),
      store: items[0]?.store || '',
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof ExpenseData, value: any) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'quantity' || field === 'unitPrice' ? parseFloat(value) || 0 : value,
    };
    setItems(newItems);
  };

  const handleSave = () => {
    try {
      // Validate data
      if (items.length === 0) {
        throw new Error('Adicione pelo menos um item');
      }

      for (const item of items) {
        if (!item.productName.trim()) {
          throw new Error('Preencha o nome de todos os produtos');
        }
        if (item.quantity <= 0) {
          throw new Error('A quantidade deve ser maior que zero');
        }
        if (item.unitPrice <= 0) {
          throw new Error('O preço deve ser maior que zero');
        }
      }

      onSave(items);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar dados');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Editar Recibo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-auto">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 mb-2">
              <div className="col-span-4">Produto</div>
              <div className="col-span-2">Quantidade</div>
              <div className="col-span-2">Preço Unit.</div>
              <div className="col-span-3">Total</div>
              <div className="col-span-1"></div>
            </div>

            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4">
                <input
                  type="text"
                  value={item.productName}
                  onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                  className="col-span-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nome do produto"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  min="0"
                  step="0.01"
                  className="col-span-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  min="0"
                  step="0.01"
                  className="col-span-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="col-span-3 flex items-center text-gray-700">
                  R$ {(item.quantity * item.unitPrice).toFixed(2)}
                </div>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="col-span-1 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddItem}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Item
          </button>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReceiptDialog;