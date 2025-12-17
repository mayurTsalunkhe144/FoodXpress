const API_BASE_URL = 'https://fxbackend.onrender.com/api';
const REQUEST_TIMEOUT = 30000;

class ApiService {
  async makeRequest(url, options = {}, retries = 2) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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
      
      if (retries > 0 && (error.name === 'AbortError' || error.message.includes('fetch'))) {
        console.log(`Retrying request to ${url}, attempts left: ${retries}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.makeRequest(url, options, retries - 1);
      }
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - backend may be starting up, please try again');
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
      const items = await this.makeRequest(`${API_BASE_URL}/menuitems`);
      return items.sort((a, b) => (b.imageUrl ? 1 : 0) - (a.imageUrl ? 1 : 0)).slice(0, 6);
    } catch (error) {
      console.error('Error fetching popular menu items:', error);
      return [];
    }
  }

  async fetchMenuItemsByCategory(categoryId) {
    try {
      return await this.makeRequest(`${API_BASE_URL}/menuitems?categoryId=${categoryId}`);
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

  async fetchCategoriesByRestaurant(restaurantId) {
    try {
      return await this.makeRequest(`${API_BASE_URL}/categories?restaurantId=${restaurantId}`);
    } catch (error) {
      console.error('Error fetching categories by restaurant:', error);
      return [];
    }
  }
}

export default new ApiService();
