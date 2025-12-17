import api from '../../../../lib/axios'

export function useAnalyticsApi() {
  const getDashboard = () => 
    api.get('/analytics/dashboard')

  const getAnalytics = (timeRange) => 
    api.get(`/analytics/dashboard?timeRange=${timeRange}`)

  return { getDashboard, getAnalytics }
}
