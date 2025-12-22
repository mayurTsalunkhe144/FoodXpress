import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.jsx';
import LoginForm from '../components/LoginForm.jsx';
import RegisterForm from '../components/RegisterForm.jsx';

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

  const authContainerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-secondary)',
    padding: '2rem'
  };

  const authWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '600px',
    width: '100%'
  };

  const tabsStyle = {
    display: 'flex',
    marginBottom: '0rem',
    background: 'var(--bg-primary)',
    borderRadius: '12px',
    padding: '4px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  };

  const tabStyle = {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'var(--font-family)'
  };

  const activeTabStyle = {
    ...tabStyle,
    background: 'var(--primary-red)',
    color: 'white'
  };

  const inactiveTabStyle = {
    ...tabStyle,
    background: 'transparent',
    color: 'var(--text-primary)'
  };

  const userTypeSelectorStyle = {
    background: 'var(--bg-primary)',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    marginBottom: '1rem',
    width: '100%',
    maxWidth: '500px'
  };

  const selectStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'var(--font-family)',
    background: 'var(--bg-primary)',
    color: 'black'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: 'var(--text-primary)'
  };

  return (
    <div style={authContainerStyle}>
      <div style={authWrapperStyle}>
        <div style={tabsStyle}>
          <button
            onClick={() => setMode('login')}
            style={mode === 'login' ? activeTabStyle : inactiveTabStyle}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            style={{
              ...(mode === 'register' ? activeTabStyle : inactiveTabStyle),
              marginLeft: '4px'
            }}
          >
            Register
          </button>
        </div>

        {mode === 'login' ? (
          <div style={{ marginTop: '0.25rem' }}>
            <LoginForm onSuccess={handleLoginSuccess} />
          </div>
        ) : (
          <>
            <div style={userTypeSelectorStyle}>
              <label style={labelStyle}>Register as:</label>
              <select 
                value={userType} 
                onChange={(e) => setUserType(e.target.value)}
                style={selectStyle}
              >
                <option value="customer">Customer</option>
                <option value="restaurant">Restaurant</option>
              </select>
            </div>
            <RegisterForm userType={userType} onSuccess={handleRegisterSuccess} />
          </>
        )}
      </div>
    </div>
  );
}
