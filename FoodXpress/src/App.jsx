import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import './styles/global.css';

// Module imports
import { Navbar, Header, HomePage } from './modules/home-navigation';
import { ErrorBoundary } from './shared';
import AuthPage from './modules/auth/pages/AuthPage.jsx';

// Page imports
import Menu from './pages/Menu/Menu';
import Restaurants from './pages/Restaurants/Restaurants';
import Offers from './pages/Offers/Offers';

// Order Management imports
import OrderApp from './modules/order-management/OrderApp.jsx';

// User Management imports
import UserManagementApp from './modules/user-management/UserManagementApp.jsx';

// Dashboard Analytics imports
import { ThemeProvider } from './modules/dashboard-analytics/context/ThemeContext';
import { CacheProvider } from './modules/dashboard-analytics/context/CacheContext';
import Layout from './modules/dashboard-analytics/app/layout/Layout';
import AppRouter from './modules/dashboard-analytics/app/router/index';

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAuth = location.pathname === '/auth';
  const isUserManagement = location.pathname.startsWith('/user-management');

  if (isDashboard) {
    return (
      <ThemeProvider>
        <CacheProvider>
          <Layout>
            <AppRouter />
          </Layout>
        </CacheProvider>
      </ThemeProvider>
    );
  }

  if (isAuth) {
    return <AuthPage />;
  }

  if (isUserManagement) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        color: '#333333',
        minHeight: '100vh'
      }}>
        <ErrorBoundary>
          <Navbar />
          <Routes>
            <Route path="/user-management/*" element={<UserManagementApp />} />
          </Routes>
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      color: '#333333',
      minHeight: '100vh'
    }}>
      <ErrorBoundary>
        <Navbar />
        {isHomePage && <Header />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/cart/*" element={<OrderApp />} />
          <Route path="/checkout/*" element={<OrderApp />} />
          <Route path="/orders/*" element={<OrderApp />} />
          <Route path="/order-status/*" element={<OrderApp />} />
          <Route path="/order-summary/*" element={<OrderApp />} />
          <Route path="/order-tracking/*" element={<OrderApp />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
