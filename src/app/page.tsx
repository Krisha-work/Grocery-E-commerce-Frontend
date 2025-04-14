'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchCategories } from '@/src/lib/servicers/categoryService';
import vegetablesBasket from '../../public/home-page.jpeg';

interface Category {
  id: string;
  name: string;
  description: string;
}

interface ApiResponse {
  data: Category[];
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchCategories();

        if (!response || !('data' in response)) {
          throw new Error('No response from server');
        }

        // Ensure data is an array
        const categoriesData = Array.isArray(response.data) ? response.data : [];
        console.log(categoriesData, "--------------");
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF8F4]">
      <main className="container w-full h-150 mx-auto px-4 md:px-6 py-8" >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-6 max-w-xl">
            <div className="space-y-2">
              <p className="text-[#8DC63F] font-medium">Shop</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="text-[#8DC63F]">Shop for Groceries</span>
                <br />
                <span className="text-[#333333]">Online Here</span>
              </h1>
            </div>
            <div className="flex gap-4 pt-4">
              <Link
                href="/store/products"
                className="bg-[#8DC63F] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7AB52F] transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="flex-1 relative w-full max-w-xl aspect-square">
            <div className="relative w-full h-full">
              <Image
                src={vegetablesBasket}
                alt="Fresh vegetables and fruits in a basket"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </main>

      {/* Categories Section */}
      <section className="container mx-auto px-4 md:px-6 py-12 mb-40">
        <h2 className="text-3xl font-bold text-center mb-8">Our Categories</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8DC63F]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#8DC63F] text-white px-6 py-2 rounded-full hover:bg-[#7AB52F] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-black font-bold text-2xl">No categories available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 text-black sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category: Category ,index :number) => {
              console.log(category, "------------");
              
              return (
                <div key={category.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <Link
                    href={`/store/category/${category.id}`}
                    className="block"
                  >
                    <h3 className="text-xl font-semibold text-black mb-2">{category.name}</h3>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  );
}