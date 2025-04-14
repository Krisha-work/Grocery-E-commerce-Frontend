// services/cartService.ts
import apiClient from "./apiHelper";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  productDetails?: Product;
}

interface Cart {
  id: string;
  userId: string;
  totalAmount: number;
  cartItems: CartItem[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  // other product fields
}

interface AddToCartParams {
  productId: string;
  quantity: number;
}

interface UpdateCartItemParams {
  quantity: number;
}

export const CartService = {
  getCart: async (): Promise<Cart> => {
    return apiClient.get("/cart");
  },

  addToCart: async (data: AddToCartParams): Promise<CartItem> => {
    return apiClient.post("/cart/items", data);
  },

  updateCartItem: async (cartItemId: string, data: UpdateCartItemParams): Promise<CartItem> => {
    return apiClient.put(`/cart/items/${cartItemId}`, data);
  },

  removeFromCart: async (cartItemId: string): Promise<void> => {
    return apiClient.delete(`/cart/items/${cartItemId}`);
  },

  clearCart: async (): Promise<void> => {
    return apiClient.delete("/cart/clear");
  },
};

export type { Cart, CartItem, AddToCartParams, UpdateCartItemParams };