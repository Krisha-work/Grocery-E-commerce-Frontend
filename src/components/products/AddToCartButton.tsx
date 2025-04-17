'use client';

import { useState } from 'react';
import { CartItem } from '@/src/lib/types/cart';
import { addToCart } from '@/src/lib/servicers/cartService';
import { toast } from 'react-hot-toast';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const AddToCartButton = ({
  product,
  className = '',
  variant = 'default',
  size = 'md',
}: AddToCartButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const isAuthenticated = () => {
    const token = Cookies.get('authToken');
    return !!token;
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`${quantity} ${quantity === 1 ? 'unit' : 'units'} of ${product.name} added to cart`);
      setQuantity(1); // Reset quantity after successful addition
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'border border-gray-900 text-gray-900 hover:bg-gray-100';
      case 'ghost':
        return 'text-gray-900 hover:bg-gray-100';
      default:
        return 'bg-gray-900 text-white hover:bg-gray-800';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= 1}
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-12 text-center font-medium">{quantity}</span>
        <button
          onClick={() => handleQuantityChange(1)}
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-100"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className={`
          flex items-center justify-center gap-2
          rounded-md font-medium transition-colors
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
          disabled:opacity-50 disabled:cursor-not-allowed
          ${getVariantClasses()}
          ${getSizeClasses()}
          ${className}
        `}
      >
        <ShoppingCart className="h-4 w-4" />
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}; 