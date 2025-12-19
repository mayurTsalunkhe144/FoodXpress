import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { validateEmail, validatePhone } from '../utils/validators.js';

export default function LoginForm({ onSuccess }) {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!identifier) {
      errors.identifier = 'Email or phone is required';
    } else if (identifier.includes('@')) {
      const emailError = validateEmail(identifier);
      if (emailError) errors.identifier = emailError;
    } else {
      const phoneError = validatePhone(identifier);
      if (phoneError) errors.identifier = phoneError;
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }
    
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
      const response = await login(identifier, password);
      
      // Navigate based on role
      if (response.role === 1) {
        // Admin
        navigate('/dashboard/admin', { replace: true });
      } else if (response.role === 3) {
        // Restaurant Owner
        navigate('/dashboard/restaurant', { replace: true });
      } else {
        // Customer or DeliveryBoy - go to home
        navigate('/', { replace: true });
      }
      
      if (onSuccess) onSuccess(response);
    } catch (err) {
      setLocalError(error || 'Login failed');
    }
  };

  const authContainerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white',
    padding: '2rem'
  };

  const authCardStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px'
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
    gap: '8px'
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

  return (
    <div style={authContainerStyle}>
      <div style={authCardStyle}>
        <h2 style={authTitleStyle}>Login</h2>
        
        {(localError || error) && (
          <div className="error" style={{ marginBottom: '1rem' }}>{localError || error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={formLabelStyle}>Email or Phone <span style={{ color: 'red' }}>*</span></label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (fieldErrors.identifier) {
                  setFieldErrors(prev => ({ ...prev, identifier: '' }));
                }
              }}
              onBlur={() => {
                if (!identifier) {
                  setFieldErrors(prev => ({ ...prev, identifier: 'Email or phone is required' }));
                } else if (identifier.includes('@')) {
                  const emailError = validateEmail(identifier);
                  if (emailError) setFieldErrors(prev => ({ ...prev, identifier: emailError }));
                } else {
                  const phoneError = validatePhone(identifier);
                  if (phoneError) setFieldErrors(prev => ({ ...prev, identifier: phoneError }));
                }
              }}
              placeholder="Enter email or phone"
              disabled={loading}
              required
              style={fieldErrors.identifier ? formInputErrorStyle : formInputStyle}
            />
            {fieldErrors.identifier && (
              <div style={formErrorStyle}>{fieldErrors.identifier}</div>
            )}
          </div>

          <div style={formGroupStyle}>
            <label style={formLabelStyle}>Password <span style={{ color: 'red' }}>*</span></label>
            <div style={passwordWrapperStyle}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
                onBlur={() => {
                  if (!password) {
                    setFieldErrors(prev => ({ ...prev, password: 'Password is required' }));
                  }
                }}
                placeholder="Enter password"
                disabled={loading}
                required
                style={{
                  ...(fieldErrors.password ? formInputErrorStyle : formInputStyle),
                  paddingRight: '40px'
                }}
              />
              <button
                type="button"
                style={passwordToggleStyle}
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️'}
              </button>
            </div>
            {fieldErrors.password && (
              <div style={formErrorStyle}>{fieldErrors.password}</div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={loading ? btnDisabledStyle : btnStyle}
          >
            {loading && <div style={spinnerStyle}></div>}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
