import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../api/userService';

const EditProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    mobile: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserProfile().then(response => setProfile(response.data));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate mobile number - only allow digits and max 10 characters
    if (name === 'mobile') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setProfile(prev => ({ ...prev, [name]: digitsOnly }));
      }
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(profile);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-8 font-outfit">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Edit Profile</h2>
      
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
        <form onSubmit={handleSubmit}>


          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={profile.mobile}
                onChange={handleInputChange}
                placeholder="Enter 10-digit mobile number"
                pattern="[0-9]{10}"
                maxLength="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                required
              />
              {profile.mobile && profile.mobile.length !== 10 && (
                <p className="text-red-500 text-sm mt-1">Mobile number must be exactly 10 digits</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="page-btn page-btn-primary flex-1"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
            <button
              type="button"
              className="page-btn page-btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;