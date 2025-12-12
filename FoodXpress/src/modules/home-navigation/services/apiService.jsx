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

  // Restaurant endpoints
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

  // Menu item endpoints
  async fetchMenuItems() {
    try {
      return await this.makeRequest(`${API_BASE_URL}/menuitems`);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  }

  async fetchMenuItem(id) {
    try {
      return await this.makeRequest(`${API_BASE_URL}/menuitems/${id}`);
    } catch (error) {
      console.error('Error fetching menu item:', error);
      return null;
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

  // Category endpoints
  async fetchCategories() {
    try {
      return await this.makeRequest(`${API_BASE_URL}/categories`);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Seed data endpoints
  async getSeedStatus() {
    try {
      return await this.makeRequest(`${API_BASE_URL}/seed/status`);
    } catch (error) {
      console.error('Error fetching seed status:', error);
      return { RestaurantCount: 0, MenuItemCount: 0 };
    }
  }

  async seedDatabase() {
    try {
      return await this.makeRequest(`${API_BASE_URL}/seed`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  }
}

export default new ApiService();