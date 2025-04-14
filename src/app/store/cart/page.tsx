'use client';

import { useState, useEffect } from 'react';
import { Cart, CartItem } from '@/src/lib/types/cart';
import { getCart, removeFromCart, updateItemQuantity, clearCart, addToCart } from '@/src/lib/servicers/cartService';
import Image from 'next/image';
import { Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const cartData = getCart();
      setCart(cartData);
    } catch (error) {
      toast.error('Failed to load cart');
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setIsUpdating(true);
      const updatedCart = removeFromCart(itemId);
      setCart(updatedCart);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error('Error removing item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setIsUpdating(true);
      const updatedCart = updateItemQuantity(itemId, newQuantity);
      setCart(updatedCart);
      toast.success('Quantity updated');
    } catch (error) {
      toast.error('Failed to update quantity');
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setIsUpdating(true);
      const emptyCart = clearCart();
      setCart(emptyCart);
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
      console.error('Error clearing cart:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black bg-[#F1EFEC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        {cart.items.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">Start shopping to add items to your cart</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {cart.items.map((item: CartItem) => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
                  {item.image && (
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="mt-1 text-gray-500">${item.price}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={isUpdating}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={isUpdating}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isUpdating}
                      className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 sm:p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-gray-900">
                  Total: ${cart.total.toFixed(2)}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleClearCart}
                    disabled={isUpdating}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
                  >
                    Clear Cart
                  </button>
                  <button
                    disabled={isUpdating}
                    className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}   