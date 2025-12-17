import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartApi, apiService } from '../services/orderService.jsx';
import CartItem from '../components/CartItem.jsx';
import '../styles/shared.css';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const getUsernameFromToken = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // First try to get username from token
        const tokenUsername = payload.unique_name || payload.name || payload.username;
        if (tokenUsername) {
          return tokenUsername;
        }
        
        // If no username in token, fetch from database using userId
        const userId = payload.sub || payload.userId || payload.id;
        if (userId) {
          try {
            const response = await apiService.getById('Dynamic/Users', userId);
            return response.name || response.username || response.firstName || 'User';
          } catch (error) {
            console.error('Error fetching user from database:', error);
            return 'User';
          }
        }
        
        return 'User';
      } catch (error) {
        console.error('Error parsing token:', error);
        return 'User';
      }
    }
    return 'User';
  };

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await cartApi.get();
      const data = response?.data || response;
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      // Set empty cart structure for unauthenticated users
      setCart({
        restaurants: [],
        items: [],
        subTotal: 0,
        deliveryFee: 0,
        taxAmount: 0,
        totalAmount: 0,
        totalItems: 0
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadUsername = async () => {
      const user = await getUsernameFromToken();
      setUsername(user);
      document.title = `Welcome ${user} to cart`;
    };
    
    loadUsername();
    fetchCart();
  }, [fetchCart]);

  const recalculateCart = (currentCart) => {
    const newCart = { ...currentCart };
    const allItems = newCart.restaurants.flatMap(r => r.items).concat(newCart.items || []);
    
    newCart.subTotal = allItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    newCart.totalItems = allItems.reduce((acc, item) => acc + item.quantity, 0);
    newCart.taxAmount = newCart.subTotal * 0.1;
    newCart.totalAmount = newCart.subTotal + newCart.deliveryFee + newCart.taxAmount;

    return newCart;
  };

  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    setCart(prevCart => {
      if (!prevCart) return null;

      const newCart = { ...prevCart };
      const itemToUpdate = 
        newCart.items?.find(i => i.cartItemId === cartItemId) ||
        newCart.restaurants.flatMap(r => r.items).find(i => i.cartItemId === cartItemId);

      if (itemToUpdate) {
        itemToUpdate.quantity = newQuantity;
        itemToUpdate.lineTotal = itemToUpdate.unitPrice * newQuantity;
      }

      return recalculateCart(newCart);
    });
  };

  const handleRemoveItem = (cartItemId) => {
    setCart(prevCart => {
      if (!prevCart) return null;

      let newCart = { ...prevCart };
      newCart.items = newCart.items?.filter(i => i.cartItemId !== cartItemId) || [];
      newCart.restaurants = newCart.restaurants.map(r => ({
        ...r,
        items: r.items.filter(i => i.cartItemId !== cartItemId)
      })).filter(r => r.items.length > 0);

      return recalculateCart(newCart);
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  const isEmpty = !cart || (cart.restaurants.length === 0 && cart.items?.length === 0);

  if (isEmpty) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="page-header">
            <h1>Welcome {username} to Cart</h1>
          </div>
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add food items to your cart to continue</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>Welcome {username} to Cart ({cart.totalItems} items)</h1>
        </div>

        {cart.items && cart.items.length > 0 && (
          <div className="items-section">
            {cart.items.map((item) => (
              <CartItem 
                key={item.cartItemId} 
                item={item} 
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem} 
              />
            ))}
          </div>
        )}

        {cart.restaurants.map((restaurant) => (
          <div key={restaurant.restaurantId} className="restaurant-section">
            <h3>{restaurant.restaurantName}</h3>
            {restaurant.items.map((item) => (
              <CartItem 
                key={item.cartItemId} 
                item={item} 
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
        ))}

        <div className="cart-summary">
          <div className="summary-line">
            <span>Subtotal: ₹{cart.subTotal.toFixed(2)}</span>
          </div>
          <div className="summary-line">
            <span>Delivery: ₹{cart.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="summary-line">
            <span>Tax: ₹{cart.taxAmount.toFixed(2)}</span>
          </div>
          <div className="summary-line total">
            <span>Total: ₹{cart.totalAmount.toFixed(2)}</span>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn btn-primary">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;