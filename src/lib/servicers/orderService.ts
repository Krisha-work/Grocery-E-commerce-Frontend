import { OrderService } from "../api/order";

// Create order
const createOrder = async () => {
  try {
    const newOrder = await OrderService.createOrder({
      items: [
        { productId: 'prod123', quantity: 2 },
        { productId: 'prod456', quantity: 1 }
      ]
    });
    console.log('Order created:', newOrder);
  } catch (error) {
    console.error('Order creation error:', error);
  }
};

// Get user orders
const getUserOrders = async () => {
  try {
    const orders = await OrderService.getUserOrders();
    console.log('User orders:', orders);
  } catch (error) {
    console.error('Orders fetch error:', error);
  }
};

// Get order by id
const getOrderById = async (orderId: string) => {
  try {
    const order = await OrderService.getOrder(orderId);
    console.log('Order:', order);
  } catch (error) { 
    console.error('Order fetch error:', error);
  }
};

// Cancel order
const cancelOrder = async (orderId: string) => {
  try {
    const cancelledOrder = await OrderService.cancelOrder(orderId);
    console.log('Order cancelled:', cancelledOrder);
  } catch (error) {
    console.error('Order cancellation error:', error);
  }
};

// Process payment
const processPayment = async (orderId: string) => {
  try {
    const paymentResult = await OrderService.processPayment({
      orderId,
      paymentMethod: 'credit_card'
    });
    console.log('Payment processed:', paymentResult);
  } catch (error) {
    console.error('Payment error:', error);
  }
};

// Get all orders
const getAllOrders = async () => {
  try {
    const orders = await OrderService.getAllOrders();
    console.log('All orders:', orders);
  } catch (error) { 
    console.error('Orders fetch error:', error);
  }
};

// Update order status
const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const updatedOrder = await OrderService.updateOrderStatus(orderId, status);
    console.log('Order status updated:', updatedOrder);
  } catch (error) { 
    console.error('Order status update error:', error);
  }
};

export { createOrder, processPayment, getUserOrders, getAllOrders, getOrderById, cancelOrder, updateOrderStatus };