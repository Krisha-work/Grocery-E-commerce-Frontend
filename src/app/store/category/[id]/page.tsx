'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { fetchCategoryProducts } from '@/src/lib/servicers/categoryService';
import Image from 'next/image';
import Link from 'next/link';
import { addToCart } from '@/src/lib/servicers/cartService';
import { AddToCartButton } from '@/src/components/products/AddToCartButton';
interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface CategoryResponse {
  data: Product[];
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  image_url?: string;
}

const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = (await fetchCategoryProducts(resolvedParams.id)) as unknown as CategoryResponse;
        
        // Ensure products is always an array
        const productsArray = Array.isArray(response.data) 
          ? response.data 
          : [];
        console.log(productsArray, "------------");
        setProducts(productsArray);
        setCategoryName(response.name || 'Category');
        setError(null);
      } catch (err) {
        setError('Failed to load category products');
        console.error('Error fetching category products:', err);
        setProducts([]); // Ensure products is an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Ensure products is an array before mapping
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="container text-black mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>

      {safeProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {safeProducts.map((product: Product, index: number) => {
            console.log(product, "------------");
            return (

              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden p-5 text-black">
                <div className='w-full h-48 bg-gray-300 object-cover rounded-t-lg'>
                <img
                  src={product.image_url || "/apples.jpeg"}
                  alt={product.name}
                  className="w-full h-48  object-cover rounded-t-lg"
                />
              </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                      ${typeof product.price === 'number' 
                        ? product.price.toFixed(2) 
                        : parseFloat(product.price as string).toFixed(2)}
                    </span>
                    <AddToCartButton product={product} />
                  </div>
                </div>
              </div>
            )
          }
          )}
        </div>
      )}
    </div>
  );
} 