import React from 'react';
import { useLocation } from 'react-router-dom';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrdersHistoryPage from './pages/OrdersHistoryPage.jsx';
import OrderStatusPage from './pages/OrderStatusPage.jsx';
import './styles/shared.css';

const OrderApp = () => {
  const location = useLocation();
  
  if (location.pathname.startsWith('/cart')) {
    return (
      <div className="order-management-app">
        <CartPage />
      </div>
    );
  }
  
  if (location.pathname.startsWith('/checkout')) {
    return (
      <div className="order-management-app">
        <CheckoutPage />
      </div>
    );
  }
  
  if (location.pathname.startsWith('/orders')) {
    return (
      <div className="order-management-app">
        <OrdersHistoryPage />
      </div>
    );
  }
  
  if (location.pathname.startsWith('/order-status') || 
      location.pathname.startsWith('/order-summary') || 
      location.pathname.startsWith('/order-tracking')) {
    return (
      <div className="order-management-app">
        <OrderStatusPage />
      </div>
    );
  }
  
  return (
    <div className="order-management-app">
      <CartPage />
    </div>
  );
};

export default OrderApp;