export type Category =
  | 'Entradas'
  | 'Niguiris'
  | 'Makis'
  | 'Temakis'
  | 'Pratos Quentes'
  | 'Bebidas'
  | 'Sobremesas';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
