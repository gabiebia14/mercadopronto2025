import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ExpenseData } from '../../types';
import { formatCurrency } from '../../utils/formatting';

interface ExpenseChartProps {
  data: ExpenseData[];
  title: string;
  dataKey: string;
  color: string;
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ data, title, dataKey, color }) => {
  // Filter out any invalid data points
  const validData = data.filter(item => 
    typeof item[dataKey] === 'number' && !isNaN(item[dataKey])
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={validData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="productName" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => 
                dataKey === 'quantity' 
                  ? Math.round(value).toString()
                  : formatCurrency(value)
              }
            />
            <Legend />
            <Bar dataKey={dataKey} fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;