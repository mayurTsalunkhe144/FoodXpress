import { useState, useEffect } from 'react'

function RestaurantReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const restaurantId = 2

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/restaurants/${restaurantId}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.data || [])
      }
    } catch (error) {
      console.error('Failed to load reviews:', error)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Reviews</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Customer feedback and ratings</p>
      </div>

      {/* Summary */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="rounded-lg border p-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl font-bold text-yellow-400">{averageRating}</div>
          <div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(averageRating) ? 'text-yellow-400' : 'text-slate-600'}>
                  ⭐
                </span>
              ))}
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>{reviews.length} reviews</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="text-center py-12 rounded-lg border" style={{ color: 'var(--text-secondary)' }}>
          No reviews yet
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.reviewId} style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="rounded-lg border p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p style={{ color: 'var(--text-primary)' }} className="font-semibold">{review.userName || 'Anonymous'}</p>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-slate-600'}>
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              <p style={{ color: 'var(--text-primary)' }} className="text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RestaurantReviews
