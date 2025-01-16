import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ExpenseData } from '../../types';
import { formatCurrency } from '../../utils/formatting';

interface StoreExpensesPieChartProps {
  data: ExpenseData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StoreExpensesPieChart: React.FC<StoreExpensesPieChartProps> = ({ data }) => {
  const storeExpenses = data.reduce((acc, item) => {
    const total = item.unitPrice * item.quantity;
    if (!isNaN(total)) {
      acc[item.store] = (acc[item.store] || 0) + total;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(storeExpenses)
    .filter(([_, value]) => !isNaN(value) && value > 0)
    .map(([name, value]) => ({
      name,
      value,
    }));

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Gastos por Supermercado</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label={({ value }) => formatCurrency(value)}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StoreExpensesPieChart;