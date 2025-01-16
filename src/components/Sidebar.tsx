import React from 'react';
import { BarChart3, ShoppingCart, Receipt, List, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();
  
  const tabs = [
    { id: 'overview', icon: BarChart3, label: 'Análise Geral' },
    { id: 'products', icon: ShoppingCart, label: 'Análise por Produto' },
    { id: 'receipts', icon: Receipt, label: 'Recibos' },
    { id: 'shopping-list', icon: List, label: 'Lista de Mercado' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 h-screen w-64 fixed left-0 top-0 shadow-xl">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-2">MarketTracker</h1>
        <p className="text-blue-300 text-sm">Olá, {user?.email}</p>
      </div>
      <nav className="mt-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center px-6 py-4 text-left transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white border-r-4 border-orange-500'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;