import React from 'react';
import { ExpenseData } from '../../types';
import MonthlySpendingChart from './MonthlySpendingChart';
import StoreExpensesPieChart from './StoreExpensesPieChart';
import HighlightCards from './HighlightCards';
import TopProducts from './TopProducts';

interface OverviewTabProps {
  data: ExpenseData[];
  isMobileLayout?: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ data, isMobileLayout = false }) => {
  return (
    <div className="space-y-6">
      <HighlightCards data={data} isMobileLayout={isMobileLayout} />

      {isMobileLayout ? (
        <>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Gastos Mensais</h3>
            <MonthlySpendingChart data={data} isMobileLayout={true} />
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Distribuição por Mercado</h3>
            <StoreExpensesPieChart data={data} isMobileLayout={true} />
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Gastos Mensais</h3>
            <MonthlySpendingChart data={data} />
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Distribuição por Mercado</h3>
            <StoreExpensesPieChart data={data} />
          </div>
        </div>
      )}

      <TopProducts data={data} isMobileLayout={isMobileLayout} />
    </div>
  );
};

export default OverviewTab;