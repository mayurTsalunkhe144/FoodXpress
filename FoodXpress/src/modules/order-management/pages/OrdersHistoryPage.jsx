import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../services/orderService.jsx';
import '../styles/shared.css';

const OrdersHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getMyOrders();
      setOrders(response.data || response);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return '#28a745';
      case 'preparing': return '#ffc107';
      case 'ready': return '#17a2b8';
      case 'out for delivery': return '#fd7e14';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading your orders...</div>;

  return (
    <div className="orders-history-page">
      <div className="container">
        <div className="page-header">
          <h1>Your Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <h2>No orders yet</h2>
            <p>Start ordering your favorite food!</p>
            <button onClick={() => navigate('/cart')} className="btn btn-primary">
              Order Now
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.orderId} className="order-card card p-lg m-md">
                <div className="order-header">
                  <div className="order-info">
                    <div className="order-number">#{order.orderNumber}</div>
                    <div className="order-date">{formatDate(order.orderDate)}</div>
                  </div>
                  <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                    {order.status}
                  </div>
                </div>

                <div className="order-restaurants">
                  {order.restaurants?.map((restaurant) => (
                    <div key={restaurant.restaurantId} className="restaurant-info">
                      <div className="restaurant-name">{restaurant.restaurantName}</div>
                      <div className="restaurant-items">
                        {restaurant.items?.map((item, index) => (
                          <span key={index} className="item-summary">
                            {item.quantity}x {item.menuItemName}
                            {index < restaurant.items.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    Total: ₹{order.totalAmount}
                    {order.discountAmount > 0 && (
                      <span className="discount"> (Saved ₹{order.discountAmount})</span>
                    )}
                  </div>
                  <div className="order-actions">
                    <button 
                      onClick={() => navigate(`/order-summary/${order.orderId}`)}
                      className="btn btn-secondary"
                    >
                      View Details
                    </button>
                    {['confirmed', 'preparing', 'ready', 'out for delivery'].includes(order.status.toLowerCase()) && (
                      <button 
                        onClick={() => navigate(`/order-tracking/${order.orderId}`)}
                        className="btn btn-primary"
                      >
                        Track Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersHistoryPage;