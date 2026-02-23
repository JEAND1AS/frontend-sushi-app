import type { Category, Product } from "../types";

// Usar variável de ambiente com fallback seguro
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const REQUEST_TIMEOUT = 10000; // 10 segundos

// Função auxiliar para fazer requisições com timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Função auxiliar para validar dados de produto
function isValidProduct(data: any): data is Product {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'number' &&
    typeof data.name === 'string' &&
    typeof data.description === 'string' &&
    typeof data.price === 'number' &&
    typeof data.image === 'string' &&
    typeof data.category === 'string' &&
    typeof data.featured === 'boolean' &&
    typeof data.available === 'boolean'
  );
}

// Função auxiliar para sanitizar e validar array de produtos
function validateProducts(data: any): Product[] {
  if (!Array.isArray(data)) {
    throw new Error('Dados inválidos: esperado um array de produtos');
  }

  return data.filter(isValidProduct);
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return validateProducts(data);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

export async function getProductsByCategory(category: Category): Promise<Product[]> {
  try {
    // Sanitizar parâmetro de categoria
    const encodedCategory = encodeURIComponent(category);
    const response = await fetchWithTimeout(`${API_BASE_URL}/products?category=${encodedCategory}`);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return validateProducts(data);
  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/products/featured`);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return validateProducts(data);
  } catch (error) {
    console.error('Erro ao buscar produtos em destaque:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    // Sanitizar ID para prevenir injection
    const sanitizedId = encodeURIComponent(id.trim());
    
    if (!sanitizedId) {
      throw new Error('ID inválido');
    }
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/products/${sanitizedId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (isValidProduct(data)) {
      return data;
    }
    
    throw new Error('Dados do produto inválidos');
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error);
    return undefined;
  }
}