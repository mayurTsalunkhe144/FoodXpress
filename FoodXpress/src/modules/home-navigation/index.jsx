// Home & Navigation Module - Aryan
// Export all home and navigation components, hooks, and services

// Components
export { default as Header } from './components/Header.jsx';
export { default as Navbar } from './components/Navbar.jsx';
export { default as HomePage } from './components/HomePage.jsx';
export { default as FeaturedCategories } from './components/FeaturedCategories.jsx';
export { default as PopularDishes } from './components/PopularDishes.jsx';
export { default as HowItWorks } from './components/HowItWorks.jsx';
export { default as TopRestaurants } from './components/TopRestaurants.jsx';
export { default as Testimonials } from './components/Testimonials.jsx';

// Hooks
export { useNavigation } from './hooks/useNavigation.jsx';
export { useMenu } from './hooks/useMenu.jsx';

// Services
export { default as ApiService } from './services/apiService.jsx';

// Utils
export * from './utils/navigationUtils.jsx';