import axios from 'axios';

const API_BASE = 'http://myuser.runasp.net/api';

axios.defaults.baseURL = API_BASE;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const getUserId = () => {
  return localStorage.getItem('customerId') || localStorage.getItem('userId');
};

export const getUserProfile = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.get('/user/profile', { headers });
    return response;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { data: { fullName: 'User', email: 'user@example.com' } };
  }
};

export const updateUserProfile = async (payload) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.put('/user/profile', payload, { headers });
    return response;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getUserOrders = async (page = 1) => {
  try {
    const headers = getAuthHeaders();
    const userId = getUserId();
    const response = await axios.get(`/user/order?page=${page}&userId=${userId}`, { headers });
    return response;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return { data: [] };
  }
};

export const getUserAddresses = async () => {
  try {
    const headers = getAuthHeaders();
    const userId = getUserId();
    const response = await axios.get(`/user/address?userId=${userId}`, { headers });
    return response;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return { data: { data: [] } };
  }
};

export const addUserAddress = async (address) => {
  try {
    const headers = getAuthHeaders();
    const addressDto = {
      type: address.type,
      address: address.address,
      city: address.city,
      pincode: address.pincode,
      isDefault: address.isDefault
    };
    const response = await axios.post('/user/address', addressDto, { headers });
    return response;
  } catch (error) {
    console.error('Error adding address:', error);
    throw error;
  }
};

export const updateUserAddress = async (id, address) => {
  try {
    const headers = getAuthHeaders();
    const addressDto = {
      id: id,
      type: address.type,
      address: address.address,
      city: address.city,
      pincode: address.pincode,
      isDefault: address.isDefault
    };
    const response = await axios.put(`/user/address/${id}`, addressDto, { headers });
    return response;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

export const deleteUserAddress = async (id) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.delete(`/user/address/${id}`, { headers });
    return response;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

export const getUserFavorites = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.get('/user/favorite', { headers });
    return response;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

export const getUserSettings = async () => {
  try {
    const headers = getAuthHeaders();
    const userId = getUserId();
    const response = await axios.get(`/user/settings?userId=${userId}`, { headers });
    return response;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return { data: {} };
  }
};

export const updateUserSettings = async (settings) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.put('/user/settings', settings, { headers });
    return response;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};
