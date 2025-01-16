import React from 'react';
import { Home, BarChart2, Receipt, ShoppingBag, User } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', icon: Home, label: 'Home' },
    { id: 'products', icon: ShoppingBag, label: 'Produtos' },
    { id: 'receipts', icon: Receipt, label: 'Recibos' },
    { id: 'shopping-list', icon: BarChart2, label: 'Lista' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="nav-tabs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <Icon className="w-6 h-6" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNavigation;