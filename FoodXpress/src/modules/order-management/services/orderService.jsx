const API_BASE_URL = 'http://cartcheckoutapi.runasp.net/api';

export class ApiService {
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
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

// Cart API
export const cartApi = {
  get: () => apiService.request('/Cart'),
  addItem: (data) => apiService.request('/Cart/items', { method: 'POST', body: JSON.stringify(data) }),
  updateItem: (itemId, data) => apiService.request(`/Cart/items/${itemId}`, { method: 'PUT', body: JSON.stringify(data) }),
  removeItem: (itemId) => apiService.request(`/Cart/items/${itemId}`, { method: 'DELETE' }),
  clearCart: () => apiService.request('/Cart', { method: 'DELETE' })
};

// Checkout API
export const checkoutApi = {
  getSummary: () => apiService.request('/Checkout/summary'),
  placeOrder: (data) => apiService.request('/Checkout', { method: 'POST', body: JSON.stringify(data) })
};

// Address API
export const addressApi = {
  getMyAddresses: () => apiService.request('/Addresses/my'),
  save: (data) => apiService.request('/Addresses', { method: 'POST', body: JSON.stringify(data) })
};

// Order API
export const orderApi = {
  getMyOrders: () => apiService.request('/Orders/my-orders'),
  getOrderById: (orderId) => apiService.request(`/Orders/${orderId}`),
  updateStatus: (orderId, status) => apiService.update('Dynamic/Orders', orderId, { status })
};