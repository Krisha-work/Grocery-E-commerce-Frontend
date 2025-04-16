'use client';

import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '@/src/lib/servicers/orderService';
import Link from 'next/link';
import { Order as ApiOrder } from '@/src/lib/api/order';

interface AdminOrder {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }[];
}

const transformOrder = (apiOrder: ApiOrder): AdminOrder => {
  return {
    ...apiOrder,
    user: {
      id: apiOrder.userId,
      name: '', // You'll need to fetch this from user service
      email: '' // You'll need to fetch this from user service
    },
    items: apiOrder.items.map(item => ({
      id: item.productId,
      quantity: item.quantity,
      price: 0, // You'll need to fetch this from product service
      product: {
        name: '' // You'll need to fetch this from product service
      }
    }))
  };
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const apiOrders = await getAllOrders();
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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError('Failed to update order status');
      console.error('Error updating order status:', err);
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
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link 
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    #{order.id}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="font-medium">{order.user.name}</p>
                    <p className="text-sm text-gray-500">{order.user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-sm ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
