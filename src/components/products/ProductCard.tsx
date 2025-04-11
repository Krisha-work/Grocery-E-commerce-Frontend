'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  return (
    <div className="group relative rounded-lg border border-gray-200 bg-blue-100 shadow-sm transition-all hover:shadow-md">
      <Link href={`/products/${id}`}>
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={image}
            alt={name}
            width={300}
            height={300}
            className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-900">{name}</h3>
          <p className="mt-1 text-sm text-gray-500">{category}</p>
          <p className="mt-2 font-semibold text-gray-900">${price.toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
} 