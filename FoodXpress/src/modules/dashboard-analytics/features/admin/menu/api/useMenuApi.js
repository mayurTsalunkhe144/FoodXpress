import api from '../../../../lib/axios'

export function useMenuApi() {
  const getAll = () => 
    api.get('/menu-items/all')

  const getByRestaurant = (restaurantId) => 
    api.get(`/menu-items?restaurantId=${restaurantId}`)

  return { getAll, getByRestaurant }
}
