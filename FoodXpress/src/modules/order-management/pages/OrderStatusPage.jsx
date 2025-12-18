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
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getOrderTracking(orderId);
      let orderData = response?.data || response;
      
      if (Array.isArray(orderData)) {
        orderData = orderData.find(o => o.orderId == orderId) || orderData[0];
      }
      
      setOrder(orderData);
    } catch (err) {
      console.error('Error fetching order details:', err);
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
      case 'pending': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading order status...</div>;

  if (!order) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Order Not Found</h1>
        <p>Order ID: {orderId} not found</p>
        <button onClick={() => navigate('/orders')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          View All Orders
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>Order Status</h1>
        
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Order #{order.orderId}</h2>
            <div style={{ 
              color: getStatusColor(order.status),
              backgroundColor: `${getStatusColor(order.status)}20`,
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 'bold'
            }}>
              {order.status}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>Items Ordered</h3>
            {order.items?.map((item) => (
              <div key={item.orderItemId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                <span>{item.quantity}x {item.menuItemName}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => navigate('/orders')} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          View All Orders
        </button>
      </div>
    </div>
  );
};

export default OrderStatusPage;
