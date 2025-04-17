'use client';

import { useEffect, useState } from 'react';
import { getOrderById, updateOrderStatus } from '@/src/lib/servicers/orderService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

interface AdminOrderDetail extends Omit<ApiOrder, 'items'> {
  items: OrderItem[];
  user: {
    id: string;
    name: string;
    email: string;
  };
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

const transformOrder = (apiOrder: ApiOrder): AdminOrderDetail => {
  return {
    ...apiOrder,
    items: apiOrder.items.map(item => ({
      ...item,
      price: item.price || 0,
      productName: item.productName || '',
      productImage: item.productImage || '/placeholder.jpg'
    })),
    user: {
      id: apiOrder.userId,
      name: apiOrder.userName || '',
      email: apiOrder.userEmail || ''
    },
    shippingAddress: apiOrder.shippingAddress || {
      name: '',
      address: '',
      city: '',
      postalCode: '',
      country: ''
    }
  };
};

const ORDER_STATUSES = ['pending', 'processing', 'completed', 'cancelled'] as const;
type OrderStatus = typeof ORDER_STATUSES[number];

export default function AdminOrderPage({ params }: OrderPageProps) {
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

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

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order || updatingStatus) return;
    
    try {
      setUpdatingStatus(true);
      await updateOrderStatus(order.id, newStatus);
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      setError('Failed to update order status');
      console.error('Error updating order status:', err);
    } finally {
      setUpdatingStatus(false);
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
        <button
          onClick={() => router.push('/admin/orders')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <Link
          href="/admin/orders"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Back to Orders
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Order Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Order ID:</span> {order.id}</p>
              <p><span className="font-medium">Status:</span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                  disabled={updatingStatus}
                  className={`ml-2 px-2 py-1 rounded-full text-sm ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {ORDER_STATUSES.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </p>
              <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><span className="font-medium">Total:</span> ${order.total.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {order.user.name}</p>
              <p><span className="font-medium">Email:</span> {order.user.email}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {order.shippingAddress.name}</p>
              <p><span className="font-medium">Address:</span> {order.shippingAddress.address}</p>
              <p><span className="font-medium">City:</span> {order.shippingAddress.city}</p>
              <p><span className="font-medium">Postal Code:</span> {order.shippingAddress.postalCode}</p>
              <p><span className="font-medium">Country:</span> {order.shippingAddress.country}</p>
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
                          <Link
                            href={`/admin/products/${item.productId}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            View Product
                          </Link>
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
