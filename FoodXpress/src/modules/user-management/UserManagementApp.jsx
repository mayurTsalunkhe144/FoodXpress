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
        <Route path="/" element={<Navigate to="orders" replace />} />
        <Route path="orders" element={<ProfileLayout><OrdersPage /></ProfileLayout>} />
        <Route path="edit" element={<ProfileLayout><EditProfilePage /></ProfileLayout>} />
        <Route path="addresses" element={<ProfileLayout><AddressesPage /></ProfileLayout>} />
        <Route path="settings" element={<ProfileLayout><SettingsPage /></ProfileLayout>} />
      </Routes>
    </div>
  );
};

export default UserManagementApp;
