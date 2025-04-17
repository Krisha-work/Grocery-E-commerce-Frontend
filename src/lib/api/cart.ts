import { promises } from "dns";
import apiClient from "./apiHelper";

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price: number;
  productDetails?: Product;
}

export interface Cart {
  id: number;
  user_id: number;
  total_amount: number;
  cartItems?: CartItem[];
}



export const CartService = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get("/cart");
    console.log(response, "---------------");
    return response.data;
  },

  addToCart: async (productId: number, quantity: number): Promise<CartItem> => {
    try {
      const response = await apiClient.post("/cart/items", { productId, quantity });
      
      // Handle different response formats
      if (response.data?.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      
      throw new Error('Invalid response format from server');
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(error.response.data?.message || 'Failed to add item to cart');
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(error.message || 'Failed to add item to cart');
      }
    }
  },

  updateCartItem: async (cartItemId: number, quantity: number): Promise<CartItem> => {
    const response = await apiClient.put(`/cart/items/${cartItemId}`, { quantity });
    return response.data.data;
  },

  removeFromCart: async (cartItemId: number): Promise<void> => {
    await apiClient.delete(`/cart/items/${cartItemId}`);
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete("/cart/clear");
  },

  paymentProcress: async (paymentMethodId: string, customerId: number) : Promise<void> =>{
    const response = await apiClient.post(`/cart/payment`, {paymentMethodId, customerId} )
    return response.data;
  }
};
