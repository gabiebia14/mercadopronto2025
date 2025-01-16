import React from 'react';
import { FilterOptions, MonthOption } from '../types';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  stores: string[];
  months: MonthOption[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  stores,
  months,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mês
          </label>
          <select
            className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
            value={filters.month}
            onChange={(e) =>
              onFilterChange({ ...filters, month: e.target.value })
            }
          >
            <option value="">Todos os meses</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supermercado
          </label>
          <select
            className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
            value={filters.store}
            onChange={(e) =>
              onFilterChange({ ...filters, store: e.target.value })
            }
          >
            <option value="">Todos</option>
            {stores.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;