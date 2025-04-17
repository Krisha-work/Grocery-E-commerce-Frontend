'use client';

import { useEffect, useState } from 'react';
import { getOrderById, cancelOrder } from '@/src/lib/servicers/orderService';
import { Order as ApiOrder } from '@/src/lib/api/order';

interface OrderPageProps {
  params: {
    id: string;
  };
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  productName: string;
  productImage: string;
}

interface UIOrder extends Omit<ApiOrder, 'items'> {
  items: OrderItem[];
  shippingAddress: string;
}

const transformOrder = (apiOrder: ApiOrder): UIOrder => {
  return {
    ...apiOrder,
    items: apiOrder.items.map(item => ({
      ...item,
      price: item.price || 0,
      productName: item.productName || '',
      productImage: item.productImage || '/placeholder.jpg'
    })),
    shippingAddress: apiOrder.shippingAddress || ''
  };
};

export default function OrderPage({ params }: OrderPageProps) {
  const [order, setOrder] = useState<UIOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const apiOrder = await getOrderById(params.id);
        const transformedOrder = transformOrder(apiOrder);
        setOrder(transformedOrder);
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  const handleCancelOrder = async () => {
    if (!order || cancelling) return;
    
    try {
      setCancelling(true);
      await cancelOrder(order.id);
      setOrder({ ...order, status: 'cancelled' });
    } catch (err) {
      setError('Failed to cancel order');
      console.error('Error cancelling order:', err);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Order Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Order ID:</span> {order.id}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </p>
              <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><span className="font-medium">Total:</span> ${order.total.toFixed(2)}</p>
              
              {order.status === 'pending' && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className={`mt-4 px-4 py-2 rounded ${
                    cancelling 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white`}
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Shipping Address:</span> {order.shippingAddress}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 