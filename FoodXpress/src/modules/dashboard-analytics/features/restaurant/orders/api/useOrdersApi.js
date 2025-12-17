import api from '../../../../lib/axios'

export function useOrdersApi() {
  const getByRestaurant = (restaurantId) => 
    api.get(`/orders?restaurantId=${restaurantId}`)

  const accept = (orderId) => 
    api.post(`/orders/${orderId}/accept`)

  const reject = (orderId) => 
    api.post(`/orders/${orderId}/reject`)

  const updateStatus = (orderId, status) => 
    api.put(`/orders/${orderId}/status`, { status })

  return { getByRestaurant, accept, reject, updateStatus }
}


