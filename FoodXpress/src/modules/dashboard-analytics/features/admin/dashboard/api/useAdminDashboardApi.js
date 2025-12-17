import api from '../../../../lib/axios'

export function useAdminDashboardApi() {
  const getDashboard = () => 
    api.get('/admin-dashboard')

  return { getDashboard }
}


