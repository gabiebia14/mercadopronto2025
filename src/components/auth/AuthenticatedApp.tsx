import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import MobileNavigation from '../MobileNavigation';
import FilterBar from '../FilterBar';
import OverviewTab from '../overview/OverviewTab';
import ProductAnalysisTab from '../products/ProductAnalysisTab';
import ReceiptsTab from '../receipts/ReceiptsTab';
import ShoppingListTab from '../shopping/ShoppingListTab';
import { ExpenseData, FilterOptions } from '../../types';
import { fetchExpenseData } from '../../utils/data';
import { getAvailableMonths, filterDataByMonth } from '../../utils/date';
import { Smartphone, Monitor } from 'lucide-react';
import UserProfile from './UserProfile';

function AuthenticatedApp() {
  const [activeTab, setActiveTab] = useState('overview');
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    month: '',
    store: '',
    product: '',
  });

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchExpenseData();
        setExpenseData(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erro ao carregar dados');
        console.error('Failed to load expense data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredData = expenseData
    .filter(item => {
      const matchesStore = !filters.store || item.store === filters.store;
      const matchesProduct = !filters.product || item.productName === filters.product;
      return matchesStore && matchesProduct;
    });

  const monthFilteredData = filterDataByMonth(filteredData, filters.month);
  const stores = [...new Set(expenseData.map(item => item.store))].sort();
  const products = [...new Set(expenseData.map(item => item.productName))].sort();
  const availableMonths = getAvailableMonths(expenseData);

  const handleDataUpdate = (newData: ExpenseData[]) => {
    setExpenseData(prev => [...prev, ...newData]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-red-600 text-xl font-semibold mb-4">Erro</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const toggleLayout = () => {
    setIsMobileLayout(!isMobileLayout);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={monthFilteredData} isMobileLayout={isMobileLayout} />;
      case 'products':
        return (
          <ProductAnalysisTab data={monthFilteredData} selectedProduct={filters.product} />
        );
      case 'receipts':
        return <ReceiptsTab onDataUpdate={handleDataUpdate} />;
      case 'shopping-list':
        return <ShoppingListTab data={monthFilteredData} />;
      case 'profile':
        return <UserProfile />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!isMobileLayout && <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />}
      <div className={isMobileLayout ? 'mobile-layout' : 'ml-64'}>
        <div className="p-4 md:p-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleLayout}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isMobileLayout ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              {isMobileLayout ? 'Versão Desktop' : 'Versão Mobile'}
            </button>
          </div>
          {activeTab !== 'receipts' && activeTab !== 'profile' && (
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              stores={stores}
              months={availableMonths}
            />
          )}
          {renderActiveTab()}
        </div>
      </div>
      {isMobileLayout && <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />}
    </div>
  );
}

export default AuthenticatedApp;