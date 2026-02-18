export type Category =
  | 'Entradas'
  | 'Niguiris'
  | 'Makis'
  | 'Temakis'
  | 'Pratos Quentes'
  | 'Bebidas'
  | 'Sobremesas';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageHeight?: string;
  category: Category;
  available: boolean;
  featured?: boolean;
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
