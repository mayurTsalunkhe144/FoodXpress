import { useState, useEffect } from 'react'
import { useMenuApi } from './api/useMenuApi.js'
import { mockMenuItems } from '../../../lib/mockData.js'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card.jsx'

function AdminMenu() {
  const { getAll } = useMenuApi()
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadMenuItems()
  }, [])

  const loadMenuItems = async () => {
    try {
      setLoading(true)
      const response = await getAll()
      const data = response.data?.data || response.data || []
      setMenuItems(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load menu items:', error)
      setMenuItems(mockMenuItems)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = menuItems
    .filter(item => {
      const matchesFilter = filter === 'all' || item.isAvailable === (filter === 'active')
      const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch
    })

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Menu Items</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage all menu items across restaurants</p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or category..."
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>Loading menu items...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-12" style={{ color: 'var(--text-secondary)' }}>
              No menu items found
            </div>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.menuItemId} style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="border overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <h3 style={{ color: 'var(--text-primary)' }} className="text-lg font-semibold">{item.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      item.isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {item.isAvailable ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Category</p>
                    <p style={{ color: 'var(--text-primary)' }}>{item.categoryName || '-'}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Description</p>
                    <p style={{ color: 'var(--text-primary)' }}>{item.description || '-'}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Price</p>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1.25rem' }} className="font-bold">₹{item.price || 0}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default AdminMenu
