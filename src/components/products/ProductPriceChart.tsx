import React from 'react';
import { ExpenseData } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '../../utils/formatting';

interface ProductPriceChartProps {
  data: ExpenseData[];
}

const ProductPriceChart: React.FC<ProductPriceChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => a.purchaseDate.getTime() - b.purchaseDate.getTime());

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Variação de Preço</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="purchaseDate"
              tickFormatter={(date) => format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })}
            />
            <YAxis
              domain={['dataMin - 1', 'dataMax + 1']}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })}
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === 'unitPrice' ? 'Preço' : name
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="unitPrice"
              name="Preço"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductPriceChart;