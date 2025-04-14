'use client';

import { useState } from 'react';
import { CartItem } from '@/src/lib/types/cart';
import { addToCart } from '@/src/lib/servicers/cartService';
import { toast } from 'react-hot-toast';
import { Loader2, ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity?: number;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const AddToCartButton = ({
  product,
  quantity = 1,
  className = '',
  variant = 'default',
  size = 'md',
}: AddToCartButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      };
      
      addToCart(cartItem);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
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
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      <span>Add to Cart</span>
    </button>
  );
}; 