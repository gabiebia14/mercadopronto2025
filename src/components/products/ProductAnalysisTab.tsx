import React from 'react';
import { ExpenseData } from '../../types';
import { categorizeProduct } from '../../utils/productCategories';
import ProductPriceStats from './ProductPriceStats';
import ProductPriceChart from './ProductPriceChart';
import ProductFilterBar from './ProductFilterBar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '../../utils/formatting';
import { getAvailableMonths } from '../../utils/date';

interface ProductAnalysisTabProps {
  data: ExpenseData[];
}

const ProductAnalysisTab: React.FC<ProductAnalysisTabProps> = ({ data }) => {
  const [filters, setFilters] = React.useState({
    month: '',
    store: '',
    product: '',
  });

  // Get unique stores and products
  const stores = [...new Set(data.map(item => item.store))].sort();
  const products = [...new Set(data.map(item => item.productName))].sort();
  const months = getAvailableMonths(data);

  // Filter data based on selections
  const filteredData = data.filter(item => {
    const matchesStore = !filters.store || item.store === filters.store;
    const matchesProduct = !filters.product || item.productName === filters.product;
    const matchesMonth = !filters.month || format(item.purchaseDate, 'yyyy-MM') === filters.month;
    return matchesStore && matchesProduct && matchesMonth;
  });

  const productCategory = filters.product ? categorizeProduct(filters.product) : null;

  return (
    <div className="space-y-6">
      <ProductFilterBar
        filters={filters}
        onFilterChange={setFilters}
        stores={stores}
        products={products}
        months={months}
      />

      {filters.product ? (
        <>
          {/* Product Header */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{filters.product}</h2>
                {productCategory && (
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {productCategory}
                  </span>
                )}
              </div>
            </div>

            {/* Price Statistics */}
            <ProductPriceStats data={filteredData} />
          </div>

          {/* Price Chart */}
          <ProductPriceChart data={filteredData} />

          {/* Purchase History Table */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Histórico de Compras</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">
                      Data
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mercado
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(item.purchaseDate, 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.store}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
          <div className="text-center text-gray-500">
            <p className="text-xl font-medium">Selecione um produto para ver sua análise</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAnalysisTab;