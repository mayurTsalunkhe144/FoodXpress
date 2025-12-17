import api from '../../../../lib/axios'

export function useOrdersApi() {
  const getAll = () => 
    api.get('/orders/all')

  const getByStatus = (status) => 
    api.get(`/orders?status=${status}`)

  return { getAll, getByStatus }
}
