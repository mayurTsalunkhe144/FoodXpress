import api from '../../../../lib/axios'

export function useProfileApi() {
  const getProfile = (restaurantId) => 
    api.get(`/restaurants/${restaurantId}`)

  const updateProfile = (restaurantId, data) => 
    api.put(`/restaurants/${restaurantId}`, data)

  const updateStatus = (restaurantId, isActive) => 
    api.put(`/restaurants/${restaurantId}/status?isActive=${isActive}`)

  return { getProfile, updateProfile, updateStatus }
}
