import { useState, useEffect, useContext } from 'react'
import { useUsersApi } from './api/useUsersApi.js'
import { mockUsers } from '../../../lib/mockData.js'
import { Card, CardContent } from '../../../components/ui/Card.jsx'
import StatCard from '../../../components/ui/StatCard.jsx'
import { CacheContext } from '../../../context/CacheContext.jsx'

function AdminUsers() {
  const { getAll } = useUsersApi()
  const { getCache, setCache } = useContext(CacheContext)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    loadUsers()
  }, [refreshKey])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const cached = getCache('users')
      if (cached) {
        setUsers(cached)
        return
      }
      
      const response = await getAll()
      const data = response.data?.data
      const userData = data?.users && Array.isArray(data.users) ? data.users : mockUsers
      setUsers(userData)
      setCache('users', userData)
    } catch (error) {
      console.error('Failed to load users:', error)
      setUsers(mockUsers)
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role) => {
    switch(role) {
      case 'Admin': return '👑'
      case 'RestaurantOwner': return '🏪'
      case 'Customer': return '👤'
      case 'DeliveryBoy': return '🚚'
      default: return '👤'
    }
  }

  const filteredUsers = users
    .filter(u => {
      const matchesFilter = filter === 'all' || u.role === filter
      const matchesSearch = (u.userName || u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.userName || a.name || '').localeCompare(b.userName || b.name || '')
      if (sortBy === 'role') return (a.role || '').localeCompare(b.role || '')
      return 0
    })

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'Admin').length,
    restaurants: users.filter(u => u.role === 'RestaurantOwner').length,
    customers: users.filter(u => u.role === 'Customer').length
  }

  return (
    <div className="space-y-8 pb-8">
      <style>{`
        .users-table-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .users-table-scroll::-webkit-scrollbar-track {
          background: var(--bg-secondary);
        }
        .users-table-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, var(--primary-red) 0%, rgba(220, 53, 69, 0.7) 100%);
          border-radius: 10px;
          border: 2px solid var(--bg-secondary);
        }
        .users-table-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, var(--primary-red) 0%, var(--primary-red) 100%);
        }
      `}</style>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Users</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage all system users and their roles</p>
        </div>
        <button
          onClick={() => setRefreshKey(prev => prev + 1)}
          className="px-4 py-2 rounded-lg font-semibold transition"
          style={{ backgroundColor: 'var(--primary-red)', color: 'white' }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.total} icon="👥" color="from-cyan-500 to-blue-500" />
        <StatCard title="Admins" value={stats.admins} icon="👑" color="from-purple-500 to-pink-500" />
        <StatCard title="Restaurants" value={stats.restaurants} icon="🏪" color="from-orange-500 to-red-500" />
        <StatCard title="Customers" value={stats.customers} icon="👤" color="from-green-500 to-emerald-500" />
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-64 px-4 py-2 rounded-lg border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        />
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <option value="all">All Roles</option>
          <option value="Admin">👑 Admin</option>
          <option value="RestaurantOwner">🏪 Restaurant</option>
          <option value="Customer">👤 Customer</option>
          <option value="DeliveryBoy">🚚 Delivery Boy</option>
        </select>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-lg border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <option value="name">Sort by Name</option>
          <option value="role">Sort by Role</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>Loading users...</div>
      ) : (
        <Card style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="border overflow-hidden shadow-xl rounded-2xl">
          <div className="users-table-scroll overflow-x-auto max-h-[600px]">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(0,0,0,0.1) 100%)', borderColor: 'var(--border-color)' }} className="border-b">
                  <th style={{ color: 'var(--text-primary)' }} className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider">#</th>
                  <th style={{ color: 'var(--text-primary)' }} className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider">👤 User</th>
                  <th style={{ color: 'var(--text-primary)' }} className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider">📧 Email</th>
                  <th style={{ color: 'var(--text-primary)' }} className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider">Role</th>
                  <th style={{ color: 'var(--text-primary)' }} className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-16 text-center" style={{ color: 'var(--text-secondary)' }}>
                      <p className="text-lg">No users found</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <tr key={`${user.userId || user.id}-${user.email}`} style={{ borderColor: 'var(--border-color)', backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }} className="border-b hover:shadow-md transition-all duration-300">
                      <td style={{ color: 'var(--text-secondary)' }} className="px-8 py-5 text-sm font-mono">{String(idx + 1).padStart(2, '0')}</td>
                      <td style={{ color: 'var(--text-primary)' }} className="px-8 py-5 font-bold text-base">
                        <div className="flex items-center gap-3">
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: user.role === 'Admin' ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' : 
                                       user.role === 'RestaurantOwner' ? 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)' :
                                       user.role === 'DeliveryBoy' ? 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)' :
                                       'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            fontWeight: 'bold'
                          }}>
                            {(user.userName || user.name || 'U')[0].toUpperCase()}
                          </div>
                          <span>{user.userName || user.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }} className="px-8 py-5 text-sm">{user.email || '—'}</td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-2 rounded-full text-xs font-bold inline-block backdrop-blur-sm ${
                          user.role === 'Admin' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' :
                          user.role === 'RestaurantOwner' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          user.role === 'DeliveryBoy' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {getRoleIcon(user.role)} {user.role || 'Customer'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-4 py-2 rounded-full text-xs font-bold inline-block bg-green-500/20 text-green-400 border border-green-500/30">
                          ✓ Active
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

export default AdminUsers
