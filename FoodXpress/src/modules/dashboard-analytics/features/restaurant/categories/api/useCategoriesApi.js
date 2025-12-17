import api from '../../../../lib/axios'

export function useCategoriesApi() {
  const getAll = (restaurantId) => 
    api.get(`/categories?restaurantId=${restaurantId}`)

  const getById = (id) => 
    api.get(`/categories/${id}`)

  const create = (data) => 
    api.post('/categories', data)

  const update = (id, data) => 
    api.put(`/categories/${id}`, data)

  const deleteCategory = (id) => 
    api.delete(`/categories/${id}`)

  return { getAll, getById, create, update, deleteCategory }
}


