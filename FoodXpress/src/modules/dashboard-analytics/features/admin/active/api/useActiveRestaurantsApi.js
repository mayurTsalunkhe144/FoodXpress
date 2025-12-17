import api from '../../../../lib/axios'

export function useActiveRestaurantsApi() {
  const getActive = () => 
    api.get('/admin/restaurants/active')

  return { getActive }
}


