import axios from 'axios';

const AUTH_API = 'http://localhost:5094/api';

const authAPI = axios.create({
  baseURL: AUTH_API,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to all requests
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('customerId');
      localStorage.removeItem('restaurantId');
      localStorage.removeItem('adminId');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(identifier, password) {
    const response = await authAPI.post('/auth/login', {
      identifier,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('userId', response.data.userId);
      
      // Store role-specific IDs
      if (response.data.customerId) {
        localStorage.setItem('customerId', response.data.customerId);
      }
      if (response.data.restaurantId) {
        localStorage.setItem('restaurantId', response.data.restaurantId);
      }
      if (response.data.adminId) {
        localStorage.setItem('adminId', response.data.adminId);
      }
    }
    return response.data;
  },

  async registerCustomer(fullName, email, phone, password) {
    const response = await authAPI.post('/auth/register-customer', {
      fullName,
      email,
      phone,
      password
    });
    return response.data;
  },

  async registerRestaurant(restaurantName, email, phone, password, description, address, cityId, stateId) {
    const response = await authAPI.post('/auth/register-restaurant', {
      restaurantName,
      email,
      phone,
      password,
      description,
      address,
      cityId,
      stateId
    });
    return response.data;
  },

  async registerAdmin(fullName, email, phone, password) {
    const response = await authAPI.post('/auth/register-admin', {
      fullName,
      email,
      phone,
      password
    });
    return response.data;
  },

  async registerDeliveryBoy(fullName, email, phone, password) {
    const response = await authAPI.post('/auth/register-delivery-boy', {
      fullName,
      email,
      phone,
      password
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('customerId');
    localStorage.removeItem('restaurantId');
    localStorage.removeItem('adminId');
  },

  getToken() {
    return localStorage.getItem('authToken');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getUserId() {
    return localStorage.getItem('userId');
  },

  getCustomerId() {
    return localStorage.getItem('customerId');
  },

  getRestaurantId() {
    return localStorage.getItem('restaurantId');
  },

  getAdminId() {
    return localStorage.getItem('adminId');
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
};
