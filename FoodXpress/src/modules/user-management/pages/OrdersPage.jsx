import { useState, useEffect } from 'react';
import { getUserOrders } from '../api/userService';
import OrderCard from '../components/profile/OrderCard';
import Loader from '../components/ui/Loader';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await getUserOrders(page);
      console.log('Orders API response:', response.data);
      
      // Handle API response or fallback data
      let ordersData = [];
      if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
      }
      
      console.log('Final orders data:', ordersData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreOrders = () => {
    setPage(prev => prev + 1);
    // In real app, append new orders to existing list
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full p-8 font-outfit min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Past Orders</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      ) : (
        <>
          {orders && orders.length > 0 ? orders.map(order => (
            <div key={order.orderId} className="bg-white rounded-lg shadow-md p-6 mb-4 border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order.orderId}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {order.restaurantName || 'Restaurant Name Not Available'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{order.totalAmount}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'OutForDelivery' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              {order.items && order.items.length > 0 && (
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600 mb-2">Items:</p>
                  <ul className="text-sm text-gray-700">
                    {order.items.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
          
          <div className="text-center mt-8">
            <button 
              onClick={loadMoreOrders}
              className="page-btn page-btn-danger"
            >
              Show More Orders
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;