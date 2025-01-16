import React from 'react';
import { ExpenseData } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { Package } from 'lucide-react';

interface TopProductsProps {
  data: ExpenseData[];
}

const TopProducts: React.FC<TopProductsProps> = ({ data }) => {
  const productStats = data.reduce((acc, item) => {
    if (!acc[item.productName]) {
      acc[item.productName] = { quantity: 0, total: 0 };
    }
    acc[item.productName].quantity += item.quantity;
    acc[item.productName].total += item.unitPrice * item.quantity;
    return acc;
  }, {} as Record<string, { quantity: number; total: number; }>);

  const topProducts = Object.entries(productStats)
    .map(([product, stats]) => ({
      product,
      ...stats
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Top 5 Produtos Mais Comprados</h3>
      <div className="space-y-4">
        {topProducts.map((item, index) => (
          <div
            key={item.product}
            className="flex items-center p-4 bg-gray-50 rounded-xl"
          >
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center mr-4
              ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                index === 1 ? 'bg-gray-200 text-gray-600' :
                index === 2 ? 'bg-orange-100 text-orange-600' :
                'bg-blue-100 text-blue-600'}
            `}>
              <Package className="w-6 h-6" />
            </div>
            <div className="flex-grow">
              <h4 className="font-medium text-gray-900">{item.product}</h4>
              <p className="text-sm text-gray-500">
                {item.quantity} unidades • {formatCurrency(item.total)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">#{index + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;