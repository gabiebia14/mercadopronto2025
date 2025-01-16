import { ExpenseData } from '../types';

export const calculateTotalExpenses = (data: ExpenseData[]): number => {
  return data.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
};

export const calculateAveragePrice = (data: ExpenseData[], productName: string): number => {
  const productData = data.filter(item => item.productName === productName);
  if (productData.length === 0) return 0;
  return productData.reduce((sum, item) => sum + item.unitPrice, 0) / productData.length;
};