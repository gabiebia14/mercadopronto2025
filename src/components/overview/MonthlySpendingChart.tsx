import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ExpenseData } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '../../utils/formatting';

interface MonthlySpendingChartProps {
  data: ExpenseData[];
}

const MonthlySpendingChart: React.FC<MonthlySpendingChartProps> = ({ data }) => {
  const monthlyData = data.reduce((acc, item) => {
    const monthKey = format(item.purchaseDate, 'yyyy-MM');
    const total = item.unitPrice * item.quantity;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: format(item.purchaseDate, 'MMM yyyy', { locale: ptBR }),
        total: 0,
      };
    }
    acc[monthKey].total += total;
    return acc;
  }, {} as Record<string, { month: string; total: number }>);

  const chartData = Object.values(monthlyData).sort((a, b) => 
    a.month.localeCompare(b.month)
  );

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value), 'Total']}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySpendingChart;