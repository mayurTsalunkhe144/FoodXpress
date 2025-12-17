import api from '../../../../lib/axios'

export function usePendingRestaurantsApi() {
  const getPending = () => 
    api.get('/admin/restaurants/pending')

  return { getPending }
}


