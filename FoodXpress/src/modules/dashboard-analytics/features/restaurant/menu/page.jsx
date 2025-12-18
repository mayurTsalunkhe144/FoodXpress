import { useState, useEffect, useRef, useContext } from 'react'
import { toast } from 'react-toastify'
import { useMenuApi } from './api/useMenuApi.js'
import { useCategoriesApi } from '../categories/api/useCategoriesApi.js'
import { Card, CardContent } from '../../../components/ui/Card.jsx'
import MenuFormModal from './components/MenuFormModal.jsx'
import { CacheContext } from '../../../context/CacheContext.jsx'

function RestaurantMenu() {
  const { getAll, create, update, deleteItem } = useMenuApi()
  const { getAll: getCategories } = useCategoriesApi()
  const { clearCache } = useContext(CacheContext)
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const restaurantId =localStorage.getItem('restaurantId') ? parseInt(localStorage.getItem('restaurantId')) : 2
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (hasLoaded.current) return
    hasLoaded.current = true
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [menuResponse, categoriesResponse] = await Promise.all([
        getAll(restaurantId),
        getCategories(restaurantId),
      ])
      const menuData = menuResponse.data?.data || menuResponse.data || []
      const catData = categoriesResponse.data?.data || categoriesResponse.data || []
      setMenuItems(Array.isArray(menuData) ? menuData : [])
      setCategories(Array.isArray(catData) ? catData : [])
    } catch (error) {
      console.error('Failed to load data:', error)
      setMenuItems([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = async (item) => {
    if (categories.length === 0) {
      await loadData()
    }
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return
    }
    try {
      await deleteItem(id)
      clearCache('menu')
      await loadData()
      toast.success('Menu item deleted successfully')
    } catch (error) {
      console.error('Failed to delete menu item:', error)
      toast.error('Failed to delete menu item')
    }
  }

  const handleSubmit = async (data) => {
    try {
      if (editingItem) {
        await update(editingItem.menuItemId, data)
        toast.success('Menu item updated successfully')
      } else {
        await create({ ...data, restaurantId })
        toast.success('Menu item created successfully')
      }
      clearCache('menu')
      setIsModalOpen(false)
      setEditingItem(null)
      await loadData()
    } catch (error) {
      console.error('Failed to save menu item:', error)
      toast.error('Failed to save menu item')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Menu Items</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your restaurant menu and items</p>
        </div>
        <button onClick={handleCreate} className="px-6 py-3 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition" style={{ backgroundColor: 'var(--primary-red)' }}>
          + Add Item
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>Loading menu items...</div>
      ) : menuItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
            No menu items found
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div key={item.menuItemId} style={{ 
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }} className="rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300 shadow">
              {item.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              )}
              
              <div style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }} className="p-4 border-b">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold" style={{ color: 'var(--primary-red)' }}>{item.name}</h3>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${item.isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {item.isAvailable ? '✓ Available' : '✕ Unavailable'}
                  </span>
                </div>
                <span style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }} className="inline-block px-3 py-1 rounded-lg text-xs font-semibold border">
                  {item.categoryName}
                </span>
              </div>

              <div className="p-6">
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-4 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p style={{ color: 'var(--text-tertiary)' }} className="text-xs uppercase tracking-wider mb-1">Price</p>
                    <p className="text-2xl font-bold" style={{ color: '#28a745' }}>${item.price?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                <div style={{ borderColor: 'var(--border-color)' }} className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 px-4 py-2 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
                    style={{ backgroundColor: '#17a2b8' }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.menuItemId)}
                    className="flex-1 px-4 py-2 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
                    style={{ backgroundColor: '#dc3545' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <MenuFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingItem(null)
        }}
        onSubmit={handleSubmit}
        menuItem={editingItem}
        categories={categories}
      />
    </div>
  )
}

export default RestaurantMenu
