import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { ExpenseData } from '../../types';
import { ProductCategory, categorizeProduct } from '../../utils/productCategories';
import { formatCurrency } from '../../utils/formatting';

interface CategoryMetrics {
  category: ProductCategory;
  quantity: number;
  averagePrice: number;
  purchaseFrequency: number;
}

interface CategoryRadarChartProps {
  data: ExpenseData[];
  period: string;
}

const CategoryRadarChart: React.FC<CategoryRadarChartProps> = ({ data, period }) => {
  const calculateCategoryMetrics = (): CategoryMetrics[] => {
    const categories = new Map<ProductCategory, {
      totalQuantity: number;
      totalPrice: number;
      uniqueDates: Set<string>;
      items: number;
    }>();

    data.forEach(item => {
      const category = categorizeProduct(item.productName);
      const dateKey = item.purchaseDate.toISOString().split('T')[0];
      
      if (!categories.has(category)) {
        categories.set(category, {
          totalQuantity: 0,
          totalPrice: 0,
          uniqueDates: new Set(),
          items: 0,
        });
      }

      const metrics = categories.get(category)!;
      metrics.totalQuantity += item.quantity;
      metrics.totalPrice += item.unitPrice;
      metrics.uniqueDates.add(dateKey);
      metrics.items += 1;
    });

    // Calculate total days in period for frequency
    const dates = data.map(item => item.purchaseDate.toISOString().split('T')[0]);
    const totalDays = dates.length > 0 
      ? (Math.max(...dates.map(d => new Date(d).getTime())) - 
         Math.min(...dates.map(d => new Date(d).getTime()))) / (1000 * 60 * 60 * 24) + 1
      : 1;

    return Array.from(categories.entries()).map(([category, metrics]) => ({
      category,
      quantity: metrics.totalQuantity,
      averagePrice: metrics.totalPrice / metrics.items,
      purchaseFrequency: (metrics.uniqueDates.size / totalDays) * 100,
    }));
  };

  const metrics = calculateCategoryMetrics();
  
  // Normalize values to 0-100 scale for better visualization
  const normalizedData = metrics.map(metric => {
    const maxQuantity = Math.max(...metrics.map(m => m.quantity));
    const maxPrice = Math.max(...metrics.map(m => m.averagePrice));
    
    return {
      category: metric.category,
      "Quantidade (%)": (metric.quantity / maxQuantity) * 100,
      "Preço Médio (%)": (metric.averagePrice / maxPrice) * 100,
      "Frequência (%)": metric.purchaseFrequency,
      // Original values for tooltip
      quantity: metric.quantity,
      averagePrice: metric.averagePrice,
    };
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Análise por Categoria {period && `- ${period}`}</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={normalizedData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Tooltip
              formatter={(value: number, name: string, props: any) => {
                if (name === "Quantidade (%)") {
                  return [props.payload.quantity, "Quantidade"];
                }
                if (name === "Preço Médio (%)") {
                  return [formatCurrency(props.payload.averagePrice), "Preço Médio"];
                }
                if (name === "Frequência (%)") {
                  return [`${value.toFixed(1)}%`, "Frequência de Compra"];
                }
                return [value, name];
              }}
            />
            <Radar
              name="Quantidade (%)"
              dataKey="Quantidade (%)"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Radar
              name="Preço Médio (%)"
              dataKey="Preço Médio (%)"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
            />
            <Radar
              name="Frequência (%)"
              dataKey="Frequência (%)"
              stroke="#ffc658"
              fill="#ffc658"
              fillOpacity={0.6}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryRadarChart;