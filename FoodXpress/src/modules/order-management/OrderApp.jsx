import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrdersHistoryPage from './pages/OrdersHistoryPage.jsx';
import OrderStatusPage from './pages/OrderStatusPage.jsx';
import './styles/shared.css';

const OrderApp = () => {
  return (
    <div className="order-management-app">
      <Routes>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersHistoryPage />} />
        <Route path="/order-status/:orderId" element={<OrderStatusPage />} />
        <Route path="/order-summary/:orderId" element={<OrderStatusPage />} />
        <Route path="/order-tracking/:orderId" element={<OrderStatusPage />} />
      </Routes>
    </div>
  );
};

export default OrderApp;