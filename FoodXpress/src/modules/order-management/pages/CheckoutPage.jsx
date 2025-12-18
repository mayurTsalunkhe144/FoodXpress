import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkoutApi, locationApi } from '../services/orderService.jsx';
import '../styles/shared.css';

const CheckoutPage = () => {
  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [newAddress, setNewAddress] = useState({
    addressLine: '',
    state: '',
    city: '',
    pinCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCheckoutSummary();
    fetchStates();
  }, []);

  useEffect(() => {
    if (newAddress.state) {
      fetchCities(newAddress.state);
      setNewAddress(prev => ({...prev, city: ''}));
    }
  }, [newAddress.state]);

  const fetchCheckoutSummary = async () => {
    setLoading(true);
    try {
      const response = await checkoutApi.getSummary();
      setCheckout(response);
      if (response?.defaultAddress?.addressId) {
        setSelectedAddress(response.defaultAddress.addressId);
      }
    } catch (err) {
      console.error('Error fetching checkout summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await locationApi.getStates();
      setStates(response);
    } catch (err) {
      console.error('Error fetching states:', err);
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const response = await locationApi.getCitiesByState(stateId);
      setCities(response);
    } catch (err) {
      console.error('Error fetching cities:', err);
      setCities([]);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress && !showNewAddress) {
      alert('Please select an address');
      return;
    }

    try {
      const response = await checkoutApi.placeOrder({
        addressId: selectedAddress,
        newAddress: showNewAddress ? newAddress : undefined,
        paymentMethod
      });
      console.log('Checkout response:', response);
      const orderId = response?.orderId || response?.data?.orderId;
      console.log('Order ID:', orderId);
      if (orderId) {
        navigate(`/order-tracking/${orderId}`);
      } else {
        alert('Order created but no order ID returned');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading checkout...</div>;
  if (!checkout) return <div style={{ padding: '40px', textAlign: 'center' }}>Error loading checkout.</div>;

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    color: '#000000'
  };

  const formContainerStyle = {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '15px',
    border: '1px solid #e0e0e0'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc' }}>
          <h2>Delivery Address</h2>
          {checkout.savedAddresses?.length > 0 ? (
            <>
              {checkout.savedAddresses.map((addr) => (
                <div key={addr.addressId} style={{ marginBottom: '10px' }}>
                  <label>
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress === addr.addressId}
                      onChange={() => {
                        setSelectedAddress(addr.addressId);
                        setShowNewAddress(false);
                      }}
                    />
                    {addr.addressLine}, {addr.city}, {addr.state} - {addr.pinCode}
                  </label>
                </div>
              ))}
            </>
          ) : (
            <p>No saved addresses</p>
          )}
          
          <div style={{ marginTop: '15px' }}>
            <label>
              <input
                type="radio"
                name="address"
                checked={showNewAddress}
                onChange={() => setShowNewAddress(true)}
              />
              Add New Address
            </label>
          </div>

          {showNewAddress && (
            <div style={formContainerStyle}>
              <div style={gridStyle}>
                <input
                  type="text"
                  placeholder="Address Line"
                  value={newAddress.addressLine}
                  onChange={(e) => setNewAddress({...newAddress, addressLine: e.target.value})}
                  style={{...inputStyle, gridColumn: '1 / -1'}}
                />
                <select
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                  style={inputStyle}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.stateId} value={state.stateId}>
                      {state.stateName}
                    </option>
                  ))}
                </select>
                <select
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                  style={inputStyle}
                  disabled={!newAddress.state}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.cityId} value={city.cityId}>
                      {city.cityName}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Pin Code"
                  value={newAddress.pinCode}
                  onChange={(e) => setNewAddress({...newAddress, pinCode: e.target.value})}
                  style={inputStyle}
                />
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc' }}>
          <h2>Payment Method</h2>
          {checkout.paymentOptions?.map((option) => (
            <div key={option.method} style={{ marginBottom: '10px' }}>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value={option.method}
                  checked={paymentMethod === option.method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {option.icon} {option.displayName}
              </label>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc' }}>
          <h2>Order Summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Subtotal:</span>
            <span>₹{checkout.subTotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Delivery:</span>
            <span>₹{checkout.deliveryFee?.toFixed(2) || '0.00'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Tax:</span>
            <span>₹{checkout.taxAmount?.toFixed(2) || '0.00'}</span>
          </div>
          {checkout.discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Discount:</span>
              <span>-₹{checkout.discountAmount?.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
            <span>Total:</span>
            <span>₹{checkout.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
          
          <button onClick={handlePlaceOrder} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
