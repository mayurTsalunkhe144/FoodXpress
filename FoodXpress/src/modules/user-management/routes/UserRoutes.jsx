import { Routes, Route } from 'react-router-dom';
import ProfileLayout from '../pages/ProfileLayout';
import OrdersPage from '../pages/OrdersPage';
import EditProfilePage from '../pages/EditProfilePage';
import AddressesPage from '../pages/AddressesPage';
import SettingsPage from '../pages/SettingsPage';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/user" element={<ProfileLayout />}>
        <Route index element={<OrdersPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="edit" element={<EditProfilePage />} />
        <Route path="addresses" element={<AddressesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;