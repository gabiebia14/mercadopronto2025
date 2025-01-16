import React from 'react';
import { ExpenseData } from '../../types';
import { Package } from 'lucide-react';

interface MostPurchasedProductsProps {
  data: ExpenseData[];
}

const MostPurchasedProducts: React.FC<MostPurchasedProductsProps> = ({ data }) => {
  const productPurchases = data.reduce((acc, item) => {
    const key = item.productName;
    if (!acc[key]) {
      acc[key] = {
        name: key,
        quantity: 0,
        totalPurchases: 0,
      };
    }
    acc[key].quantity += item.quantity;
    acc[key].totalPurchases += 1;
    return acc;
  }, {} as Record<string, { name: string; quantity: number; totalPurchases: number }>);

  const sortedProducts = Object.values(productPurchases)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Produtos Mais Comprados</h3>
      <div className="space-y-4">
        {sortedProducts.map((product, index) => (
          <div
            key={product.name}
            className="flex items-center p-3 bg-gray-50 rounded-xl"
          >
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center mr-4
              ${index === 0 ? 'bg-blue-100 text-blue-600' :
                index === 1 ? 'bg-orange-100 text-orange-600' :
                'bg-gray-100 text-gray-600'}
            `}>
              <Package className="w-5 h-5" />
            </div>
            <div className="flex-grow">
              <h4 className="font-medium text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-500">
                {product.quantity} unidades em {product.totalPurchases} compras
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostPurchasedProducts;