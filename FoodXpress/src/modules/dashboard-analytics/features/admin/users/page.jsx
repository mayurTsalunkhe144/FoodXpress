import { useState, useEffect, useContext } from 'react'
import { useUsersApi } from './api/useUsersApi.js'
import { mockUsers } from '../../../lib/mockData.js'
import { CacheContext } from '../../../context/CacheContext.jsx'

function AdminUsers() {
  const { getAll } = useUsersApi()
  const { getCache, setCache } = useContext(CacheContext)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const cached = getCache('users')
    if (cached) {
      setUsers(cached)
      setLoading(false)
    } else {
      loadUsers()
    }
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await getAll()
      const data = response.data?.data || response.data || []
      const userData = Array.isArray(data) ? data : []
      setUsers(userData)
      setCache('users', userData)
    } catch (error) {
      console.error('Failed to load users:', error)
      setUsers(mockUsers)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = filter === 'all'
    ? users
    : users.filter(u => u.role?.toLowerCase() === filter.toLowerCase())

  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return '👑'
      case 'restaurant': return '🏪'
      case 'customer': return '👤'
      default: return '👤'
    }
  }

  const stats = [
    { label: 'Admins', count: users.filter(u => u.role === 'admin').length, icon: '👑' },
    { label: 'Restaurants', count: users.filter(u => u.role === 'restaurant').length, icon: '🏪' },
    { label: 'Customers', count: users.filter(u => u.role === 'customer').length, icon: '👤' },
    { label: 'Total Users', count: users.length, icon: '📊' },
  ]

  return (
    <div style={{backgroundColor: 'var(--bg-primary)', minHeight: '100vh', padding: 'var(--space-8)'}}>
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl text-bold text-primary mb-3">Users Management</h1>
          <p className="text-secondary">Monitor and manage all system users</p>
        </div>

        <div className="grid gap-6 mb-8" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'}}>
          {stats.map((stat, idx) => (
            <div key={idx} className="card" style={{
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border-color)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-secondary text-sm mb-2">{stat.label}</p>
              <p className="text-2xl text-bold text-primary">
                {stat.count}
              </p>
            </div>
          ))}
        </div>

        <div className="card shadow-lg">
          <div style={{
            padding: 'var(--space-8) var(--space-6)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-8)'
          }}>
            <div>
              <h3 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-primary)',
                margin: 0,
                marginBottom: 'var(--space-2)'
              }}>All Users</h3>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                margin: 0
              }}>Manage and view all registered users</p>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 'var(--space-2)'
            }}>
              <label style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                fontWeight: 'var(--font-medium)'
              }}>Filter by Role</label>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-family)',
                  cursor: 'pointer',
                  minWidth: '160px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <option value="all">All Roles</option>
                <option value="admin">👑 Admin</option>
                <option value="restaurant">🏪 Restaurant</option>
                <option value="customer">👤 Customer</option>
              </select>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center p-8">
                <div className="animate-spin" style={{width: '48px', height: '48px', border: '3px solid var(--border-color)', borderTop: '3px solid var(--primary-red)', borderRadius: '50%', margin: '0 auto'}}></div>
                <p className="text-secondary mt-4">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center p-8">
                <div className="text-4xl mb-4">👥</div>
                <p className="text-secondary text-lg">No users found</p>
              </div>
            ) : (
              <div className="overflow-auto">
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)'
                }}>
                  <thead>
                    <tr style={{
                      borderBottom: '2px solid var(--border-color)', 
                      backgroundColor: 'var(--gray-100)'
                    }}>
                      <th style={{
                        padding: 'var(--space-4)',
                        textAlign: 'center',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--text-secondary)',
                        width: '80px'
                      }}>#</th>
                      <th style={{
                        padding: 'var(--space-4)',
                        textAlign: 'left',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--text-secondary)'
                      }}>User Details</th>
                      <th style={{
                        padding: 'var(--space-4)',
                        textAlign: 'left',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--text-secondary)'
                      }}>Contact</th>
                      <th style={{
                        padding: 'var(--space-4)',
                        textAlign: 'center',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--text-secondary)',
                        width: '120px'
                      }}>Role</th>
                      <th style={{
                        padding: 'var(--space-4)',
                        textAlign: 'center',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--text-secondary)',
                        width: '100px'
                      }}>Status</th>
                      <th style={{
                        padding: 'var(--space-4)',
                        textAlign: 'center',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--text-secondary)',
                        width: '120px'
                      }}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={user.userId || user.id} style={{
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-secondary)',
                        transition: 'var(--transition-normal)'
                      }} onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = 'var(--gray-100)'} onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'var(--bg-secondary)'}>
                        <td style={{
                          padding: 'var(--space-4)',
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          fontFamily: 'monospace',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-tertiary)',
                          borderRight: '1px solid var(--border-color)'
                        }}>
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td style={{
                          padding: 'var(--space-4)',
                          verticalAlign: 'middle',
                          borderRight: '1px solid var(--border-color)'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)'
                          }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: user.role === 'admin' ? 'var(--gray-700)' : user.role === 'restaurant' ? 'var(--info)' : 'var(--success)',
                              color: 'var(--primary-white)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 'var(--text-base)',
                              fontWeight: 'var(--font-bold)'
                            }}>
                              {(user.userName || user.name || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                              <div style={{
                                fontWeight: 'var(--font-semibold)',
                                color: 'var(--text-primary)',
                                marginBottom: '2px'
                              }}>{user.userName || user.name || 'Unknown'}</div>
                              <div style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-tertiary)'
                              }}>ID: {user.userId || user.id || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{
                          padding: 'var(--space-4)',
                          verticalAlign: 'middle',
                          borderRight: '1px solid var(--border-color)'
                        }}>
                          <div style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-primary)',
                            marginBottom: '2px'
                          }}>{user.email || 'No email'}</div>
                          <div style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)'
                          }}>{user.phone || 'No phone'}</div>
                        </td>
                        <td style={{
                          padding: 'var(--space-4)',
                          verticalAlign: 'middle',
                          textAlign: 'center',
                          borderRight: '1px solid var(--border-color)'
                        }}>
                          <span style={{
                            padding: 'var(--space-2) var(--space-3)',
                            borderRadius: '50px',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-semibold)',
                            backgroundColor: user.role === 'admin' ? 'var(--gray-200)' : user.role === 'restaurant' ? 'rgba(23, 162, 184, 0.1)' : 'rgba(40, 167, 69, 0.1)',
                            color: user.role === 'admin' ? 'var(--gray-800)' : user.role === 'restaurant' ? 'var(--info)' : 'var(--success)',
                            border: `1px solid ${user.role === 'admin' ? 'var(--gray-400)' : user.role === 'restaurant' ? 'var(--info)' : 'var(--success)'}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--space-1)'
                          }}>
                            <span>{getRoleIcon(user.role)}</span>
                            <span style={{textTransform: 'capitalize'}}>{user.role || 'customer'}</span>
                          </span>
                        </td>
                        <td style={{
                          padding: 'var(--space-4)',
                          verticalAlign: 'middle',
                          textAlign: 'center',
                          borderRight: '1px solid var(--border-color)'
                        }}>
                          <span style={{
                            padding: 'var(--space-2) var(--space-3)',
                            borderRadius: '50px',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-medium)',
                            backgroundColor: user.status === 'blocked' ? 'rgba(220, 53, 69, 0.1)' : user.status === 'inactive' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(40, 167, 69, 0.1)',
                            color: user.status === 'blocked' ? 'var(--error)' : user.status === 'inactive' ? 'var(--warning)' : 'var(--success)'
                          }}>
                            {user.status === 'blocked' ? '🚫 Blocked' :
                             user.status === 'inactive' ? '⏸️ Inactive' :
                             '✅ Active'}
                          </span>
                        </td>
                        <td style={{
                          padding: 'var(--space-4)',
                          verticalAlign: 'middle',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-secondary)'
                          }}>
                            {user.createdDate ? new Date(user.createdDate).toLocaleDateString() : new Date().toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminUsers
