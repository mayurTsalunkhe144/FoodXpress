import { useState, useEffect, useContext, useRef } from 'react'
import { toast } from 'react-toastify'
import { useCategoriesApi } from './api/useCategoriesApi.js'
import CategoryFormModal from './components/CategoryFormModal.jsx'
import { CacheContext } from '../../../context/CacheContext.jsx'

function RestaurantCategories() {
  const { getAll, create, update, deleteCategory } = useCategoriesApi()
  const { clearCache } = useContext(CacheContext)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const restaurantId = localStorage.getItem('restaurantId') ? parseInt(localStorage.getItem('restaurantId')) : 2
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (hasLoaded.current) return
    hasLoaded.current = true
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await getAll(restaurantId)
      setCategories(response.data?.data || [])
    } catch (error) {
      console.error('Failed to load categories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingId(null)
    setShowModal(true)
  }

  const handleEdit = (id) => {
    setEditingId(id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      await deleteCategory(id)
      clearCache('categories')
      await loadCategories()
      toast.success('Category deleted successfully')
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast.error('Failed to delete category')
    }
  }

  const handleSave = async (data) => {
    try {
      if (editingId) {
        await update(editingId, data)
        toast.success('Category updated successfully')
      } else {
        await create({ ...data, restaurantId })
        toast.success('Category created successfully')
      }
      clearCache('categories')
      await loadCategories()
      setShowModal(false)
    } catch (error) {
      console.error('Failed to save category:', error)
      toast.error('Failed to save category')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Categories</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage menu categories</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
          style={{ backgroundColor: 'var(--primary-red)' }}
        >
          + Add Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      ) : categories.length === 0 ? (
        <div style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }} className="text-center py-12 rounded-lg border">
          No categories found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat.categoryId} style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="rounded-lg border p-4 shadow">
              <h3 className="font-semibold mb-4">{cat.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cat.categoryId)}
                  className="flex-1 px-3 py-2 text-white rounded text-sm font-semibold"
                  style={{ backgroundColor: '#17a2b8' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.categoryId)}
                  className="flex-1 px-3 py-2 text-white rounded text-sm font-semibold"
                  style={{ backgroundColor: '#dc3545' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CategoryFormModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          editingId={editingId}
          category={editingId ? categories.find(c => c.categoryId === editingId) : null}
        />
      )}
    </div>
  )
}

export default RestaurantCategories
