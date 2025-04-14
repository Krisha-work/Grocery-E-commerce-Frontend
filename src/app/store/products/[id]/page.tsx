'use client';

import { getProductById } from '@/src/lib/servicers/productService';
import Image from 'next/image';
import { AddToCartButton } from '../../../../components/products/AddToCartButton';
import { useEffect, useState } from 'react';
import { Product } from '@/src/lib/api/products';
import { use } from 'react';

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const productData = await getProductById(resolvedParams.id);
        console.log(productData, "------------");
        setProduct(productData);
      } catch (err) {
        setError('Failed to load product');
        console.error('Error loading product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-8">
        <div className="text-red-500 text-center">{error || 'Product not found'}</div>
      </div>
    );
  }

  return (
    <div className="container py-8 mt-20 ml-20">
      <div className="grid md:grid-cols-2 gap-8 flex justify-center items-center">
        {/* Product Images */}
        <div className="bg-white w-150 h-150 p-4 rounded-lg shadow-md">
          <div className="rounded-lg m-3 bg-gray-400 relative aspect-square">
            <img
              src={product.image_url || "/apples.jpeg"}
              alt={product.name}
              className="rounded-lg"
            />
          </div>
        </div>
        
        {/* Product Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-green-600">
              ${product?.price|| '0.00'}
            </span>
            <span className="text-sm text-gray-500">
              In Stock: {product?.stock || 0}
            </span>
          </div>
          <div className="pt-4">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}