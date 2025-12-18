import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.jsx';
import LoginForm from '../components/LoginForm.jsx';
import RegisterForm from '../components/RegisterForm.jsx';
import './AuthPage.css';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [userType, setUserType] = useState('customer');
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to home
    if (authService.isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleLoginSuccess = (response) => {
    // Navigation is handled in LoginForm
  };

  const handleRegisterSuccess = (response) => {
    alert(response.message || 'Registration successful!');
    setMode('login');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-tabs">
          <button
            className={`tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        {mode === 'login' ? (
          <LoginForm onSuccess={handleLoginSuccess} />
        ) : (
          <>
            <div className="user-type-selector">
              <label>Register as:</label>
              <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                <option value="customer">Customer</option>
                <option value="restaurant">Restaurant</option>
                <option value="admin">Admin</option>
                <option value="delivery">Delivery Boy</option>
              </select>
            </div>
            <RegisterForm userType={userType} onSuccess={handleRegisterSuccess} />
          </>
        )}
      </div>
    </div>
  );
}
