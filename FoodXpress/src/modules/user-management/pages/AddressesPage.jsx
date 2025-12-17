import { useState, useEffect } from 'react';
import { getUserAddresses, addUserAddress, updateUserAddress, deleteUserAddress } from '../api/userService';

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    address: '',
    city: '',
    pincode: '',
    isDefault: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug: Check request payload
    console.log('Sending address data:', JSON.stringify(newAddress, null, 2));
    
    // Debug: Validate data types
    console.log('Data types:', {
      type: typeof newAddress.type,
      address: typeof newAddress.address,
      city: typeof newAddress.city,
      pincode: typeof newAddress.pincode,
      isDefault: typeof newAddress.isDefault
    });
    
    // Debug: Check headers
    const token = localStorage.getItem('authToken');
    console.log('Headers:', {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : 'No token'
    });
    
    try {
      if (editingId) {
        await updateUserAddress(editingId, newAddress);
        setEditingId(null);
      } else {
        await addUserAddress(newAddress);
      }
      loadAddresses();
      setNewAddress({ type: 'Home', address: '', city: '', pincode: '', isDefault: false });
      setShowForm(false);
    } catch (error) {
      console.error('Address save error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      const errorMessage = error.response?.data?.message || error.message || 'Error saving address';
      alert(errorMessage);
    }
  };

  const handleEdit = (address) => {
    setNewAddress(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteUserAddress(id);
        loadAddresses();
      } catch (error) {
        alert('Error deleting address');
      }
    }
  };

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await getUserAddresses();
      // API returns nested structure: response.data.data
      console.log('Full response:', response.data);
      const addressesData = Array.isArray(response.data.data) ? response.data.data : [];
      console.log('Addresses data:', addressesData);
      setAddresses(addressesData);
    } catch (error) {
      console.error('Failed to load addresses:', error);
      // Use fallback mock addresses when API fails
      const mockAddresses = [
        {
          id: 1,
          type: 'Home',
          address: '123 Main Street, Apartment 4B',
          city: 'Bangalore',
          pincode: '560001',
          isDefault: true
        },
        {
          id: 2,
          type: 'Work',
          address: '456 Tech Park, Building C',
          city: 'Bangalore',
          pincode: '560066',
          isDefault: false
        }
      ];
      setAddresses(mockAddresses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setNewAddress({ type: 'Home', address: '', city: '', pincode: '', isDefault: false });
  };

  return (
    <div className="w-full p-8 font-outfit">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Manage Addresses</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="page-btn page-btn-primary"
        >
          + Add New Address
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address Type *</label>
                <select
                  name="type"
                  value={newAddress.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  maxLength={100}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Address *</label>
              <textarea
                name="address"
                value={newAddress.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                maxLength={500}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode * (6 digits)</label>
              <input
                type="text"
                name="pincode"
                value={newAddress.pincode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                pattern="\d{6}"
                maxLength={6}
                placeholder="123456"
                required
              />
            </div>
            <div className="mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={newAddress.isDefault}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm font-medium text-gray-700">Set as default address</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="page-btn page-btn-primary">
                {editingId ? 'Update Address' : 'Add Address'}
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                className="page-btn page-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading addresses...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses && addresses.length > 0 ? addresses.map(address => (
          <div key={address.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {address.type}
                  </span>
                  {address.isDefault && (
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-gray-900 font-medium mb-1">{address.address}</p>
                <p className="text-gray-600">{address.city} - {address.pincode}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(address)}
                  className="page-btn page-btn-secondary"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(address.id)}
                  className="page-btn page-btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          )) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No addresses found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressesPage;