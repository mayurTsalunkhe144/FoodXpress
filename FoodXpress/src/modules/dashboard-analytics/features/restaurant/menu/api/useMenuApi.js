import api from '../../../../lib/axios'

export function useMenuApi() {
  const getAll = (restaurantId) => 
    api.get(`/menu-items?restaurantId=${restaurantId}`)

  const getById = (id) => 
    api.get(`/menu-items/${id}`)

  const create = (data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    return api.post('/menu-items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  const update = (id, data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    return api.put(`/menu-items/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  const deleteItem = (id) => 
    api.delete(`/menu-items/${id}`)

  return { getAll, getById, create, update, deleteItem }
}


