export interface ExpenseData {
  productName: string;
  unitPrice: number;
  quantity: number;
  purchaseDate: Date;
  store: string;
}

export interface ReceiptData {
  id?: string;
  date: Date;
  store: string;
  items: ExpenseData[];
  total: number;
}

export interface FilterOptions {
  month: string;
  store: string;
  product: string;
  productType?: string;
}

export interface MonthOption {
  value: string;
  label: string;
}