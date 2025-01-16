import React from 'react';
import { ExpenseData } from '../../types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';

interface SpendingTrendCardProps {
  data: ExpenseData[];
}

const SpendingTrendCard: React.FC<SpendingTrendCardProps> = ({ data }) => {
  const calculateMonthlyTotal = (month: Date) => {
    return data
      .filter(item => 
        item.purchaseDate.getMonth() === month.getMonth() &&
        item.purchaseDate.getFullYear() === month.getFullYear()
      )
      .reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  const currentDate = new Date();
  const currentMonthTotal = calculateMonthlyTotal(currentDate);
  
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
  const lastMonthTotal = calculateMonthlyTotal(lastMonth);

  const percentageChange = lastMonthTotal ? 
    ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Tendência de Gastos</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">Este mês</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(currentMonthTotal)}
          </p>
        </div>
        <div className={`flex items-center ${percentageChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
          {percentageChange >= 0 ? (
            <TrendingUp className="w-5 h-5 mr-1" />
          ) : (
            <TrendingDown className="w-5 h-5 mr-1" />
          )}
          <span className="font-medium">
            {Math.abs(percentageChange).toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-1">Mês anterior</p>
        <p className="text-xl font-semibold text-gray-700">
          {formatCurrency(lastMonthTotal)}
        </p>
      </div>
    </div>
  );
};

export default SpendingTrendCard;