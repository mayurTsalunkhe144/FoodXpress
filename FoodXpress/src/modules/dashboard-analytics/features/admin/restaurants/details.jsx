import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRestaurantsApi } from './api/useRestaurantsApi.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card.jsx'
import ActionModal from './components/ActionModal.jsx'
import EditModal from './components/EditModal.jsx'
import ExpandableMenu from './components/ExpandableMenu.jsx'
import PreviewSection from './components/PreviewSection.jsx'

function RestaurantDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, approve, reject, activate, deactivate, updateRestaurant } = useRestaurantsApi()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionModal, setActionModal] = useState({ open: false, action: null, restaurant: null })
  const [editModal, setEditModal] = useState({ open: false, restaurant: null })

  useEffect(() => {
    loadRestaurant()
  }, [id])

  const loadRestaurant = async () => {
    try {
      setLoading(true)
      const response = await getById(id)
      const restaurantData = response.data
      if (restaurantData) {
        setRestaurant({
          ...restaurantData,
          id: restaurantData.restaurantId || restaurantData.id,
          status: restaurantData.status || 'pending',
          rating: restaurantData.rating || 0,
          reviewCount: restaurantData.reviewCount || 0
        })
      }
    } catch (error) {
      console.error('Failed to load restaurant:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (action) => {
    setActionModal({ open: true, action, restaurant })
  }

  const handleConfirmAction = async (reason) => {
    try {
      switch(actionModal.action) {
        case 'approve':
          await approve(restaurant.id)
          break
        case 'reject':
          await reject(restaurant.id, reason)
          break
        case 'activate':
          await activate(restaurant.id)
          break
        case 'deactivate':
          await deactivate(restaurant.id)
          break
      }
      setActionModal({ open: false, action: null, restaurant: null })
      await loadRestaurant()
    } catch (error) {
      console.error('Action failed:', error)
    }
  }

  const handleSaveEdit = async (updatedData) => {
    try {
      await updateRestaurant(restaurant.id, updatedData)
      setEditModal({ open: false, restaurant: null })
      await loadRestaurant()
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>Loading restaurant details...</div>
  }

  if (!restaurant) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/dashboard/admin/restaurants')} className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--primary-red)', color: 'white' }}>
          ← Back to Restaurants
        </button>
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>Restaurant not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      <button onClick={() => navigate('/dashboard/admin/restaurants')} className="px-4 py-2 rounded-lg font-semibold" style={{ backgroundColor: 'var(--primary-red)', color: 'white' }}>
        ← Back to Restaurants
      </button>

      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>{restaurant.name}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{restaurant.description}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
          restaurant.status?.toLowerCase() === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
          restaurant.status?.toLowerCase() === 'approved' ? 'bg-green-500/20 text-green-400' :
          restaurant.status?.toLowerCase() === 'active' ? 'bg-blue-500/20 text-blue-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {restaurant.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="border">
          <CardHeader>
            <CardTitle style={{ color: 'var(--text-primary)' }}>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Owner Email</p>
              <p style={{ color: 'var(--text-primary)' }} className="font-semibold">{restaurant.ownerEmail || '-'}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Phone</p>
              <p style={{ color: 'var(--text-primary)' }} className="font-semibold">{restaurant.phone || '-'}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Address</p>
              <p style={{ color: 'var(--text-primary)' }} className="font-semibold">{restaurant.address || '-'}</p>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="border">
          <CardHeader>
            <CardTitle style={{ color: 'var(--text-primary)' }}>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Rating</p>
              <p style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold">⭐ {restaurant.rating || 0}/5</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Reviews</p>
              <p style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold">{restaurant.reviewCount || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {restaurant.status?.toLowerCase() === 'pending' && (
        <Card style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="border">
          <CardHeader>
            <CardTitle style={{ color: 'var(--text-primary)' }}>Approval Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleAction('approve')}
                className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-semibold hover:bg-green-500/30 transition"
              >
                ✓ Approve
              </button>
              <button
                onClick={() => handleAction('reject')}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition"
              >
                ✕ Reject
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {restaurant.status?.toLowerCase() === 'approved' && (
        <Card style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="border">
          <CardHeader>
            <CardTitle style={{ color: 'var(--text-primary)' }}>Status Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleAction('deactivate')}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition"
              >
                Deactivate
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {restaurant.status?.toLowerCase() === 'active' && (
        <Card style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="border">
          <CardHeader>
            <CardTitle style={{ color: 'var(--text-primary)' }}>Status Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleAction('deactivate')}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition"
              >
                Deactivate
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PreviewSection
          title="Orders"
          icon="📦"
          restaurantId={restaurant.id}
          endpoint={`/admin/restaurants/${restaurant.id}/orders`}
          detailsPath={`/dashboard/admin/restaurants/${restaurant.id}/orders`}
        />

        <PreviewSection
          title="Menu Items"
          icon="🍽️"
          restaurantId={restaurant.id}
          endpoint={`/menu-items?restaurantId=${restaurant.id}`}
          detailsPath={`/dashboard/admin/restaurants/${restaurant.id}/menu`}
        />

        <PreviewSection
          title="Categories"
          icon="📂"
          restaurantId={restaurant.id}
          endpoint={`/admin/restaurants/${restaurant.id}/categories`}
          detailsPath={`/dashboard/admin/restaurants/${restaurant.id}/categories`}
        />
      </div>

      <Card style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="border">
        <CardHeader>
          <CardTitle style={{ color: 'var(--text-primary)' }}>Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setEditModal({ open: true, restaurant })}
              className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg font-semibold hover:bg-purple-500/30 transition"
            >
              ✎ Edit Details
            </button>
          </div>
        </CardContent>
      </Card>

      <ActionModal
        open={actionModal.open}
        action={actionModal.action}
        restaurant={actionModal.restaurant}
        onConfirm={handleConfirmAction}
        onClose={() => setActionModal({ open: false, action: null, restaurant: null })}
      />
      <EditModal
        open={editModal.open}
        restaurant={editModal.restaurant}
        onSave={handleSaveEdit}
        onClose={() => setEditModal({ open: false, restaurant: null })}
      />
    </div>
  )
}

export default RestaurantDetails
