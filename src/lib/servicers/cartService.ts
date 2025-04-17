import { CartService } from "../api/cart";
import { Cart, CartItem, PaymentResponse } from "../types/cart";
import { Product as ApiProduct } from "../api/products";
import { loadStripe } from '@stripe/stripe-js';

// Get cart from local storage
const getLocalCart = (): Cart => {
  try {
    const cartJson = localStorage.getItem('cart');
    if (cartJson) {
      return JSON.parse(cartJson);
    }
    return { items: [], total: 0 };
  } catch (error) {
    console.error("Error getting local cart:", error);
    return { items: [], total: 0 };
  }
};

// Add to cart
const addToCart = async (productId: string, quantity: number): Promise<Cart> => {
  try {
    const item = await CartService.addToCart(Number(productId), quantity);
    
    if (!item) {
      throw new Error('Failed to add item to cart - server returned empty response');
    }

    const cart = getLocalCart();
    const existingItemIndex = cart.items.findIndex((i: CartItem) => i.id === productId);
    
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      const productDetails = item.productDetails;
      
      if (!productDetails) {
        throw new Error('Failed to add item to cart - missing product details');
      }

      const product = productDetails as unknown as ApiProduct;
      
      cart.items.push({
        id: productId,
        name: product.name || 'Unknown Product',
        price: item.price || 0,
        quantity: quantity,
        image: product.image_url || ''
      });
    }
    
    cart.total = cart.items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    
    // Check if it's a timeout error
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    
    // If it's a network error
    if (!error.response) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    // If we have a specific error message from the server, use it
    if (error.message) {
      throw error;
    }
    
    // Generic error
    throw new Error('Failed to add item to cart. Please try again.');
  }
};

// Update item quantity
const updateItemQuantity = async (cartItemId: string, quantity: number): Promise<Cart> => {
  try {
    // First update the server cart
    await CartService.updateCartItem(Number(cartItemId), quantity);
    const serverCart = await CartService.getCart();
    
    // Update local cart with server data
    const cart = getLocalCart();
    const itemIndex = cart.items.findIndex((item: CartItem) => item.id === cartItemId);
    
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity = quantity;
      // Update price from server data if available
      const serverItem = serverCart.cartItems?.find(item => item.id.toString() === cartItemId);
      if (serverItem) {
        cart.items[itemIndex].price = serverItem.price;
      }
      
      // Recalculate total using most up-to-date prices
      cart.total = cart.items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    return cart;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

// Remove item from cart
const removeFromCart = async (cartItemId: string): Promise<Cart> => {
  try {
    const cart = getLocalCart();
    cart.items = cart.items.filter((item: CartItem) => item.id !== cartItemId);
    cart.total = cart.items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error("Error removing item:", error);
    throw error;
  }
};

// Clear cart
const clearCart = async (): Promise<Cart> => {
  try {
    const emptyCart = { items: [], total: 0 };
    localStorage.setItem('cart', JSON.stringify(emptyCart));
    return emptyCart;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

// Sync local cart with server cart
const syncCart = async (localCart: Cart): Promise<Cart> => {
  try {
    if (localCart.items.length === 0) {
      return localCart;
    }
    
    const serverCart = await CartService.getCart();
    const mergedItems = [...((serverCart as unknown) as Cart).items];
    
    // Add local items that don't exist in server cart
    localCart.items.forEach(localItem => {
      const exists = mergedItems.some(item => item.id === localItem.id);
      if (!exists) {
        mergedItems.push(localItem);
      }
    });
    
    return {
      items: mergedItems,
      total: mergedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
  } catch (error) {
    console.error("Error syncing cart:", error);
    return localCart;
  }
};

/**
 * Process payment for the current cart using Stripe
 * @param paymentMethodId - Stripe payment method ID
 * @param customerId - Customer ID in the system
 * @returns Empty cart if payment is successful
 * @throws Error if payment fails
 */
const processPayment = async (paymentMethodId: string, customerId: number): Promise<Cart> => {
  try {
    // Initialize Stripe
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    if (!stripe) {
      throw new Error('Failed to initialize Stripe');
    }

    // Get current cart
    const cart = getLocalCart();
    if (!cart.items.length) {
      throw new Error('Cart is empty');
    }

    // Process payment through backend
    const response = await CartService.paymentProcress(paymentMethodId, customerId);
    const paymentResult = response as unknown as PaymentResponse;

    // Validate payment response
    if (!paymentResult.success) {
      throw new Error(paymentResult.error || 'Payment failed');
    }

    // If payment is successful, clear the cart
    await clearCart();
    
    return { items: [], total: 0 };
  } catch (error) {
    console.error("Payment processing error:", error);
    throw error;
  }
}

export {
  getLocalCart,
  addToCart,
  updateItemQuantity,
  removeFromCart,
  clearCart,
  syncCart,
  processPayment
};
