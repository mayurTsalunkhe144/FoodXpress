import api from '../../../../lib/axios'

export function useCategoriesApi() {
  const getAll = () => 
    api.get('/categories/all')

  const getByRestaurant = (restaurantId) => 
    api.get(`/categories?restaurantId=${restaurantId}`)

  return { getAll, getByRestaurant }
}
