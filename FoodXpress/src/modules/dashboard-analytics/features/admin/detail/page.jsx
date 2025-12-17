import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRestaurantDetailApi } from './api/useRestaurantDetailApi.js'
import { Card } from '../../../components/ui/Card.jsx'
import Button from '../../../components/ui/Button.jsx'
import Badge from '../../../components/ui/Badge.jsx'
import ApprovalModal from './components/ApprovalModal.jsx'
import './styles.css'

function AdminRestaurantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getDetail, approve, reject } = useRestaurantDetailApi()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadDetail()
  }, [id])

  const loadDetail = async () => {
    try {
      setLoading(true)
      const response = await getDetail(id)
      setRestaurant(response.data)
    } catch (error) {
      console.error('Failed to load restaurant detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    try {
      await approve(id, {})
      alert('Restaurant approved successfully')
      navigate('/dashboard/admin/pending')
    } catch (error) {
      console.error('Failed to approve restaurant:', error)
      alert('Failed to approve restaurant')
    }
  }

  const handleReject = async (reason) => {
    try {
      await reject(id, { rejectionReason: reason })
      alert('Restaurant rejected successfully')
      navigate('/dashboard/admin/pending')
    } catch (error) {
      console.error('Failed to reject restaurant:', error)
      alert('Failed to reject restaurant')
    }
  }

  if (loading) {
    return <div className="loading">Loading restaurant details...</div>
  }

  if (!restaurant) {
    return <div className="error">Restaurant not found</div>
  }

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success'
      case 'pending':
        return 'secondary'
      case 'rejected':
        return 'danger'
      default:
        return 'default'
    }
  }

  return (
    <div className="detail-page">
      <div className="detail-header">
        <Button variant="outline" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        {restaurant.status === 'Pending' && (
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Review Restaurant
          </Button>
        )}
        {restaurant.status === 'Rejected' && (
          <Button variant="success" onClick={handleApprove}>
            ✓ Accept Again
          </Button>
        )}
      </div>

      <h1 className="page-title">{restaurant.restaurantName}</h1>

      <div className="detail-grid">
        <Card>
          <Card.Header>
            <Card.Title>Basic Information</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <Badge variant={getStatusVariant(restaurant.status)}>
                {restaurant.status}
              </Badge>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{restaurant.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{restaurant.phone}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Cuisine Type:</span>
              <span className="detail-value">{restaurant.cuisineType}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Registration Date:</span>
              <span className="detail-value">{restaurant.registrationDate}</span>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Description</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="detail-description">
              {restaurant.description || 'No description provided'}
            </p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Address</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="detail-item">
              <span className="detail-label">Street:</span>
              <span className="detail-value">{restaurant.address?.street || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">City:</span>
              <span className="detail-value">{restaurant.address?.city || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">State:</span>
              <span className="detail-value">{restaurant.address?.state || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Zip Code:</span>
              <span className="detail-value">{restaurant.address?.zipCode || '-'}</span>
            </div>
          </Card.Content>
        </Card>

        {restaurant.rejectionReason && (
          <Card>
            <Card.Header>
              <Card.Title>Rejection Reason</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="rejection-reason">{restaurant.rejectionReason}</p>
            </Card.Content>
          </Card>
        )}
      </div>

      <ApprovalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        restaurantName={restaurant.restaurantName}
      />
    </div>
  )
}

export default AdminRestaurantDetail
