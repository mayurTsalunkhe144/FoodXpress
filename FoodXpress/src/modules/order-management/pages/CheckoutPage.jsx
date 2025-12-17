import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkoutApi, addressApi } from '../services/orderService.jsx';
import '../styles/shared.css';

const CheckoutPage = () => {
  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressLine: '',
    city: '',
    state: '',
    pinCode: '',
    type: 'Home',
    setAsDefault: false
  });
  const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCheckoutSummary();
  }, []);

  const fetchCheckoutSummary = async () => {
    setLoading(true);
    try {
      const response = await checkoutApi.getSummary();
      const data = response?.data || response;
      setCheckout(data);
      if (data?.defaultAddress) {
        setSelectedAddress(data.defaultAddress.addressId);
      }
    } catch (err) {
      console.error('Error fetching checkout:', err);
      setCheckout(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress && !showNewAddress) {
      alert('Please select an address');
      return;
    }

    const request = {
      addressId: showNewAddress ? undefined : selectedAddress || undefined,
      newAddress: showNewAddress ? newAddress : undefined,
      paymentMethod,
      saveAddress: showNewAddress
    };

    try {
      const response = await checkoutApi.placeOrder(request);
      navigate(`/order-status/${response.data.orderId}`);
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!checkout) return <div>Error loading checkout</div>;

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="page-header">
          <h1>Checkout</h1>
        </div>

        <div className="order-items">
          <h2>Your Order</h2>
          {checkout.restaurants?.map((restaurant) => (
            <div key={restaurant.restaurantId} className="restaurant-section">
              <h3>{restaurant.restaurantName}</h3>
              {restaurant.items?.map((item) => (
                <div key={item.cartItemId} className="order-item card p-md m-sm">
                  <div className="item-info">
                    <span className="item-name">{item.menuItemName}</span>
                    <span className="item-restaurant">from {item.restaurantName}</span>
                  </div>
                  <div className="item-details">
                    <span>Qty: {item.quantity}</span>
                    <span>₹{item.lineTotal}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="address-section">
          <h2>Delivery Address</h2>
          <div className="address-option">
            <input
              type="radio"
              name="address"
              checked={showNewAddress}
              onChange={() => setShowNewAddress(true)}
            />
            <span>Add New Address</span>
          </div>

          {showNewAddress && (
            <div className="new-address-form">
              <input
                type="text"
                placeholder="Address Line"
                value={newAddress.addressLine}
                onChange={(e) => setNewAddress({...newAddress, addressLine: e.target.value})}
                className="p-sm m-xs rounded-md"
              />
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                className="p-sm m-xs rounded-md"
              />
              <input
                type="text"
                placeholder="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                className="p-sm m-xs rounded-md"
              />
              <input
                type="text"
                placeholder="Pin Code"
                value={newAddress.pinCode}
                onChange={(e) => setNewAddress({...newAddress, pinCode: e.target.value})}
                className="p-sm m-xs rounded-md"
              />
            </div>
          )}
        </div>

        <div className="payment-section">
          <h2>Payment Method</h2>
          <div className="payment-option">
            <input
              type="radio"
              name="payment"
              value="CashOnDelivery"
              checked={paymentMethod === 'CashOnDelivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>💵 Cash on Delivery</span>
          </div>
        </div>

        <div className="order-summary card p-lg">
          <h2>Order Summary</h2>
          <div className="summary-line">
            <span>Subtotal:</span>
            <span>₹{checkout.subTotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="summary-line">
            <span>Delivery:</span>
            <span>₹{checkout.deliveryFee?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="summary-line">
            <span>Tax:</span>
            <span>₹{checkout.taxAmount?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="summary-line total">
            <span>Total:</span>
            <span>₹{checkout.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
          
          <button onClick={handlePlaceOrder} className="btn btn-primary">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;