import { Routes, Route, Navigate } from 'react-router-dom'
import { getUserFromStorage, isAdmin, isRestaurantOwner } from '../../utils/auth.js'

// Restaurant Pages
import RestaurantDashboard from '../../features/restaurant/dashboard/page.jsx'
import RestaurantOrders from '../../features/restaurant/orders/page.jsx'
import RestaurantMenu from '../../features/restaurant/menu/page.jsx'
import RestaurantCategories from '../../features/restaurant/categories/page.jsx'
import RestaurantProfile from '../../features/restaurant/profile/page.jsx'

// Admin Pages
import AdminDashboard from '../../features/admin/dashboard/page.jsx'
import AdminPending from '../../features/admin/pending/page.jsx'
import AdminRestaurantDetail from '../../features/admin/detail/page.jsx'
import AdminActive from '../../features/admin/active/page.jsx'
import AdminRejected from '../../features/admin/rejected/page.jsx'
import AdminRestaurants from '../../features/admin/restaurants/page.jsx'
import RestaurantDetails from '../../features/admin/restaurants/details.jsx'
import AdminRestaurantOrders from '../../features/admin/restaurants/restaurant-orders.jsx'
import AdminRestaurantCategories from '../../features/admin/restaurants/restaurant-categories.jsx'
import AdminRestaurantMenu from '../../features/admin/restaurants/restaurant-menu.jsx'
import AdminUsers from '../../features/admin/users/page.jsx'
import AdminAnalytics from '../../features/admin/analytics/page.jsx'

function AppRouter() {
  const user = getUserFromStorage()
  
  // Priority: localStorage user first, then fallback
  let currentUser = user
  
  if (!currentUser) {
    // Fallback only if no localStorage user
    const isAdminPath = window.location.pathname.includes('/admin')
    currentUser = isAdminPath 
      ? { userId: 1, roleId: 1, fullName: 'Demo Admin', email: 'admin@demo.com' }
      : { userId: 2, roleId: 3, fullName: 'Demo Restaurant Owner', email: 'owner@demo.com' }
  }

  return (
    <Routes>
      {/* Restaurant Routes - Only for Restaurant Owners */}
      {isRestaurantOwner(currentUser) && (
        <>
          <Route path="/dashboard/restaurant/dashboard" element={<RestaurantDashboard />} />
          <Route path="/dashboard/restaurant/orders" element={<RestaurantOrders />} />
          <Route path="/dashboard/restaurant/menu" element={<RestaurantMenu />} />
          <Route path="/dashboard/restaurant/categories" element={<RestaurantCategories />} />
          <Route path="/dashboard/restaurant/profile" element={<RestaurantProfile />} />
        </>
      )}

      {/* Admin Routes - Only for Admins */}
      {isAdmin(currentUser) && (
        <>
          <Route path="/dashboard/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/pending" element={<AdminPending />} />
          <Route path="/dashboard/admin/restaurant/:id" element={<AdminRestaurantDetail />} />
          <Route path="/dashboard/admin/active" element={<AdminActive />} />
          <Route path="/dashboard/admin/rejected" element={<AdminRejected />} />
          <Route path="/dashboard/admin/restaurants" element={<AdminRestaurants />} />
          <Route path="/dashboard/admin/restaurants/:id" element={<RestaurantDetails />} />
          <Route path="/dashboard/admin/restaurants/:id/orders" element={<AdminRestaurantOrders />} />
          <Route path="/dashboard/admin/restaurants/:id/categories" element={<AdminRestaurantCategories />} />
          <Route path="/dashboard/admin/restaurants/:id/menu" element={<AdminRestaurantMenu />} />
          <Route path="/dashboard/admin/users" element={<AdminUsers />} />
          <Route path="/dashboard/admin/analytics" element={<AdminAnalytics />} />
        </>
      )}

      {/* Default redirect based on role */}
      <Route path="/dashboard" element={
        <Navigate to={isAdmin(currentUser) ? "/dashboard/admin/dashboard" : "/dashboard/restaurant/dashboard"} replace />
      } />
      <Route path="/dashboard/" element={
        <Navigate to={isAdmin(currentUser) ? "/dashboard/admin/dashboard" : "/dashboard/restaurant/dashboard"} replace />
      } />
    </Routes>
  )
}

export default AppRouter
