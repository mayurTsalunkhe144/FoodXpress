import { useState, useEffect } from 'react';
import { getUserProfile } from '../../api/userService';

const ProfileHeader = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    mobile: '+91 9876543210',
    email: 'john.doe@example.com'
  });

  useEffect(() => {
    getUserProfile()
      .then(response => {
        console.log('Profile API response:', response.data);
        // Handle nested API response structure
        const profileData = response.data.data || response.data;
        if (profileData && profileData.name) {
          setProfile(profileData);
        } else {
          console.log('API returned empty data, keeping fallback');
        }
      })
      .catch(error => {
        console.log('API failed, using fallback profile data:', error);
      });
  }, []);

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