import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../../components/ui/Card.jsx'
import MenuItemDetailsModal from './components/MenuItemDetailsModal.jsx'
import api from '../../../lib/axios.js'

function RestaurantMenu() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    loadMenuItems()
  }, [id])

  const loadMenuItems = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/menu-items?restaurantId=${id}`)
      const data = response.data?.data || response.data || []
      setMenuItems(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load menu items:', error)
      setMenuItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (item) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8 pb-8">
      <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg font-semibold" style={{ backgroundColor: 'var(--primary-red)', color: 'white' }}>
        ← Back
      </button>

      <div>
        <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Menu Items</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Total: {menuItems.length}</p>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>No menu items found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card 
              key={item.menuItemId} 
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} 
              className="border cursor-pointer hover:shadow-lg transition"
              onClick={() => handleCardClick(item)}
            >
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p style={{ color: 'var(--text-primary)' }} className="font-semibold text-lg">{item.name}</p>
                      <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{item.categoryName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${item.isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Description</p>
                    <p style={{ color: 'var(--text-primary)' }} className="text-sm">{item.description || 'No description'}</p>
                  </div>
                  <div>
                    <p style={{ color: '#28a745' }} className="font-semibold text-lg">${item.price?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <MenuItemDetailsModal 
        item={selectedItem} 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </div>
  )
}

export default RestaurantMenu
