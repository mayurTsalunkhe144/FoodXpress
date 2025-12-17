import { useState } from 'react'
import { Card, CardContent } from '../../../../components/ui/Card.jsx'
import api from '../../../../lib/axios.js'

function ExpandableMenu({ restaurant }) {
  const [expanded, setExpanded] = useState(false)
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleToggle = async () => {
    if (!expanded && menuItems.length === 0) {
      setExpanded(true)
      setLoading(true)
      setError(null)
      try {
        const response = await api.get(`/menu-items?restaurantId=${restaurant.id}`)
        const data = response.data?.data || response.data || []
        setMenuItems(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load menu:', error)
        setError('Failed to load menu items')
        setMenuItems([])
      } finally {
        setLoading(false)
      }
    } else {
      setExpanded(!expanded)
    }
  }

  return (
    <Card style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="border">
      <button
        onClick={handleToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-opacity-50 transition"
        style={{ backgroundColor: 'var(--bg-tertiary)' }}
      >
        <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold">📋 Menu Items</h3>
        <span style={{ color: 'var(--text-secondary)' }} className="text-xl">
          {expanded ? '▼' : '▶'}
        </span>
      </button>

      {expanded && (
        <CardContent className="pt-4">
          {loading && (
            <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          )}
          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }} className="text-center py-4">Loading menu items...</p>
          ) : error ? (
            <p style={{ color: '#dc3545' }} className="text-center py-4">{error}</p>
          ) : menuItems.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }} className="text-center py-4">No menu items found</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--primary-red) var(--bg-primary)'
            }}>
              <style>{`
                div::-webkit-scrollbar {
                  width: 6px;
                }
                div::-webkit-scrollbar-track {
                  background: var(--bg-primary);
                  border-radius: 10px;
                }
                div::-webkit-scrollbar-thumb {
                  background: var(--primary-red);
                  border-radius: 10px;
                }
                div::-webkit-scrollbar-thumb:hover {
                  background: var(--primary-red);
                  opacity: 0.8;
                }
              `}</style>
              {menuItems.map((item) => (
                <div key={item.menuItemId} style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p style={{ color: 'var(--text-primary)' }} className="font-semibold">{item.name}</p>
                      <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{item.categoryName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${item.isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-2">{item.description}</p>
                  <p style={{ color: '#28a745' }} className="font-semibold">${item.price?.toFixed(2) || '0.00'}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

export default ExpandableMenu
