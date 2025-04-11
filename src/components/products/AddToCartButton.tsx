'use client'; // Required for interactivity

import { useState } from 'react';
import { addToCart } from '../../lib/api/cart';
import { Button } from '../ui/button'; // Assuming you're using shadcn/ui
import { Loader2 } from 'lucide-react';

export default function AddToCartButton({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart('current-user-id', { 
        productId: Number(productId),
        quantity: 1,
      });
      // Optional: Show toast notification
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleAddToCart}
      disabled={isLoading}
      className="w-full mt-4"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        'Add to Cart'
      )}
    </Button>
  );
}