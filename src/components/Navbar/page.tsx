"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi';
import Cookies from 'js-cookie';
interface NavItem {
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { label: 'Products', href: '/store/products' },
    // { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
];



const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isAuthenticate, setIsAuthenticate] = useState(false);

    const token = Cookies.get('authToken');
    const isAuthenticated = () => {
        console.log(token,"----");
        if (!token){
            setIsAuthenticate(true);
        }
        else {
            setIsAuthenticate(false);
        }

        // return token !== undefined;
    };
    // hide login and register button if user is authenticated
    useEffect(() => {
        isAuthenticated()
    });

    return (
        <header className="w-full">

            {/* Main Navbar */}
            <nav className="bg-white fixed top-0 left-0 right-0 z-50 py-4 px-4 shadow-sm">
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
                        {!isAuthenticate ? (
                            <>

                                <Link href="/store/cart">
                                    <button aria-label="Cart" className="p-2 hover:text-[#1B4B27]">
                                        <FiShoppingBag size={20} />
                                    </button>
                                </Link>
                                <Link href="/store/orders">
                                    <button aria-label="Account" className="p-3 bg-[#1B4B27] hover:bg-[#3F7D58] text-white rounded-lg px-4">
                                        Order
                                    </button>
                                </Link>
                                <Link href="/account">
                                    <button aria-label="Account" className="p-3 bg-[#1B4B27] hover:bg-[#3F7D58] text-white rounded-lg px-4">
                                        <FiUser size={20} />
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <button className="p-2 bg-[#1B4B27] hover:bg-[#3F7D58] text-white rounded-md px-5">
                                        Login
                                    </button>
                                </Link>
                                <Link href="/auth/register">
                                    <button className="p-2 bg-[#1B4B27] hover:bg-[#3F7D58] text-white rounded-md px-5">
                                        Register
                                    </button>
                                </Link>
                            </>
                        )}
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
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
