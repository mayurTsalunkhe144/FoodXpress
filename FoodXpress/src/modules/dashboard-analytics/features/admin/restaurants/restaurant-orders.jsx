import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../../components/ui/Card.jsx'
import OrderDetailsModal from './components/OrderDetailsModal.jsx'
import api from '../../../lib/axios.js'

function RestaurantOrders() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [id])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/admin/restaurants/${id}/orders`)
      const data = response.data?.data || response.data || []
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (order) => {
    setSelectedOrder(order)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8 pb-8">
      <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg font-semibold" style={{ backgroundColor: 'var(--primary-red)', color: 'white' }}>
        ← Back
      </button>

      <div>
        <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Orders</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Total: {orders.length}</p>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>No orders found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Card 
              key={order.orderId} 
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} 
              className="border cursor-pointer hover:shadow-lg transition"
              onClick={() => handleCardClick(order)}
            >
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Order ID</p>
                      <p style={{ color: 'var(--text-primary)' }} className="font-semibold">#{order.orderId}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      order.status === 'Confirmed' ? 'bg-blue-500/20 text-blue-400' :
                      order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Customer</p>
                    <p style={{ color: 'var(--text-primary)' }} className="font-semibold">{order.customerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Amount</p>
                    <p style={{ color: '#28a745' }} className="font-semibold">${order.totalAmount?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <OrderDetailsModal 
        order={selectedOrder} 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </div>
  )
}

export default RestaurantOrders
