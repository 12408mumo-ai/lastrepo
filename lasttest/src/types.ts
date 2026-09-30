export type Category = string;

export interface Product {
  id: string;
  title: string;
  category: Category;
  price: number;
  description: string;
  image_url: string;
  created_at?: string;
}

export interface OrderForm {
  fulfillment: 'Delivery' | 'Shop Pick Up';
  fullName: string;
  phone: string;
  location: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  'Orthopaedic Mattresses',
  'Beddings',
  'Households',
];
