'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import vegetablesBasket from '../../public/home-page.jpeg';
export default function Home() {
  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF8F4]">
      <main className="container mx-auto px-4 md:px-6 py-8">
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
              <Link 
                href="/download"
                className="border-2 border-[#8DC63F] text-[#8DC63F] px-6 py-3 rounded-full font-medium hover:bg-[#8DC63F] hover:text-white transition-colors"
              >
                Try Our App
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
    </div>
  );
}