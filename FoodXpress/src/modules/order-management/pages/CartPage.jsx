import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem.jsx';
import { cartApi } from '../services/orderService.jsx';
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
        const tokenUsername = payload.unique_name || payload.name || payload.username;
        if (tokenUsername) {
          return tokenUsername;
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
      const cartData = response?.data || response;
      
      setCart({
        items: cartData?.items || [],
        subTotal: cartData?.subTotal || 0,
        deliveryFee: cartData?.deliveryFee || 0,
        taxAmount: cartData?.taxAmount || 0,
        totalAmount: cartData?.totalAmount || 0,
        totalItems: cartData?.totalItems || 0
      });
    } catch (err) {
      console.error('Error fetching cart:', err);
      setCart({
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

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    try {
      const response = await cartApi.updateItem(cartItemId, { quantity: newQuantity });
      const cartData = response?.data || response;
      setCart(prev => ({
        ...prev,
        items: cartData?.items || [],
        totalAmount: cartData?.totalAmount || 0,
        subTotal: cartData?.subTotal || 0,
        totalItems: cartData?.totalItems || 0
      }));
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      const response = await cartApi.removeItem(cartItemId);
      const cartData = response?.data || response;
      setCart(prev => ({
        ...prev,
        items: cartData?.items || [],
        totalAmount: cartData?.totalAmount || 0,
        subTotal: cartData?.subTotal || 0,
        totalItems: cartData?.totalItems || 0
      }));
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  if (loading) return <div className="loading" style={{ padding: '40px', textAlign: 'center' }}>Loading cart...</div>;

  const isEmpty = !cart || (cart.items || []).length === 0;

  if (isEmpty) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="page-header">
            <h1>Welcome {username} to Cart</h1>
          </div>
          <div className="empty-cart" style={{ textAlign: 'center', padding: '40px' }}>
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

        <div className="items-section">
          {(cart.items || []).map((item) => (
            <CartItem 
              key={item.cartItemId} 
              item={item} 
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem} 
            />
          ))}
        </div>

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
