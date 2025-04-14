// services/orderService.ts
import apiClient from "./apiHelper";

interface OrderItem {
  productId: string;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: string;
  total: number;
  createdAt: string;
  // other order fields
}

interface CreateOrderParams {
  items: OrderItem[];
}

interface PaymentParams {
  orderId: string;
  paymentMethod: string;
}

interface UpdateStatusParams {
  status: string;
}

export const OrderService = {
  createOrder: async (data: CreateOrderParams): Promise<Order> => {
    return apiClient.post("/orders", data);
  },

  getUserOrders: async (): Promise<Order[]> => {
    return apiClient.get("/orders/user");
  },

  getOrder: async (id: string): Promise<Order> => {
    return apiClient.get(`/orders/${id}`);
  },

  cancelOrder: async (id: string): Promise<void> => {
    return apiClient.post(`/orders/${id}/cancel`);
  },

  processPayment: async (data: PaymentParams): Promise<any> => {
    return apiClient.post("/orders/payment", data);
  },

  getAllOrders: async (): Promise<Order[]> => {
    return apiClient.get("/orders");
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    return apiClient.put(`/orders/${id}/status`, { status });
  },
};

export type { Order, OrderItem, CreateOrderParams, PaymentParams, UpdateStatusParams };