import api from '../../../../lib/axios'

export function useUsersApi() {
  const getAll = () => 
    api.get('/admin/users')

  const deactivate = (userId) => 
    api.put(`/admin/users/${userId}/deactivate`)

  return { getAll, deactivate }
}
