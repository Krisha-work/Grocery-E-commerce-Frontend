'use client';

import { ProductService, Product } from '@/src/lib/api/products';
import React, { useState, useEffect } from 'react';

export default function ProductsPage() {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.getAllProducts();
        
            setProducts(response.data);
        console.log(response.data," ------------");
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  console.log(products," -------546543-----");

  return (
    <div className="container min-w-screen min-h-screen bg-[#F1EFEC] mx-auto px-20 py-5 ">
      <h1 className="text-2xl text-black font-bold mb-4">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 text-black gap-6">
        {/* Product grid will be implemented here */}
        {products.map((product, index) => {
          console.log(product ," ----xczvcx--------");
          return (
            <>
              <div className="bg-white  p-4 rounded-lg shadow-md" key={index}>
                <img src="/apples.jpeg" alt="Product" className="w-full h-48 object-cover rounded-t-lg" />
                <h2 className="text-lg font-semibold mt-2">bv</h2>
                <p className="text-gray-600 mt-1">jhkgbv</p>
                <div className="mt-4">
                  <span className="text-xl font-bold">$ 475</span>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">Add to Cart</button>
                </div>
              </div>
            </>
          )
        })}
      </div>
    </div>
  );
}  