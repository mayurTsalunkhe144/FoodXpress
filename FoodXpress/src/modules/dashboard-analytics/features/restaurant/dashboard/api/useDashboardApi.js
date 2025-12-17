import api from '../../../../lib/axios'

export function useDashboardApi() {
  const getDashboard = (restaurantId) => 
    api.get(`/restaurant-dashboard/${restaurantId}`)

  return { getDashboard }
}


