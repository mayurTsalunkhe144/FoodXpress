import api from '../../../../lib/axios'

export function useRejectedRestaurantsApi() {
  const getRejected = () => 
    api.get('/admin/restaurants/rejected')

  return { getRejected }
}


