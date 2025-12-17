import api from '../../../../lib/axios'

export function useRestaurantsApi() {
  const getAll = () => 
    api.get('/admin/restaurants/all')

  const getById = (restaurantId) =>
    api.get(`/admin/restaurants/${restaurantId}`)

  const approve = (restaurantId) => 
    api.post(`/admin/restaurants/${restaurantId}/approve`)

  const reject = (restaurantId, reason) => 
    api.post(`/admin/restaurants/${restaurantId}/reject`, { reason })

  const activate = (restaurantId) => 
    api.post(`/admin/restaurants/${restaurantId}/activate`)

  const deactivate = (restaurantId) => 
    api.post(`/admin/restaurants/${restaurantId}/deactivate`)

  const updateRestaurant = (restaurantId, data) => 
    api.put(`/admin/restaurants/${restaurantId}`, data)

  const deleteRestaurant = (restaurantId) => 
    api.delete(`/admin/restaurants/${restaurantId}`)

  const getMenu = (restaurantId) => 
    api.get(`/admin/restaurants/${restaurantId}/menu`)

  return { getAll, getById, approve, reject, activate, deactivate, updateRestaurant, deleteRestaurant, getMenu }
}
