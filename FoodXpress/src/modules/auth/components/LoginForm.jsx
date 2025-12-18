import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import './LoginForm.css';

export default function LoginForm({ onSuccess }) {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!identifier || !password) {
      setLocalError('Please fill in all fields');
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

  return (
    <div className="login-form-container">
      <div className="login-form">
        <h2>Login</h2>
        
        {(localError || error) && (
          <div className="error-message">{localError || error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email or Phone</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter email or phone"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={loading}
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

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
