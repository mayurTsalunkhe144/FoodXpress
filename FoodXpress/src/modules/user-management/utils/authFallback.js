// Authentication fallback utility for user management
export const getAuthToken = () => {
  return localStorage.getItem('authToken') || null;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const getDefaultUserData = () => ({
  profile: {
    name: 'Demo User',
    email: 'demo@foodxpress.com',
    mobile: '9876543210'
  },
  addresses: [
    {
      id: 1,
      type: 'Home',
      address: '123 Demo Street, Apartment 4B',
      city: 'Bangalore',
      pincode: '560001',
      isDefault: true
    },
    {
      id: 2,
      type: 'Work',
      address: '456 Tech Park, Building C',
      city: 'Bangalore',
      pincode: '560066',
      isDefault: false
    }
  ],
  orders: [
    {
      orderId: 1,
      restaurantName: "Pizza Palace",
      totalAmount: 600,
      status: "Delivered",
      createdAt: "2025-12-15T17:17:05.497",
      items: ["Margherita Pizza", "Garlic Bread"]
    },
    {
      orderId: 2,
      restaurantName: "Burger King",
      totalAmount: 350,
      status: "Pending",
      createdAt: "2025-12-15T17:17:05.497",
      items: ["Whopper Burger", "Fries"]
    }
  ],
  settings: {
    notifications: true,
    emailUpdates: false,
    smsAlerts: true,
    language: 'English'
  }
});