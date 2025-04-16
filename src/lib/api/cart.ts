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
    const response = await apiClient.post("/cart/items", { productId, quantity });
    return response.data.data;
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
