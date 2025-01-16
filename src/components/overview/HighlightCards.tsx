import React from 'react';
import { ExpenseData } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { Package, TrendingUp, Wallet } from 'lucide-react';

interface HighlightCardsProps {
  data: ExpenseData[];
  isMobileLayout?: boolean;
}

const HighlightCards: React.FC<HighlightCardsProps> = ({ data, isMobileLayout = false }) => {
  // Calculate highest expense
  const highestExpense = data.reduce((max, item) => {
    const total = item.unitPrice * item.quantity;
    return total > max.total 
      ? { total, product: item.productName, store: item.store }
      : max;
  }, { total: 0, product: '', store: '' });

  // Calculate most purchased product
  const productQuantities = data.reduce((acc, item) => {
    if (!acc[item.productName]) {
      acc[item.productName] = { quantity: 0, total: 0 };
    }
    acc[item.productName].quantity += item.quantity;
    acc[item.productName].total += item.unitPrice * item.quantity;
    return acc;
  }, {} as Record<string, { quantity: number; total: number; }>);

  const mostPurchased = Object.entries(productQuantities)
    .reduce((max, [product, data]) => 
      data.quantity > max.quantity 
        ? { product, quantity: data.quantity, total: data.total }
        : max
    , { product: '', quantity: 0, total: 0 });

  // Calculate total expenses
  const totalExpenses = data.reduce((sum, item) => 
    sum + (item.unitPrice * item.quantity), 0);

  const containerClass = isMobileLayout
    ? "space-y-4"
    : "grid grid-cols-1 md:grid-cols-3 gap-6";

  const cardClass = isMobileLayout
    ? "p-6 rounded-xl shadow-md"
    : "p-8 rounded-2xl shadow-lg";

  return (
    <div className={containerClass}>
      <div className={`bg-gradient-to-br from-red-500 to-red-600 text-white ${cardClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-red-100">Maior Gasto</h3>
          <TrendingUp className="w-6 h-6 text-red-100" />
        </div>
        <p className="text-3xl font-bold mb-2">{formatCurrency(highestExpense.total)}</p>
        <p className="text-sm text-red-100">{highestExpense.product}</p>
        <p className="text-sm text-red-100">{highestExpense.store}</p>
      </div>

      <div className={`bg-gradient-to-br from-blue-600 to-blue-700 text-white ${cardClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-blue-100">Produto Mais Comprado</h3>
          <Package className="w-6 h-6 text-blue-100" />
        </div>
        <p className="text-3xl font-bold mb-2">{mostPurchased.quantity} unidades</p>
        <p className="text-sm text-blue-100">{mostPurchased.product}</p>
        <p className="text-sm text-blue-100">Total: {formatCurrency(mostPurchased.total)}</p>
      </div>

      <div className={`bg-gradient-to-br from-green-500 to-green-600 text-white ${cardClass}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-green-100">Total de Gastos</h3>
          <Wallet className="w-6 h-6 text-green-100" />
        </div>
        <p className="text-3xl font-bold mb-2">{formatCurrency(totalExpenses)}</p>
        <p className="text-sm text-green-100">{data.length} compras registradas</p>
      </div>
    </div>
  );
};

export default HighlightCards;