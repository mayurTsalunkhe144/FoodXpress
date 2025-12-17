import { Outlet } from 'react-router-dom';
import Sidebar from '../components/profile/Sidebar';

const ProfileLayout = () => {
  return (
    <div className="flex min-h-screen" style={{marginTop: '160px'}}>
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ProfileLayout;