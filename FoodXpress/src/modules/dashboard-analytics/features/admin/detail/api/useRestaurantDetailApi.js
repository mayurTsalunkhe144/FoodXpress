import api from '../../../../lib/axios'

export function useRestaurantDetailApi() {
  const getDetail = (restaurantId) => 
    api.get(`/admin/restaurants/${restaurantId}`)

  const approve = (restaurantId, data) => 
    api.post(`/admin/restaurants/${restaurantId}/approve`, data)

  const reject = (restaurantId, data) => 
    api.post(`/admin/restaurants/${restaurantId}/reject`, data)

  return { getDetail, approve, reject }
}


