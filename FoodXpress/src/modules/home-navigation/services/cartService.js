const HOME_API_BASE_URL = 'http://localhost:5142/api';

class CartService {
  async addItem(data) {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User not authenticated');
    
    const response = await fetch(`${HOME_API_BASE_URL}/cart/add?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getCart() {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User not authenticated');
    
    const response = await fetch(`${HOME_API_BASE_URL}/cart/${userId}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async removeItem(itemId) {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User not authenticated');
    
    const response = await fetch(`${HOME_API_BASE_URL}/cart/item/${itemId}?userId=${userId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async clearCart() {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User not authenticated');
    
    const response = await fetch(`${HOME_API_BASE_URL}/cart/clear?userId=${userId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export default new CartService();
