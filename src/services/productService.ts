/**
 * Camada de serviço para produtos.
 * Atualmente usa dados mockados locais.
 * Para integrar com backend, substitua as funções abaixo por chamadas de API.
 *
 * Exemplo de integração futura:
 *   const response = await fetch(`${API_BASE_URL}/products`);
 *   return response.json();
 */

import { products as mockProducts } from '../data/products';
import type { Category, Product } from '../types';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function getProducts(): Promise<Product[]> {
  // TODO (backend): return await fetch(`${API_BASE_URL}/products`).then(r => r.json());
  return Promise.resolve(mockProducts);
}

export async function getProductsByCategory(category: Category): Promise<Product[]> {
  // TODO (backend): return await fetch(`${API_BASE_URL}/products?category=${category}`).then(r => r.json());
  return Promise.resolve(mockProducts.filter((p) => p.category === category));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  // TODO (backend): return await fetch(`${API_BASE_URL}/products/featured`).then(r => r.json());
  return Promise.resolve(mockProducts.filter((p) => p.featured));
}

export async function getProductById(id: string): Promise<Product | undefined> {
  // TODO (backend): return await fetch(`${API_BASE_URL}/products/${id}`).then(r => r.json());
  return Promise.resolve(mockProducts.find((p) => p.id === id));
}
