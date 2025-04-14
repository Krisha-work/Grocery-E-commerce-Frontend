'use client';

import { Product } from '@/src/lib/api/products';
import { fetchAllProducts, fetchFilteredProducts } from '@/src/lib/servicers/productService';
import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { AddToCartButton } from '@/src/components/products/AddToCartButton';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        if (searchQuery) {
          const result = await fetchFilteredProducts({ search: searchQuery });
          if (result && Array.isArray(result)) {
            setProducts(result);
          } else {
            setProducts([]);
          }
        } else {
          const response = await fetchAllProducts();
          if (response && 'products' in response && Array.isArray(response.products)) {
            setProducts(response.products);
          } else {
            setProducts([]);
          }
        }
        setError('');
      } catch (error) {
        setError('Error fetching products. Please try again later.');
        setProducts([]);
        console.error('Error fetching products:', error);
      }
    };

    loadProducts();
  }, [searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // console.log(products, "products");
  // console.log(products[0], "products only one product");

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <>

      <div className="container min-w-screen min-h-screen bg-[#F1EFEC] mx-auto px-20 py-5">
        <div className="container  bg-[#F1EFEC] mx-auto px-20 py-5 mt-20 flex justify-between items-center">
          <h1 className="text-4xl text-black font-bold mb-4">Our Products</h1>
          <div className='text-black relative'>
            <input
              type="text"
              placeholder="Search"
              className="border-2 w-100 border-gray-300 rounded-md p-2"
              value={searchQuery}
              onChange={handleSearch}
            />
            <button aria-label="Search" className="p-2 absolute right-0 top-0 bottom-0   hover:text-[#1B4B27] text">
              <FiSearch size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 text-black gap-6">
          {products.map((product, index) => (
            <div key={product.id || index} className="bg-white p-4 rounded-lg shadow-md">
              <div className='w-full h-48 bg-gray-300 object-cover rounded-t-lg'>
                <img
                  src={product.image_url || "/apples.jpeg"}
                  alt={product.name}
                  className="w-full h-48  object-cover rounded-t-lg"
                />
              </div>
              <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
              <p className="text-gray-600 mt-1">{product.description}</p>
              <div className="mt-4 items-center">
                <span className="text-xl font-bold">$ {product.price}</span><br />
                <AddToCartButton product={product} />
                <Link href={`/store/products/${product.id}`}>
                  <button className="bg-blue-500 w-full text-white px-4 mt-2 py-2 rounded-md hover:bg-blue-600 transition-colors">
                    View Product
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}  