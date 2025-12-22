// Simple in-memory cache for API data
class ApiCache {
  constructor() {
    this.cache = new Map();
    this.promises = new Map(); // Track ongoing requests
  }

  async get(key, fetchFunction) {
    // Return cached data if available
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Return ongoing promise if request is already in progress
    if (this.promises.has(key)) {
      return this.promises.get(key);
    }

    // Create new request promise
    const promise = fetchFunction()
      .then(data => {
        this.cache.set(key, data);
        this.promises.delete(key);
        return data;
      })
      .catch(error => {
        this.promises.delete(key);
        throw error;
      });

    this.promises.set(key, promise);
    return promise;
  }

  clear(key) {
    if (key) {
      this.cache.delete(key);
      this.promises.delete(key);
    } else {
      this.cache.clear();
      this.promises.clear();
    }
  }
}

// Create singleton instance
const apiCache = new ApiCache();

// Cached API functions
export const getStates = () => {
  return apiCache.get('states', async () => {
    const response = await fetch('https://foodorderingsystem-authentication.onrender.com/api/State/get');
    const data = await response.json();
    return data.filter(state => state.isActive);
  });
};

export const getCities = () => {
  return apiCache.get('cities', async () => {
    const response = await fetch('https://foodorderingsystem-authentication.onrender.com/api/City/get');
    const data = await response.json();
    return data.filter(city => city.isActive);
  });
};

export const clearCache = (key) => {
  apiCache.clear(key);
};