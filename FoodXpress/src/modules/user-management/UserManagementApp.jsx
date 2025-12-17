import { Routes, Route, Navigate } from 'react-router-dom';
import ProfileHeader from './components/profile/ProfileHeader';
import ProfileLayout from './pages/ProfileLayout';
import OrdersPage from './pages/OrdersPage';
import EditProfilePage from './pages/EditProfilePage';
import AddressesPage from './pages/AddressesPage';
import SettingsPage from './pages/SettingsPage';

const UserManagementApp = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <ProfileHeader />
      <Routes>
        <Route path="/" element={<Navigate to="/user/orders" replace />} />
        <Route path="/user" element={<ProfileLayout />}>
          <Route index element={<OrdersPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="edit" element={<EditProfilePage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default UserManagementApp;