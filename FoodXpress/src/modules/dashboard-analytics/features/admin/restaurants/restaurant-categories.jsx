import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../../components/ui/Card.jsx'
import CategoryDetailsModal from './components/CategoryDetailsModal.jsx'
import api from '../../../lib/axios.js'

function RestaurantCategories() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [id])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/admin/restaurants/${id}/categories`)
      const data = response.data?.data || response.data || []
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load categories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (category) => {
    setSelectedCategory(category)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8 pb-8">
      <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg font-semibold" style={{ backgroundColor: 'var(--primary-red)', color: 'white' }}>
        ← Back
      </button>

      <div>
        <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Categories</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Total: {categories.length}</p>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>No categories found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.categoryId} 
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} 
              className="border cursor-pointer hover:shadow-lg transition"
              onClick={() => handleCardClick(category)}
            >
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div>
                    <p style={{ color: 'var(--text-primary)' }} className="font-semibold text-lg">{category.name}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Items Count</p>
                    <p style={{ color: 'var(--text-primary)' }} className="font-semibold text-2xl">{category.itemCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CategoryDetailsModal 
        category={selectedCategory} 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </div>
  )
}

export default RestaurantCategories
