import React from 'react';
import { ExpenseData } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface ProductPriceStatsProps {
  data: ExpenseData[];
}

const ProductPriceStats: React.FC<ProductPriceStatsProps> = ({ data }) => {
  if (data.length === 0) return null;

  const sortedByPrice = [...data].sort((a, b) => a.unitPrice - b.unitPrice);
  const lowestPrice = sortedByPrice[0];
  const highestPrice = sortedByPrice[sortedByPrice.length - 1];
  
  const totalSpent = data.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
  
  const priceChange = ((highestPrice.unitPrice - lowestPrice.unitPrice) / lowestPrice.unitPrice) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
        <h3 className="text-sm font-medium text-green-800 mb-2">Menor Preço</h3>
        <p className="text-2xl font-bold text-green-900">{formatCurrency(lowestPrice.unitPrice)}</p>
        <div className="mt-2 text-sm text-green-700">
          <p>{format(lowestPrice.purchaseDate, 'dd/MM/yyyy', { locale: ptBR })}</p>
          <p>{lowestPrice.store}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
        <h3 className="text-sm font-medium text-red-800 mb-2">Maior Preço</h3>
        <p className="text-2xl font-bold text-red-900">{formatCurrency(highestPrice.unitPrice)}</p>
        <div className="mt-2 text-sm text-red-700">
          <p>{format(highestPrice.purchaseDate, 'dd/MM/yyyy', { locale: ptBR })}</p>
          <p>{highestPrice.store}</p>
        </div>
        <div className="mt-2 flex items-center text-sm">
          {priceChange > 0 ? (
            <TrendingUp className="w-4 h-4 mr-1 text-red-600" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1 text-green-600" />
          )}
          <span className={priceChange > 0 ? 'text-red-600' : 'text-green-600'}>
            {Math.abs(priceChange).toFixed(1)}% de variação
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Total Gasto</h3>
        <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalSpent)}</p>
        <p className="mt-2 text-sm text-blue-700">
          Total de {totalQuantity} unidades compradas
        </p>
      </div>
    </div>
  );
};

export default ProductPriceStats;