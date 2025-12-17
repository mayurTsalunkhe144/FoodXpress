import axios from 'axios';
import { isAuthenticated, getDefaultUserData, getAuthToken } from '../utils/authFallback';

const API_BASE = 'http://myuser.runasp.net/api';

// Configure axios
axios.defaults.baseURL = API_BASE;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Set auth token if available
const token = getAuthToken();
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Fallback data when not authenticated
const defaultData = getDefaultUserData();

export const getUserProfile = async () => {
  if (!isAuthenticated()) {
    console.log('No authentication found, using default profile data');
    return { data: defaultData.profile };
  }
  
  try {
    const response = await axios.get('/user/profile');
    return response;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    console.log('Falling back to default profile data');
    return { data: defaultData.profile };
  }
};

export const updateUserProfile = async (payload) => {
  try {
    const response = await axios.put('/user/profile', payload);
    return response;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getUserOrders = async (page = 1) => {
  if (!isAuthenticated()) {
    console.log('No authentication found, using default orders data');
    return { data: defaultData.orders };
  }
  
  try {
    const response = await axios.get(`/user/order?page=${page}`);
    return response;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    console.log('Falling back to default orders data');
    return { data: defaultData.orders };
  }
};

export const getUserAddresses = async () => {
  if (!isAuthenticated()) {
    console.log('No authentication found, using default addresses data');
    return { data: { data: defaultData.addresses } };
  }
  
  try {
    const response = await axios.get('/user/address');
    return response;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    console.log('Falling back to default addresses data');
    return { data: { data: defaultData.addresses } };
  }
};

export const addUserAddress = async (address) => {
  try {
    // Map frontend fields to backend DTO
    const addressDto = {
      type: address.type,
      address: address.address, // Frontend 'address' -> Backend 'address'
      city: address.city,
      pincode: address.pincode,
      isDefault: address.isDefault
    };
    
    console.log('API Call - Adding address:', addressDto);
    console.log('Request URL:', `${API_BASE}/user/address`);
    
    const response = await axios.post('/user/address', addressDto);
    console.log('Success response:', response.status, response.data);
    return response;
  } catch (error) {
    console.error('API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export const updateUserAddress = async (id, address) => {
  try {
    const addressDto = {
      id: id,
      type: address.type,
      address: address.address,
      city: address.city,
      pincode: address.pincode,
      isDefault: address.isDefault
    };
    
    console.log('Updating address:', id, addressDto);
    const response = await axios.put(`/user/address/${id}`, addressDto);
    return response;
  } catch (error) {
    console.error('Error updating address:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteUserAddress = async (id) => {
  try {
    const response = await axios.delete(`/user/address/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

export const getUserFavorites = async () => {
  try {
    const response = await axios.get('/user/favorite');
    return response;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

export const getUserSettings = async () => {
  if (!isAuthenticated()) {
    console.log('No authentication found, using default settings data');
    return { data: defaultData.settings };
  }
  
  try {
    const response = await axios.get('/user/settings');
    return response;
  } catch (error) {
    console.error('Error fetching settings:', error);
    console.log('Falling back to default settings data');
    return { data: defaultData.settings };
  }
};

export const updateUserSettings = async (settings) => {
  try {
    const response = await axios.put('/user/settings', settings);
    return response;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};