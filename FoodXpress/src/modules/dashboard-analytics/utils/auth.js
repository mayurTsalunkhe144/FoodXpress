// Role-based authentication utilities
export const ROLES = {
  ADMIN: 1,
  CUSTOMER: 2,
  RESTAURANT_OWNER: 3,
  DELIVERY_BOY: 4,
  SUPPORT: 5
}

export const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user')
    const roleStr = localStorage.getItem('role')
    
    if (userStr && roleStr) {
      const user = JSON.parse(userStr)
      const role = parseInt(roleStr)
      
      return {
        ...user,
        roleId: role
      }
    }
    return null
  } catch (error) {
    console.error('Error parsing user data:', error)
    return null
  }
}

export const isAdmin = (user) => {
  return user?.roleId === ROLES.ADMIN
}

export const isRestaurantOwner = (user) => {
  return user?.roleId === ROLES.RESTAURANT_OWNER
}

export const hasAccess = (user, requiredRoles) => {
  return user && requiredRoles.includes(user.roleId)
}