"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaYoutube } from 'react-icons/fa';
import Cookies from 'js-cookie';
interface NavItem {
  label: string;
  href: string;
}


const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Products', href: '/store/products' },
  { label: 'Login', href: '/auth/login' },
  { label: 'Register', href: '/auth/register' },
];

const isAuthenticated = () => {
  const token = Cookies.get('authToken');
  return token !== undefined;
};

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isAuthenticate, setIsAuthenticate] = useState(false);

  // hide login and register button if user is authenticated
  useEffect(() => {
    setIsAuthenticate(isAuthenticated());
  }, []);

  return (
    <header className="w-full">
      {/* Top Bar */}
    

      {/* Main Navbar */}
      <nav className="bg-white py-4 px-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-30 h-8 bg-[#1B4B27] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">Grocery Site</span>
            </div>
              </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-600 hover:text-[#1B4B27] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center text-black gap-4">
            <button aria-label="Search" className="p-2 hover:text-[#1B4B27] text">
              <FiSearch size={20} />
            </button>
            <button aria-label="Cart" className="p-2 hover:text-[#1B4B27]">
              <FiShoppingBag size={20} />
            </button>
            <Link href="/account">
            <button aria-label="Account" className="p-2 hover:text-[#1B4B27]">
              <FiUser size={20} />
            </button>
            </Link>
            <button
              aria-label="Toggle mobile menu"
              className="lg:hidden p-2 hover:text-[#1B4B27]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed text-black inset-0 z-50 bg-white">
            <div className="container mx-auto px-4 py-6">
              <div className="flex justify-end">
                <button
                  aria-label="Close menu"
                  className="p-2 hover:text-[#1B4B27]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="flex flex-col items-center gap-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-xl text-gray-600 hover:text-[#1B4B27] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-8">
                <Link href="https://facebook.com" aria-label="Facebook"><FaFacebookF size={20} /></Link>
                <Link href="https://twitter.com" aria-label="Twitter"><FaTwitter size={20} /></Link>
                <Link href="https://pinterest.com" aria-label="Pinterest"><FaPinterestP size={20} /></Link>
                <Link href="https://instagram.com" aria-label="Instagram"><FaInstagram size={20} /></Link>
                <Link href="https://youtube.com" aria-label="YouTube"><FaYoutube size={20} /></Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
