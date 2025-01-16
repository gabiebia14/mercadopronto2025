import React, { useState } from 'react';
import { ExpenseData } from '../../types';
import { Share2, Trash2, Copy, Check } from 'lucide-react';

interface ShoppingListTabProps {
  data: ExpenseData[];
}

interface ShoppingItem {
  product: string;
  quantity: number;
}

const ShoppingListTab: React.FC<ShoppingListTabProps> = ({ data }) => {
  const [selectedItems, setSelectedItems] = useState<ShoppingItem[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const uniqueProducts = Array.from(new Set(data.map(item => item.productName))).sort();

  const handleCheckboxChange = (product: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, { product, quantity: 1 }]);
    } else {
      setSelectedItems(prev => prev.filter(item => item.product !== product));
    }
  };

  const handleQuantityChange = (product: string, quantity: number) => {
    setSelectedItems(prev =>
      prev.map(item =>
        item.product === product ? { ...item, quantity } : item
      )
    );
  };

  const getShoppingList = () => {
    return selectedItems
      .map(item => `${item.quantity}x ${item.product}`)
      .join('\n');
  };

  const copyToClipboard = async () => {
    const list = getShoppingList();
    try {
      await navigator.clipboard.writeText(list);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    const list = getShoppingList();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Lista de Compras',
          text: list,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          // If sharing fails (except for user cancellation), fall back to clipboard
          await copyToClipboard();
        }
      }
    } else {
      // If Web Share API is not available, use clipboard
      await copyToClipboard();
    }
  };

  const removeItem = (product: string) => {
    setSelectedItems(prev => prev.filter(item => item.product !== product));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Product Selection Panel */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">Selecione os Produtos</h2>
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {uniqueProducts.map(product => {
            const isSelected = selectedItems.some(item => item.product === product);
            return (
              <div key={product} className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => handleCheckboxChange(product, e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="flex-grow font-medium">{product}</span>
                {isSelected && (
                  <input
                    type="number"
                    min="1"
                    value={selectedItems.find(item => item.product === product)?.quantity || 1}
                    onChange={(e) => handleQuantityChange(product, parseInt(e.target.value) || 1)}
                    className="w-20 rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Shopping List Panel */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Lista de Compras</h2>
          {selectedItems.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                title="Copiar para área de transferência"
              >
                {copySuccess ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </button>
            </div>
          )}
        </div>
        
        {selectedItems.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Selecione produtos para criar sua lista
          </p>
        ) : (
          <div className="space-y-3">
            {selectedItems.map(item => (
              <div
                key={item.product}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <span className="font-medium">{item.quantity}x</span>
                  <span className="ml-2">{item.product}</span>
                </div>
                <button
                  onClick={() => removeItem(item.product)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingListTab;