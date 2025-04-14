'use client';

import React from 'react';
import { Product } from '@/src/lib/api/products';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48 mb-4">
        <Image
          src={product.image_url || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
      <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
      <div className="flex flex-col">
        <span className="text-xl font-bold mb-2">${product.price.toFixed(2)}</span>
        <AddToCartButton productId={product.id} />
      </div>
    </div>
  );
};

export default ProductCard; 