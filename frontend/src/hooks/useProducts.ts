// hooks/useProducts.ts
import { useState, useEffect } from 'react';
import type { Product } from '../types/Product';

// Varsayılan ürünler
const defaultProducts: Product[] = [
  { id: '1', name: 'Kola', price: 20 },
  { id: '2', name: 'Cips', price: 25 },
  { id: '3', name: 'Çay', price: 10 },
  { id: '4', name: 'Kahve', price: 15 },
  { id: '5', name: 'Su', price: 5 },
  { id: '6', name: 'Salam', price: 22 },
];

const STORAGE_KEY = 'cafe-products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultProducts;
    } catch {
      return defaultProducts;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => 
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  };

  const removeProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  return {
    products,
    addProduct,
    updateProduct,
    removeProduct,
    getProductById,
  };
}