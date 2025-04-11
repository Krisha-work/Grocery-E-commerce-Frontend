import { Cart, CartItem, ApiResponse } from '../../type/index.d';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const getCart = async (userId: string): Promise<ApiResponse<Cart>> => {
  try {
    const res = await fetch(`${API_BASE_URL}/cart?userId=${userId}`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch cart',
      data: null
    };
  }
};

export const addToCart = async (
  userId: string,
  item: Omit<CartItem, 'id'>
): Promise<ApiResponse<Cart>> => {
  try {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ userId, ...item })
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    console.error('Failed to add to cart:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to add to cart',
      data: null
    };
  }
};

export const removeFromCart = async (
  userId: string,
  itemId: string
): Promise<ApiResponse<Cart>> => {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/${itemId}?userId=${userId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    console.error('Failed to remove from cart:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to remove from cart',
      data: null
    };
  }
};