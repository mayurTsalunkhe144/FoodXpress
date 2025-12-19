import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { orderApi } from '../services/orderService.jsx';
import '../styles/shared.css';

const OrderStatusPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getMyOrders();
      console.log('API Response:', response);
      const orders = Array.isArray(response) ? response : response.data || [];
      console.log('Orders:', orders);
      console.log('Looking for orderId:', orderId);
      const foundOrder = orders.find(order => String(order.orderId) === String(orderId));
      console.log('Found order:', foundOrder);
      setOrder(foundOrder || null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return '#28a745';
      case 'preparing': return '#ffc107';
      case 'ready': return '#17a2b8';
      case 'out for delivery': return '#fd7e14';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) return <div className="loading">Loading order status...</div>;

  if (!order) {
    return (
      <div className="order-status-page">
        <div className="container">
          <div className="page-header">
            <h1>Order Not Found</h1>
          </div>
          <div className="error">
            <p>Order ID: {orderId} not found</p>
            <button onClick={() => navigate('/orders')} className="btn btn-primary">
              View All Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-status-page">
      <div className="container">
        <div className="page-header">
          <h1>Order Status</h1>
        </div>
        
        <div className="order-details card p-lg">
          <div className="order-header">
            <h2>Order #{order.orderNumber}</h2>
            <div 
              className="status-badge" 
              style={{ 
                color: getStatusColor(order.status),
                backgroundColor: `${getStatusColor(order.status)}20`,
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: 'bold'
              }}
            >
              {order.status}
            </div>
          </div>

          <div className="order-info">
            <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
            <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
            {order.estimatedDelivery && (
              <p><strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleString()}</p>
            )}
          </div>

          <div className="order-items">
            <h3>Items Ordered</h3>
            {order.restaurants?.map((restaurant) => (
              <div key={restaurant.restaurantId} className="restaurant-section">
                <h4>{restaurant.restaurantName}</h4>
                {restaurant.items?.map((item) => (
                  <div key={item.orderItemId} className="order-item">
                    <span>{item.quantity}x {item.menuItemName}</span>
                    <span>₹{item.lineTotal}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="order-progress">
            <h3>Order Progress</h3>
            <div className="progress-steps">
              <div className={`step ${['confirmed', 'preparing', 'ready', 'out for delivery', 'delivered'].includes(order.status?.toLowerCase()) ? 'completed' : ''}`}>
                <div className="step-icon">✓</div>
                <div className="step-label">Order Confirmed</div>
              </div>
              <div className={`step ${['preparing', 'ready', 'out for delivery', 'delivered'].includes(order.status?.toLowerCase()) ? 'completed' : ''}`}>
                <div className="step-icon">👨‍🍳</div>
                <div className="step-label">Preparing</div>
              </div>
              <div className={`step ${['ready', 'out for delivery', 'delivered'].includes(order.status?.toLowerCase()) ? 'completed' : ''}`}>
                <div className="step-icon">📦</div>
                <div className="step-label">Ready</div>
              </div>
              <div className={`step ${['out for delivery', 'delivered'].includes(order.status?.toLowerCase()) ? 'completed' : ''}`}>
                <div className="step-icon">🚚</div>
                <div className="step-label">Out for Delivery</div>
              </div>
              <div className={`step ${order.status?.toLowerCase() === 'delivered' ? 'completed' : ''}`}>
                <div className="step-icon">🏠</div>
                <div className="step-label">Delivered</div>
              </div>
            </div>
          </div>
        </div>

        <div className="actions">
          <button onClick={() => navigate('/orders')} className="btn btn-secondary">
            View All Orders
          </button>
          {order.status?.toLowerCase() === 'delivered' && (
            <button onClick={() => navigate('/cart')} className="btn btn-primary">
              Order Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
