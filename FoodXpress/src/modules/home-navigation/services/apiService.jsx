const API_BASE_URL = 'https://fxbackend.onrender.com/api';
const REQUEST_TIMEOUT = 30000; // Increased timeout for deployed backend

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
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return this.makeRequest(url, options, retries - 1);
      }
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - backend may be starting up, please try again');
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
      // Return fallback data for development
      return [
        { id: 1, name: 'Sample Restaurant 1', cuisine: 'Italian', rating: 4.5 },
        { id: 2, name: 'Sample Restaurant 2', cuisine: 'Chinese', rating: 4.2 },
        { id: 3, name: 'Sample Restaurant 3', cuisine: 'Indian', rating: 4.7 }
      ];
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
      // Fallback to regular menu items if popular endpoint doesn't exist
      const items = await this.makeRequest(`${API_BASE_URL}/menuitems`);
      return items.slice(0, 6); // Return first 6 as "popular"
    } catch (error) {
      console.error('Error fetching popular menu items:', error);
      // Return fallback data for development
      return [
        { id: 1, name: 'Margherita Pizza', price: 299, restaurant: 'Sample Restaurant 1' },
        { id: 2, name: 'Chicken Biryani', price: 349, restaurant: 'Sample Restaurant 2' },
        { id: 3, name: 'Pasta Alfredo', price: 279, restaurant: 'Sample Restaurant 3' }
      ];
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

  // Category endpoints
  async fetchCategories() {
    try {
      return await this.makeRequest(`${API_BASE_URL}/categories`);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return fallback data for development
      return [
        { id: 1, name: 'Pizza', icon: '🍕' },
        { id: 2, name: 'Burgers', icon: '🍔' },
        { id: 3, name: 'Chinese', icon: '🥡' },
        { id: 4, name: 'Indian', icon: '🍛' },
        { id: 5, name: 'Desserts', icon: '🍰' }
      ];
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