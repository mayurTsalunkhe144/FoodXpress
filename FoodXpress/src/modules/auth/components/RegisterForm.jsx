import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { validateEmail, validatePhone, validatePassword, validateFullName, validateConfirmPassword, calculatePasswordStrength } from '../utils/validators.js';
import { getStates, getCities } from '../services/cacheService.js';

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    // Only fetch states and cities when userType is restaurant
    if (userType === 'restaurant') {
      const fetchData = async () => {
        try {
          const [statesData, citiesData] = await Promise.all([
            getStates(),
            getCities()
          ]);
          
          setStates(statesData);
          setCities(citiesData);
        } catch (error) {
          console.error('Error fetching states and cities:', error);
        }
      };
      
      fetchData();
    }
  }, [userType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Filter cities when state changes
    if (name === 'stateId') {
      const filtered = cities.filter(city => city.stateId === parseInt(value));
      setFilteredCities(filtered);
      // Reset city selection when state changes
      setFormData(prev => ({ ...prev, cityId: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';
    
    if (userType === 'restaurant') {
      if (name === 'restaurantName' && !value) error = 'Restaurant name is required';
      if (name === 'description' && !value) error = 'Description is required';
      if (name === 'address' && !value) error = 'Address is required';
      if (name === 'stateId' && !value) error = 'State is required';
      if (name === 'cityId' && !value) error = 'City is required';
    } else {
      if (name === 'fullName') error = validateFullName(value);
    }
    
    if (name === 'email') error = validateEmail(value);
    if (name === 'phone') error = validatePhone(value);
    if (name === 'password') error = validatePassword(value);
    if (name === 'confirmPassword') error = validateConfirmPassword(formData.password, value);
    
    if (error) {
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (userType === 'restaurant') {
      if (!formData.restaurantName) errors.restaurantName = 'Restaurant name is required';
      if (!formData.description) errors.description = 'Description is required';
      if (!formData.address) errors.address = 'Address is required';
      if (!formData.cityId) errors.cityId = 'City ID is required';
      if (!formData.stateId) errors.stateId = 'State ID is required';
    } else {
      const nameError = validateFullName(formData.fullName);
      if (nameError) errors.fullName = nameError;
    }
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm()) {
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

  const authCardStyle = {
    background: 'var(--bg-primary)',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px'
  };

  const authTitleStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
    color: 'var(--primary-red)',
    fontSize: '1.5rem',
    fontWeight: '600'
  };

  const formGroupStyle = {
    marginBottom: '1rem'
  };

  const formLabelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: 'var(--text-primary)'
  };

  const formInputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
    fontFamily: 'var(--font-family)',
    background: 'white',
    color: 'black'
  };

  const formInputErrorStyle = {
    ...formInputStyle,
    borderColor: '#dc3545',
    background: 'white',
    color: 'black'
  };

  const formErrorStyle = {
    color: '#dc3545',
    fontSize: '0.875rem',
    marginTop: '0.25rem'
  };

  const passwordWrapperStyle = {
    position: 'relative'
  };

  const passwordToggleStyle = {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  };

  const btnStyle = {
    width: '100%',
    padding: '0.75rem',
    background: 'var(--primary-red)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '1rem'
  };

  const btnDisabledStyle = {
    ...btnStyle,
    opacity: '0.6',
    cursor: 'not-allowed'
  };

  const spinnerStyle = {
    width: '16px',
    height: '16px',
    border: '2px solid white',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  };

  return (
    <div style={authCardStyle}>
      <h2 style={authTitleStyle}>Register as {userType.charAt(0).toUpperCase() + userType.slice(1)}</h2>
      
      {(localError || error) && (
        <div className="error" style={{ marginBottom: '1rem' }}>{localError || error}</div>
      )}

      <form onSubmit={handleSubmit}>
          {userType === 'restaurant' ? (
            <>
              <div style={formGroupStyle}>
                <label style={formLabelStyle}>Restaurant Name <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Restaurant name"
                  disabled={loading}
                  required
                  style={fieldErrors.restaurantName ? formInputErrorStyle : formInputStyle}
                />
                {fieldErrors.restaurantName && (
                  <div style={formErrorStyle}>{fieldErrors.restaurantName}</div>
                )}
              </div>
              <div style={formGroupStyle}>
                <label style={formLabelStyle}>Description <span style={{ color: 'red' }}>*</span></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Restaurant description"
                  disabled={loading}
                  required
                  style={{
                    ...(fieldErrors.description ? formInputErrorStyle : formInputStyle),
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                />
                {fieldErrors.description && (
                  <div style={formErrorStyle}>{fieldErrors.description}</div>
                )}
              </div>
              <div style={formGroupStyle}>
                <label style={formLabelStyle}>Address <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Restaurant address"
                  disabled={loading}
                  required
                  style={fieldErrors.address ? formInputErrorStyle : formInputStyle}
                />
                {fieldErrors.address && (
                  <div style={formErrorStyle}>{fieldErrors.address}</div>
                )}
              </div>
              <div style={gridStyle}>
                <div style={formGroupStyle}>
                  <label style={formLabelStyle}>State <span style={{ color: 'red' }}>*</span></label>
                  <select
                    name="stateId"
                    value={formData.stateId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    required
                    style={fieldErrors.stateId ? formInputErrorStyle : formInputStyle}
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state.stateId} value={state.stateId}>
                        {state.stateName}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.stateId && (
                    <div style={formErrorStyle}>{fieldErrors.stateId}</div>
                  )}
                </div>
                <div style={formGroupStyle}>
                  <label style={formLabelStyle}>City <span style={{ color: 'red' }}>*</span></label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading || !formData.stateId}
                    required
                    style={fieldErrors.cityId ? formInputErrorStyle : formInputStyle}
                  >
                    <option value="">
                      {formData.stateId ? "Select City" : "Please select a state first"}
                    </option>
                    {filteredCities.map(city => (
                      <option key={city.cityId} value={city.cityId}>
                        {city.cityName}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.cityId && (
                    <div style={formErrorStyle}>{fieldErrors.cityId}</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div style={formGroupStyle}>
              <label style={formLabelStyle}>Full Name <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Full name"
                disabled={loading}
                required
                style={fieldErrors.fullName ? formInputErrorStyle : formInputStyle}
              />
              {fieldErrors.fullName && (
                <div style={formErrorStyle}>{fieldErrors.fullName}</div>
              )}
            </div>
          )}

          <div style={formGroupStyle}>
            <label style={formLabelStyle}>Email <span style={{ color: 'red' }}>*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email address"
              disabled={loading}
              required
              style={fieldErrors.email ? formInputErrorStyle : formInputStyle}
            />
            {fieldErrors.email && (
              <div style={formErrorStyle}>{fieldErrors.email}</div>
            )}
          </div>

          <div style={formGroupStyle}>
            <label style={formLabelStyle}>Phone <span style={{ color: 'red' }}>*</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Phone number"
              disabled={loading}
              required
              style={fieldErrors.phone ? formInputErrorStyle : formInputStyle}
            />
            {fieldErrors.phone && (
              <div style={formErrorStyle}>{fieldErrors.phone}</div>
            )}
          </div>

          <div style={formGroupStyle}>
            <label style={formLabelStyle}>Password <span style={{ color: 'red' }}>*</span></label>
            <div style={passwordWrapperStyle}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Password"
                disabled={loading}
                required
                style={{
                  ...(fieldErrors.password ? formInputErrorStyle : formInputStyle),
                  paddingRight: '40px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                style={passwordToggleStyle}
              >
                {showPassword ? '👁️' : '👁️'}
              </button>
            </div>
            {fieldErrors.password && (
              <div style={formErrorStyle}>{fieldErrors.password}</div>
            )}
            
            {formData.password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '12px', marginBottom: '4px', color: 'var(--primary-red)' }}>
                  Password Strength: {passwordStrength}%
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e5e5', borderRadius: '3px' }}>
                  <div style={{ 
                    width: `${passwordStrength}%`, 
                    height: '100%', 
                    backgroundColor: passwordStrength < 50 ? '#dc3545' : passwordStrength < 75 ? '#ffc107' : '#28a745', 
                    borderRadius: '3px', 
                    transition: 'all 0.3s ease' 
                  }}></div>
                </div>
              </div>
            )}
          </div>

          <div style={formGroupStyle}>
            <label style={formLabelStyle}>Confirm Password <span style={{ color: 'red' }}>*</span></label>
            <div style={passwordWrapperStyle}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Confirm password"
                disabled={loading}
                required
                style={{
                  ...(fieldErrors.confirmPassword ? formInputErrorStyle : formInputStyle),
                  paddingRight: '40px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                style={passwordToggleStyle}
              >
                {showConfirmPassword ? '👁️' : '👁️'}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <div style={formErrorStyle}>{fieldErrors.confirmPassword}</div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={loading ? btnDisabledStyle : btnStyle}
          >
            {loading && <div style={spinnerStyle}></div>}
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
