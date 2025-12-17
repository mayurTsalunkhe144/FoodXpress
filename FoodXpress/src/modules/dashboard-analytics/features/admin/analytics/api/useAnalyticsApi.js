import api from '../../../../lib/axios'

export function useAnalyticsApi() {
  const getDashboard = () => 
    api.get('/admin-dashboard')

  const getAnalytics = (timeRange) => 
    api.get(`/admin/analytics?timeRange=${timeRange}`)

  return { getDashboard, getAnalytics }
}
