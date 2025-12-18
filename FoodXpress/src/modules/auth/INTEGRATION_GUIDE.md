# Auth Module Integration Guide

## Overview
The auth module provides complete authentication functionality with login, registration for multiple user types, JWT token management, and protected routes.

## Components

### 1. AuthPage
Main page component that handles login/register mode switching.

```jsx
import AuthPage from '@/modules/auth/pages/AuthPage.jsx';

// In your router
<Route path="/auth" element={<AuthPage />} />
```

### 2. LoginForm
Standalone login form component.

```jsx
import LoginForm from '@/modules/auth/components/LoginForm.jsx';

<LoginForm onSuccess={(response) => {
  console.log('Login successful', response);
}} />
```

### 3. RegisterForm
Standalone registration form component.

```jsx
import RegisterForm from '@/modules/auth/components/RegisterForm.jsx';

<RegisterForm 
  userType="customer" // 'customer', 'restaurant', 'admin', 'delivery'
  onSuccess={(response) => {
    console.log('Registration successful', response);
  }} 
/>
```

### 4. ProtectedRoute
Wrapper component to protect routes that require authentication.

```jsx
import ProtectedRoute from '@/modules/auth/components/ProtectedRoute.jsx';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>

// With role-based access
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole={1}>
      <AdminPanel />
    </ProtectedRoute>
  } 
/>
```

## Hooks

### useAuth
Custom hook for authentication state and methods.

```jsx
import { useAuth } from '@/modules/auth/hooks/useAuth.jsx';

function MyComponent() {
  const { 
    user, 
    loading, 
    error, 
    login, 
    registerCustomer,
    registerRestaurant,
    registerAdmin,
    registerDeliveryBoy,
    logout,
    isAuthenticated 
  } = useAuth();

  return (
    // Your component
  );
}
```

## Services

### authService
Low-level authentication service with API calls.

```jsx
import { authService } from '@/modules/auth/services/authService.jsx';

// Login
const response = await authService.login('email@example.com', 'password');

// Register
const response = await authService.registerCustomer(
  'John Doe',
  'john@example.com',
  '1234567890',
  'password'
);

// Get stored user
const user = authService.getUser();

// Check authentication
if (authService.isAuthenticated()) {
  // User is logged in
}

// Logout
authService.logout();
```

## User Roles

- **1**: Admin
- **2**: Restaurant Owner
- **3**: Delivery Boy
- **4**: Customer

## API Endpoints

All endpoints are at: `https://fxbackend-auth.onrender.com/api`

### POST /auth/login
```json
{
  "identifier": "email@example.com or phone",
  "password": "password"
}
```

Response:
```json
{
  "token": "jwt_token",
  "email": "email@example.com",
  "fullName": "John Doe",
  "role": 4,
  "restaurantId": null
}
```

### POST /auth/register-customer
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password"
}
```

### POST /auth/register-restaurant
```json
{
  "restaurantName": "My Restaurant",
  "email": "restaurant@example.com",
  "phone": "1234567890",
  "password": "password",
  "description": "Restaurant description",
  "address": "123 Main St",
  "cityId": 1,
  "stateId": 1
}
```

### POST /auth/register-admin
```json
{
  "fullName": "Admin Name",
  "email": "admin@example.com",
  "phone": "1234567890",
  "password": "password"
}
```

### POST /auth/register-delivery-boy
```json
{
  "fullName": "Delivery Boy Name",
  "email": "delivery@example.com",
  "phone": "1234567890",
  "password": "password"
}
```

## Token Management

- JWT tokens are automatically stored in localStorage as `authToken`
- Tokens are automatically included in all API requests via axios interceptor
- On 401 response, user is redirected to `/auth` and token is cleared
- User data is stored in localStorage as `user` JSON object
- Restaurant ID (if applicable) is stored as `restaurantId`

## Features

✅ Login with email or phone
✅ Registration for 4 user types
✅ JWT token management
✅ Automatic token inclusion in requests
✅ 401 error handling with auto-redirect
✅ Protected routes with role-based access
✅ Error handling and loading states
✅ Modern UI with gradient styling
✅ Form validation
✅ Password confirmation

## Setup

1. Ensure backend is running at `https://fxbackend-auth.onrender.com/api`
2. Import AuthPage in your main router
3. Add ProtectedRoute wrapper to protected pages
4. Use useAuth hook in components that need auth state
