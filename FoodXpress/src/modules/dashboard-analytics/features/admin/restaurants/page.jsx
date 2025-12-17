import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRestaurantsApi } from './api/useRestaurantsApi.js'
import { Card, CardContent } from '../../../components/ui/Card.jsx'
import StatCard from '../../../components/ui/StatCard.jsx'

function AdminRestaurants() {
  const navigate = useNavigate()
  const { getAll } = useRestaurantsApi()
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    loadRestaurants()
  }, [refreshKey])

  const loadRestaurants = async () => {
    try {
      setLoading(true)
      const response = await getAll()
      const data = response.data?.data || response.data || []
      const restaurantData = Array.isArray(data) ? data.map((r, idx) => ({
        ...r,
        id: r.restaurantId || r.id || idx,
        status: r.status || 'pending',
        rating: r.rating || 0,
        reviewCount: r.reviewCount || 0
      })) : []
      setRestaurants(restaurantData)
    } catch (error) {
      console.error('Failed to load restaurants:', error)
      setRestaurants([])
    } finally {
      setLoading(false)
    }
  }

  const handleNavigateToDetails = (restaurantId) => {
    navigate(`/dashboard/admin/restaurants/${restaurantId}`, { state: { refresh: refreshKey } })
  }

  const filteredRestaurants = restaurants
    .filter(r => {
      const matchesFilter = filter === 'all' || r.status?.toLowerCase() === filter.toLowerCase()
      const matchesSearch = r.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           r.ownerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
      if (sortBy === 'status') return (a.status || '').localeCompare(b.status || '')
      return 0
    })

  const stats = {
    total: restaurants.length,
    pending: restaurants.filter(r => r.status?.toLowerCase() === 'pending').length,
    active: restaurants.filter(r => r.status?.toLowerCase() === 'approved' || r.status?.toLowerCase() === 'active').length,
    rejected: restaurants.filter(r => r.status?.toLowerCase() === 'rejected').length
  }

  return (
    <div className="space-y-8 pb-8">
      <style>{`
        .restaurants-table-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .restaurants-table-scroll::-webkit-scrollbar-track {
          background: var(--bg-secondary);
        }
        .restaurants-table-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, var(--primary-red) 0%, rgba(220, 53, 69, 0.7) 100%);
          border-radius: 10px;
          border: 2px solid var(--bg-secondary);
        }
        .restaurants-table-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, var(--primary-red) 0%, var(--primary-red) 100%);
        }
      `}</style>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Restaurants</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage restaurant approvals, activations, and menu items</p>
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
        <StatCard title="Total Restaurants" value={stats.total} icon="🏪" color="from-cyan-500 to-blue-500" />
        <StatCard title="Pending" value={stats.pending} icon="⏳" color="from-yellow-500 to-orange-500" />
        <StatCard title="Active" value={stats.active} icon="✓" color="from-green-500 to-emerald-500" />
        <StatCard title="Rejected" value={stats.rejected} icon="✕" color="from-red-500 to-pink-500" />
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
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
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
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* Restaurants Table */}
      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>Loading restaurants...</div>
      ) : (
        <Card style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="border overflow-hidden shadow-xl rounded-2xl">
          <div className="restaurants-table-scroll overflow-x-auto max-h-[600px]">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(0,0,0,0.1) 100%)', borderColor: 'var(--border-color)' }} className="border-b">
                  <th style={{ color: 'var(--text-primary)' }} className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider">🏪 Restaurant</th>
                  <th style={{ color: 'var(--text-primary)' }} className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider">Status</th>
                  <th style={{ color: 'var(--text-primary)' }} className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider">📍 Location</th>
                </tr>
              </thead>
              <tbody>
                {filteredRestaurants.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-16 text-center" style={{ color: 'var(--text-secondary)' }}>
                      <p className="text-lg">No restaurants found</p>
                    </td>
                  </tr>
                ) : (
                  filteredRestaurants.map((restaurant, idx) => (
                    <tr key={`${restaurant.id}-${restaurant.name}`} style={{ borderColor: 'var(--border-color)', backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }} className="border-b hover:shadow-md transition-all duration-300 cursor-pointer group" onClick={() => handleNavigateToDetails(restaurant.id)}>
                      <td style={{ color: 'var(--text-primary)' }} className="px-8 py-5 font-bold text-base group-hover:text-blue-400 transition">{restaurant.name}</td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-2 rounded-full text-xs font-bold inline-block backdrop-blur-sm ${
                          restaurant.status?.toLowerCase() === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          restaurant.status?.toLowerCase() === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          restaurant.status?.toLowerCase() === 'active' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {restaurant.status?.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }} className="px-8 py-5 text-sm group-hover:text-blue-300 transition">{restaurant.address || '—'}</td>
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

export default AdminRestaurants
