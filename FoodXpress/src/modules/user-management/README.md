# User Management Micro Frontend

This is the User Management micro frontend module for FoodXpress application.

## Features

- User Profile Management
- Order History
- Address Management
- User Settings
- Responsive Design

## Structure

```
user-management/
├── api/                    # API services
├── components/             # Reusable components
│   ├── profile/           # Profile-specific components
│   └── ui/                # Generic UI components
├── pages/                 # Page components
├── routes/                # Route configurations
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── UserManagementApp.jsx  # Main app component
└── index.js              # Entry point
```

## Usage

### As Standalone App
```jsx
import UserManagementApp from './UserManagementApp';

function App() {
  return <UserManagementApp />;
}
```

### As Routes in Main App
```jsx
import { UserRoutes } from '@foodxpress/user-management';

function App() {
  return (
    <Routes>
      <Route path="/user/*" element={<UserRoutes />} />
    </Routes>
  );
}
```

## Routes

- `/user/orders` - Order history
- `/user/edit` - Edit profile
- `/user/addresses` - Manage addresses
- `/user/settings` - User settings

## API Configuration

Update the API base URL in `api/userService.js`:
```javascript
const API_BASE = 'http://your-api-endpoint.com/api';
```