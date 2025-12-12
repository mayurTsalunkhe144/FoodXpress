const API_BASE_URL = 'http://localhost:5142/api';
const REQUEST_TIMEOUT = 10000;

class ApiService {
  async makeRequest(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      }
      throw error;
    }
  }

  async fetchRestaurants() {
    try {
      return await this.makeRequest(`${API_BASE_URL}/restaurants`);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  }

  async fetchRestaurant(id) {
    try {
      return await this.makeRequest(`${API_BASE_URL}/restaurants/${id}`);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      return null;
    }
  }

  async fetchMenuItems() {
    try {
      return await this.makeRequest(`${API_BASE_URL}/menuitems`);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  }

  async fetchPopularMenuItems() {
    try {
      return await this.makeRequest(`${API_BASE_URL}/menuitems/popular`);
    } catch (error) {
      console.error('Error fetching popular menu items:', error);
      return [];
    }
  }

  async fetchMenuItemsByCategory(category) {
    try {
      return await this.makeRequest(`${API_BASE_URL}/menuitems/category/${encodeURIComponent(category)}`);
    } catch (error) {
      console.error('Error fetching menu items by category:', error);
      return [];
    }
  }

  async fetchCategories() {
    try {
      return await this.makeRequest(`${API_BASE_URL}/categories`);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
}

export default new ApiService();