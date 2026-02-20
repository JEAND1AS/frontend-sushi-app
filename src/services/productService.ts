import type { Category, Product } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`);
  return response.json();
  // return Promise.resolve(mockProducts);
}

export async function getProductsByCategory(category: Category): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products?category=${category}`);
  return response.json();
  // return Promise.resolve(mockProducts.filter((p) => p.category === category));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products/featured`);
  return response.json();
  // return Promise.resolve(mockProducts.filter((p) => p.featured));
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  return response.json();
  // return Promise.resolve(mockProducts.find((p) => p.id === id));
}