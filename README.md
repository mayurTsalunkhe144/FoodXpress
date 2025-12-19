# FoodXpress - Modular React Application

A modular React application for food delivery management with team-based development structure.

## Team & Module Assignment

| Module | Developer | Responsibility |
|--------|-----------|----------------|
| Auth | Janardhan | Authentication & Authorization |
| User Management | Tanushka | User profiles & management |
| Home & Navigation | Aryan | Navigation, header, home page |
| Order Management | Prathamesh | Order processing & tracking |
| Dashboard & Analytics | Mayur | Analytics, reports, dashboard |

## Project Structure

```
FoodXpress/src/
├── modules/
│   ├── auth/                    # Janardhan's module
│   ├── user-management/         # Tanushka's module
│   ├── home-navigation/         # Aryan's module
│   ├── order-management/        # Prathamesh's module
│   └── dashboard-analytics/     # Mayur's module
├── shared/                      # Shared components & utilities
├── hooks/                       # Global hooks
├── services/                    # Global services
├── utils/                       # Global utilities
├── styles/                      # Global styles
└── constants/                   # Global constants
```

## Module Structure

Each module follows the same structure:
- `components/` - React components
- `hooks/` - Custom hooks
- `services/` - API services
- `utils/` - Helper functions
- `styles/` - Module-specific styles
- `index.js` - Main export file

## Usage

Import entire modules or specific components:

```jsx
// Import entire module
import { LoginForm, useAuth } from '@/modules/auth';

// Import shared components
import { Button, Modal } from '@/shared';
```

## Development Workflow

1. Each developer works in their assigned module
2. Use shared components from `/shared` folder
3. Export all module components through `index.js`
4. Follow consistent naming conventions
5. Add tests in respective module folders

## Getting Started

```bash
cd FoodXpress
npm install
npm run dev
```