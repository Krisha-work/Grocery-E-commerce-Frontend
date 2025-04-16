'use client';

import { useState, useEffect } from 'react';
import { Cart as DisplayCart, CartItem as DisplayCartItem } from '@/src/lib/types/cart';
import { getLocalCart, removeFromCart, updateItemQuantity, clearCart } from '@/src/lib/servicers/cartService';
import Image from 'next/image';
import { Trash2, Plus, Minus, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { CartService, Cart as ServerCart, CartItem as ServerCartItem } from "../../../lib/api/cart";
import { useAuth } from '../../../lib/hooks/useAuth';
import CheckoutForm  from '../../../components/Payment/CheckoutForm'
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../../lib/hooks/stripe';

interface ExtendedProduct extends Omit<ServerCartItem['productDetails'], 'image_url'> {
  image_url?: string;
}

interface ExtendedServerCartItem extends Omit<ServerCartItem, 'productDetails'> {
  productDetails?: ExtendedProduct;
}

export default function CartPage() {
  const [cart, setCart] = useState<DisplayCart>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  console.log("-------------------------");

  useEffect(() => {
    const initializeCart = async () => {
      if (isAuthenticated && user) {
        try {
          const serverCart = await CartService.getCart();

          setCart({
            items: serverCart.cartItems?.map(item => ({
              id: item.id.toString(),
              name: item.productDetails?.name || 'Unknown Product',
              price: item.price || 0,
              quantity: item.quantity || 0,
              image: (item.productDetails as any)?.image_url || ''
            })) || [],
            total: serverCart.total_amount || 0
          });
        } catch (error) {
          console.error('Error initializing cart:', error);
          const localCart = getLocalCart();
          setCart(localCart);
        } finally {
          setIsLoading(false);
        }
      } else {
        const localCart = getLocalCart();
        setCart(localCart);
        setIsLoading(false);
      }
    };

    initializeCart();
  }, [isAuthenticated, user]);

  // console.log(cart,"cart-------");


  const loadCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const cartData = getLocalCart();
      setCart(cartData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load cart';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setIsUpdating(true);
      setError(null);

      if (isAuthenticated && user) {
        // Server cart operation
        await CartService.removeFromCart(Number(itemId));
        const serverCart = await CartService.getCart();
        setCart({
          items: serverCart.cartItems?.map(item => ({
            id: item.id.toString(),
            name: item.productDetails?.name || 'Unknown Product',
            price: item.price || 0,
            quantity: item.quantity || 0,
            image: (item.productDetails as any)?.image_url || ''
          })) || [],
          total: serverCart.total_amount || 0
        });
      } else {
        // Local cart operation
        const updatedCart = await removeFromCart(itemId);
        setCart(updatedCart);
      }

      toast.success('Item removed from cart');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove item';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error removing item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setIsUpdating(true);
      setError(null);

      if (isAuthenticated && user) {
        // Server cart operation
        await CartService.updateCartItem(Number(itemId), newQuantity);
        const serverCart = await CartService.getCart();
        setCart({
          items: serverCart.cartItems?.map(item => ({
            id: item.id.toString(),
            name: item.productDetails?.name || 'Unknown Product',
            price: item.price || 0,
            quantity: item.quantity || 0,
            image: (item.productDetails as any)?.image_url || ''
          })) || [],
          total: serverCart.total_amount || 0
        });
      } else {
        // Local cart operation
        const updatedCart = await updateItemQuantity(itemId, newQuantity);
        setCart(updatedCart);
      }

      toast.success('Quantity updated');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update quantity';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setIsUpdating(true);
      setError(null);

      if (isAuthenticated && user) {
        // Server cart operation
        await CartService.clearCart();
        setCart({ items: [], total: 0 });
      } else {
        // Local cart operation
        const emptyCart = await clearCart();
        setCart(emptyCart);
      }

      toast.success('Cart cleared');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
      setError(errorMessage);
      toast.error(errorMessage);
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Cart</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadCart}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black bg-[#F1EFEC] py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
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
              {cart.items.map((item: DisplayCartItem, index: number) => {
                console.log(item, "item---------");

                return (
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
                )
              }
              )}
            </div>

            <div className="p-4 sm:p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-gray-900">
                  Total: ${cart.total}
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
                  <Elements stripe={stripePromise}>
                    <CheckoutForm />
                  </Elements>
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