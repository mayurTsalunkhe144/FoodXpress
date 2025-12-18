import api from '../../../../lib/axios'

export function useProfileApi() {
  const getProfile = (restaurantId) => 
    api.get(`/restaurants/${restaurantId}`)

  const updateProfile = (restaurantId, data) => {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      cuisineType: data.cuisineType,
      description: data.description,
      address: data.address,
      cityId: data.cityId || 0,
      stateId: data.stateId || 0
    }
    return api.put(`/restaurants/${restaurantId}`, payload)
  }

  const updateStatus = (restaurantId, isActive) => 
    api.put(`/restaurants/${restaurantId}/status?isActive=${isActive}`)

  return { getProfile, updateProfile, updateStatus }
}
