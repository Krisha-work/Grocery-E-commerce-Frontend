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
    return await OrderService.getUserOrders();
  } catch (error) {
    console.error('Orders fetch error:', error);
    throw error;
  }
};

// Get order by id
 const getOrderById = async (orderId: string) => {
  try {
    return await OrderService.getOrder(orderId);
  } catch (error) { 
    console.error('Order fetch error:', error);
    throw error;
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
    return await OrderService.getAllOrders();
  } catch (error) { 
    console.error('Orders fetch error:', error);
    throw error;
  }
};

// Update order status
 const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    return await OrderService.updateOrderStatus(orderId, status);
  } catch (error) { 
    console.error('Order status update error:', error);
    throw error;
  }
};

export { createOrder, processPayment, getUserOrders, getAllOrders, getOrderById, cancelOrder, updateOrderStatus };