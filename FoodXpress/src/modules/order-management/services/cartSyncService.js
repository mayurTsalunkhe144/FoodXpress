const HOME_API_BASE_URL = 'https://cartcheckoutorder-backend-2.onrender.com/api';
// const REMOTE_API_BASE_URL = 'http://cartcheckoutapi.runasp.net/api';

class CartSyncService {
  getAuthHeaders() {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async syncCartToRemote() {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      // Get cart from home backend
      const homeResponse = await fetch(`${HOME_API_BASE_URL}/cart/${userId}`);
      if (!homeResponse.ok) return;
      
      const homeCart = await homeResponse.json();
      const items = homeCart?.data?.items || homeCart?.items || [];

      // Add each item to remote cart
      for (const item of items) {
        try {
          await fetch(`${REMOTE_API_BASE_URL}/cart/items`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...this.getAuthHeaders(),
            },
            body: JSON.stringify({
              menuItemId: item.menuItemId,
              quantity: item.quantity
            })
          });
        } catch (err) {
          console.error('Error syncing item:', err);
        }
      }
    } catch (err) {
      console.error('Error syncing cart:', err);
    }
  }
}

export default new CartSyncService();
