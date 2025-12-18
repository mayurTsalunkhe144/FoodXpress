import { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';

const ProfileHeader = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    mobile: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.fullName || 'User',
        mobile: user.phone || 'N/A',
        email: user.email || 'N/A'
      });
    }
  }, [user]);

  return (
    <div style={{background: 'linear-gradient(to right, #ff4d4d, #e53e3e)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000}} className="text-white w-full">
      <div className="px-12 py-20 flex justify-end">
        <div className="text-right">
          <h2 className="text-xl font-bold mb-1 font-outfit">{profile.name}</h2>
          <p className="text-red-100 font-outfit text-sm">{profile.mobile} • {profile.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
