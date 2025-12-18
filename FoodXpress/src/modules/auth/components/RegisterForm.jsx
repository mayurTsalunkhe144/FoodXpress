import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import './RegisterForm.css';

export default function RegisterForm({ userType = 'customer', onSuccess }) {
  const { registerCustomer, registerRestaurant, registerAdmin, registerDeliveryBoy, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    description: '',
    address: '',
    cityId: '',
    stateId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      let response;
      
      if (userType === 'customer') {
        response = await registerCustomer(
          formData.fullName,
          formData.email,
          formData.phone,
          formData.password
        );
      } else if (userType === 'restaurant') {
        response = await registerRestaurant({
          restaurantName: formData.restaurantName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          description: formData.description,
          address: formData.address,
          cityId: parseInt(formData.cityId),
          stateId: parseInt(formData.stateId)
        });
      } else if (userType === 'admin') {
        response = await registerAdmin(
          formData.fullName,
          formData.email,
          formData.phone,
          formData.password
        );
      } else if (userType === 'delivery') {
        response = await registerDeliveryBoy(
          formData.fullName,
          formData.email,
          formData.phone,
          formData.password
        );
      }

      if (onSuccess) onSuccess(response);
    } catch (err) {
      setLocalError(error || 'Registration failed');
    }
  };

  return (
    <div className="register-form-container">
      <div className="register-form">
        <h2>Register as {userType.charAt(0).toUpperCase() + userType.slice(1)}</h2>
        
        {(localError || error) && (
          <div className="error-message">{localError || error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {userType === 'restaurant' ? (
            <>
              <div className="form-group">
                <label>Restaurant Name</label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  placeholder="Restaurant name"
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Restaurant description"
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Restaurant address"
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City ID</label>
                  <input
                    type="number"
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleChange}
                    placeholder="City ID"
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State ID</label>
                  <input
                    type="number"
                    name="stateId"
                    value={formData.stateId}
                    onChange={handleChange}
                    placeholder="State ID"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full name"
                disabled={loading}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? '👁️' : '👁️🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
