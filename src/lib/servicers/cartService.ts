// utils/cart.ts
import { CartService } from "../api/cart";
import { CartItem, Cart } from '../types/cart';

// Example: Get user's cart
export const fetchUserCart = async () => {
  try {
    const cart = await CartService.getCart();
    console.log("User cart:", cart);
    return cart;
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    throw error;
  }
};

// Example: Add item to cart
export const addItemToCart = async (productId: string, quantity: number) => {
  try {
    const cartItem = await CartService.addToCart({ productId, quantity });
    console.log("Item added to cart:", cartItem);
    return cartItem;
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    throw error;
  }
};

// Example: Update cart item quantity
export const updateCartItemQuantity = async (cartItemId: string, newQuantity: number) => {
  try {
    const updatedItem = await CartService.updateCartItem(cartItemId, {
      quantity: newQuantity,
    });
    console.log("Cart item updated:", updatedItem);
    return updatedItem;
  } catch (error) {
    console.error("Failed to update cart item:", error);
    throw error;
  }
};

// Example: Remove item from cart
export const removeCartItem = async (cartItemId: string) => {
  try {
    await CartService.removeFromCart(cartItemId);
    console.log("Item removed from cart");
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    throw error;
  }
};

// Example: Clear entire cart
export const clearUserCart = async () => {
  try {
    await CartService.clearCart();
    console.log("Cart cleared successfully");
  } catch (error) {
    console.error("Failed to clear cart:", error);
    throw error;
  }
};

// Cart state management using localStorage
const CART_STORAGE_KEY = 'shopping_cart';

// Get cart from localStorage
export const getCart = (): Cart => {
  if (typeof window === 'undefined') return { items: [], total: 0 };
  
  const cartJson = localStorage.getItem(CART_STORAGE_KEY);
  return cartJson ? JSON.parse(cartJson) : { items: [], total: 0 };
};

// Save cart to localStorage
const saveCart = (cart: Cart) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

// Add item to cart
export const addToCart = (item: CartItem) => {
  const cart = getCart();
  const existingItem = cart.items.find(i => i.id === item.id);
  
  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.items.push(item);
  }
  
  cart.total = calculateTotal(cart.items);
  saveCart(cart);
  return cart;
};

// Remove item from cart
export const removeFromCart = (itemId: string) => {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.id !== itemId);
  cart.total = calculateTotal(cart.items);
  saveCart(cart);
  return cart;
};

// Update item quantity
export const updateItemQuantity = (itemId: string, quantity: number) => {
  const cart = getCart();
  const item = cart.items.find(i => i.id === itemId);
  
  if (item) {
    item.quantity = quantity;
    cart.total = calculateTotal(cart.items);
    saveCart(cart);
  }
  
  return cart;
};

// Clear cart
export const clearCart = () => {
  const emptyCart = { items: [], total: 0 };
  saveCart(emptyCart);
  return emptyCart;
};

// Calculate total
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};