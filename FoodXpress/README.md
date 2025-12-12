# FoodXpress - React Application

A modular React application for food delivery management with team-based development structure.

## Quick Start

```bash
npm install
npm run dev
```

## Backend Integration

This application integrates with a .NET Core backend API. See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for detailed setup instructions.

### Backend Setup
1. Navigate to `../Team-Project/Food-Delivery-App/HomePageBackend/`
2. Run: `dotnet run`
3. Backend will be available at: `http://localhost:5142`

## Project Structure

```
src/
├── modules/
│   ├── auth/                    # Authentication & Authorization
│   ├── user-management/         # User profiles & management
│   ├── home-navigation/         # Navigation, header, home page
│   ├── order-management/        # Order processing & tracking
│   └── dashboard-analytics/     # Analytics, reports, dashboard
├── shared/                      # Shared components & utilities
├── pages/                       # Page components
└── styles/                      # Global styles
```

## Features

- **Modular Architecture**: Team-based module development
- **Backend Integration**: Full API integration with .NET Core backend
- **Responsive Design**: Mobile-first responsive components
- **Error Handling**: Comprehensive error boundaries and API error handling
- **Loading States**: Professional loading spinners and states

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

Each module has its own API service for backend communication:

```javascript
import { ApiService } from '@/modules/home-navigation';

// Fetch data
const restaurants = await ApiService.fetchRestaurants();
const categories = await ApiService.fetchCategories();
const popularDishes = await ApiService.fetchPopularMenuItems();
```

## Development

1. Each developer works in their assigned module
2. Use shared components from `/shared` folder
3. Export all module components through `index.js`
4. Follow consistent naming conventions

## Team Modules

| Module | Developer | Responsibility |
|--------|-----------|----------------|
| Auth | Janardhan | Authentication & Authorization |
| User Management | Tanushka | User profiles & management |
| Home & Navigation | Aryan | Navigation, header, home page |
| Order Management | Prathamesh | Order processing & tracking |
| Dashboard & Analytics | Mayur | Analytics, reports, dashboard |
