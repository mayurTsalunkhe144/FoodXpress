// Dashboard & Analytics Module - Mayur
// Export all dashboard and analytics components, hooks, and services

// Components
export { default as Dashboard } from './components/Dashboard.jsx';
export { default as Analytics } from './components/Analytics.jsx';
export { default as Charts } from './components/Charts.jsx';
export { default as Reports } from './components/Reports.jsx';

// Hooks
export { useDashboard } from './hooks/useDashboard.jsx';
export { useAnalytics } from './hooks/useAnalytics.jsx';

// Services
export * from './services/dashboardService.jsx';
export * from './services/analyticsService.jsx';

// Utils
export * from './utils/dashboardUtils.jsx';