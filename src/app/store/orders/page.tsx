'use client';

import { useEffect, useState } from 'react';
import { getUserOrders } from '@/src/lib/servicers/orderService';
import Link from 'next/link';
import { Order as ApiOrder } from '@/src/lib/api/order';

interface UIOrder {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      image_url: string;
    };
  }[];
}

const transformOrder = (apiOrder: ApiOrder): UIOrder => {
  return {
    id: apiOrder.id,
    status: apiOrder.status,
    total: apiOrder.total,
    createdAt: apiOrder.createdAt,
    items: apiOrder.items.map(item => ({
      id: item.productId,
      quantity: item.quantity,
      price: 0, // You'll need to fetch this from the product
      product: {
        name: '', // You'll need to fetch this from the product
        image_url: '' // You'll need to fetch this from the product
      }
    }))
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const apiOrders = await getUserOrders();
        const transformedOrders = apiOrders.map(transformOrder);
        setOrders(transformedOrders);
      } catch (err) {
        setError('Failed to load orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
          <Link 
            href="/store/products"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                  <p className="text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                  <Link 
                    href={`/store/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded">
                          <img
                            src={item.product.image_url || "/placeholder.jpg"}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    Total: ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
