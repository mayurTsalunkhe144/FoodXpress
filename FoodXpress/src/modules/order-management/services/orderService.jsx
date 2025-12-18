const LOCAL_API_BASE_URL = 'https://cartcheckoutorder-backend-2.onrender.com/api';
const API_BASE_URL = window.__API_BASE_URL__ || LOCAL_API_BASE_URL;

const getHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const getToken = () => localStorage.getItem('authToken') || localStorage.getItem('token');
const getUserId = () => localStorage.getItem('userId');

export class ApiService {
  getAuthHeaders() {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required: No auth token found. Please log in.');
    }
    return { 'Authorization': `Bearer ${token}` };
  }

  async request(endpoint, options = {}, baseUrl = API_BASE_URL) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options?.headers,
      };
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers,
        ...options,
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized: Invalid or missing auth token');
          localStorage.removeItem('authToken');
          localStorage.removeItem('token');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getAll(entityName) {
    return this.request(`/${entityName}`);
  }

  async getById(entityName, id) {
    return this.request(`/${entityName}/${id}`);
  }

  async create(entityName, data) {
    return this.request(`/${entityName}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(entityName, id, data) {
    return this.request(`/${entityName}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(entityName, id) {
    await this.request(`/${entityName}/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();

// Cart API - Local Backend
export const cartApi = {
  get: () => {
    const userId = getUserId();
    const token = getToken();
    if (!userId) throw new Error('User not authenticated');
    return fetch(`${LOCAL_API_BASE_URL}/cart/user/${userId}`, {
      headers: getHeaders(token)
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  },
  addItem: (data) => {
    const userId = getUserId();
    const token = getToken();
    if (!userId) throw new Error('User not authenticated');
    return fetch(`${LOCAL_API_BASE_URL}/cart/add?userId=${userId}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  },
  validateItem: (data) => {
    const userId = getUserId();
    const token = getToken();
    if (!userId) throw new Error('User not authenticated');
    return fetch(`${LOCAL_API_BASE_URL}/cart/validate?userId=${userId}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  },
  updateItem: (itemId, data) => {
    const userId = getUserId();
    const token = getToken();
    if (!userId) throw new Error('User not authenticated');
    return fetch(`${LOCAL_API_BASE_URL}/cart/item/${itemId}?userId=${userId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  },
  removeItem: (itemId) => {
    const userId = getUserId();
    const token = getToken();
    if (!userId) throw new Error('User not authenticated');
    return fetch(`${LOCAL_API_BASE_URL}/cart/item/${itemId}?userId=${userId}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  },
  clearCart: () => {
    const userId = getUserId();
    const token = getToken();
    if (!userId) throw new Error('User not authenticated');
    return fetch(`${LOCAL_API_BASE_URL}/cart/clear?userId=${userId}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  }
};

// Checkout API
export const checkoutApi = {
  getSummary: () => {
    const userId = getUserId();
    const token = getToken();
    if (!userId) throw new Error('User not authenticated');
    return fetch(`${LOCAL_API_BASE_URL}/checkout/summary?userId=${userId}`, {
      headers: getHeaders(token)
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  },
  applyPromo: (promoCode) => {
    const userId = getUserId();
    const token = getToken();
    if (!userId) throw new Error('User not authenticated');
    return fetch(`${LOCAL_API_BASE_URL}/checkout/apply-promo?userId=${userId}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(promoCode)
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  },
  placeOrder: (data) => {
    const userId = getUserId();
    const token = getToken();
    if (!userId) throw new Error('User not authenticated');
    return fetch(`${LOCAL_API_BASE_URL}/checkout?userId=${userId}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  }
};

// Address API
export const addressApi = {
  getMyAddresses: () => {
    const userId = getUserId();
    const token = getToken();
    if (!userId) throw new Error('User not authenticated');
    return fetch(`${LOCAL_API_BASE_URL}/addresses/my?userId=${userId}`, {
      headers: getHeaders(token)
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  },
  save: (data) => {
    const userId = getUserId();
    const token = getToken();
    if (!userId) throw new Error('User not authenticated');
    return fetch(`${LOCAL_API_BASE_URL}/addresses?userId=${userId}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  }
};

// Location API
export const locationApi = {
  getStates: () => {
    return fetch(`${LOCAL_API_BASE_URL}/location/states`, {
      headers: getHeaders(getToken())
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  },
  getCitiesByState: (stateId) => {
    return fetch(`${LOCAL_API_BASE_URL}/location/cities/${stateId}`, {
      headers: getHeaders(getToken())
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  }
};

// Order API
export const orderApi = {
  getMyOrders: () => {
    const userId = getUserId();
    const token = getToken();
    if (!userId) throw new Error('User not authenticated');
    return fetch(`${LOCAL_API_BASE_URL}/orders/my-orders?userId=${userId}`, {
      headers: getHeaders(token)
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  },
  getOrderById: (orderId) => {
    const userId = getUserId();
    const token = getToken();
    if (!userId) throw new Error('User not authenticated');
    return fetch(`${LOCAL_API_BASE_URL}/orders/${orderId}?userId=${userId}`, {
      headers: getHeaders(token)
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  },
  getOrderTracking: (orderId) => {
    const userId = getUserId();
    const token = getToken();
    if (!userId) throw new Error('User not authenticated');
    return fetch(`${LOCAL_API_BASE_URL}/orders/${orderId}/tracking?userId=${userId}`, {
      headers: getHeaders(token)
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  },
  updateStatus: (orderId, status) => {
    const userId = getUserId();
    const token = getToken();
    if (!userId) throw new Error('User not authenticated');
    return fetch(`${LOCAL_API_BASE_URL}/orders/${orderId}/status?userId=${userId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ status })
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)));
  }
};
