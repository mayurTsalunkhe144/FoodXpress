import { useState, useEffect } from 'react'
import Input from '../../../../components/ui/Input.jsx'

function ProfileForm({ profile, onSubmit, onStatusToggle }) {
  const [formData, setFormData] = useState({
    restaurantName: '',
    email: '',
    phone: '',
    cuisineType: '',
    description: '',
    address: '',
    cityId: 0,
    stateId: 0,
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        restaurantName: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        cuisineType: profile.cuisineType || '',
        description: profile.description || '',
        address: profile.address || '',
        cityId: profile.cityId || 0,
        stateId: profile.stateId || 0,
      })
    }
  }, [profile])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      name: formData.restaurantName,
      email: formData.email,
      phone: formData.phone,
      cuisineType: formData.cuisineType,
      description: formData.description,
      address: formData.address,
      cityId: formData.cityId,
      stateId: formData.stateId,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Status Warning */}
      {profile?.isActive !== 'Approved' && (
        <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
          <p className="text-yellow-300 font-semibold">⏳ Restaurant Not Active</p>
          <p className="text-yellow-200 text-sm mt-1">Your restaurant is waiting for admin approval. Current status: <span className="font-bold">{profile?.isActive}</span></p>
        </div>
      )}

      {/* Basic Info Section */}
      <div>
        <h3 className="text-lg font-bold text-cyan-300 mb-6 pb-4 border-b border-slate-700">🏪 Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Restaurant Name"
            value={formData.restaurantName}
            onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
            required
          />
          <Input
            label="Cuisine Type"
            value={formData.cuisineType}
            onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
          />
        </div>
      </div>

      {/* Contact Info Section */}
      <div>
        <h3 className="text-lg font-bold text-purple-300 mb-6 pb-4 border-b border-slate-700">📞 Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Description Section */}
      <div>
        <h3 className="text-lg font-bold text-pink-300 mb-6 pb-4 border-b border-slate-700">📝 Description</h3>
        <label className="block text-sm font-medium text-slate-300 mb-2">About Your Restaurant</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:bg-slate-800 transition"
          rows={4}
        />
      </div>

      {/* Address Section */}
      <div>
        <h3 className="text-lg font-bold text-green-300 mb-6 pb-4 border-b border-slate-700">📍 Address</h3>
        
        <Input
          label="Street Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: e.target.value,
            })
          }
          required
        />
      </div>

      {/* Status Section - Only show if Approved */}
      {profile && profile.isActive === 'Approved' && (
        <div>
          <h3 className="text-lg font-bold text-yellow-300 mb-6 pb-4 border-b border-slate-700">Status</h3>
          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg border border-slate-700">
            <input
              type="checkbox"
              checked={profile.isActive === 'Approved'}
              onChange={(e) => onStatusToggle(e.target.checked)}
              className="w-5 h-5 rounded border-slate-600 bg-slate-800 cursor-pointer"
            />
            <div>
              <label className="text-sm font-bold text-slate-200 cursor-pointer block">
                Restaurant is Active
              </label>
              <p className="text-xs text-slate-400 mt-1">Enable or disable your restaurant from accepting orders</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-8 border-t border-slate-700">
        <button
          type="submit"
          className="flex-1 px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          💾 Save Changes
        </button>
      </div>
    </form>
  )
}

export default ProfileForm
