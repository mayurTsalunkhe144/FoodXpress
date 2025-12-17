import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card.jsx'
import api from '../../../../lib/axios.js'

function OrderDetailsModal({ order, open, onClose }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && order) {
      loadOrderItems()
    }
  }, [open, order])

  const loadOrderItems = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/admin/restaurants/orders/${order.orderId}/items`)
      const data = response.data?.data || response.data || []
      setItems(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load order items:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  if (!open || !order) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="border w-full max-w-2xl max-h-96 overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <CardTitle style={{ color: 'var(--text-primary)' }}>Order Details</CardTitle>
          <button onClick={onClose} className="text-2xl" style={{ color: 'var(--text-secondary)' }}>✕</button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Order ID</p>
              <p style={{ color: 'var(--text-primary)' }} className="font-semibold">#{order.orderId}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Customer</p>
              <p style={{ color: 'var(--text-primary)' }} className="font-semibold">{order.customerName || 'N/A'}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status</p>
              <span className={`px-3 py-1 rounded text-sm font-semibold inline-block ${
                order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                order.status === 'Confirmed' ? 'bg-blue-500/20 text-blue-400' :
                order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {order.status}
              </span>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Amount</p>
              <p style={{ color: '#28a745' }} className="font-semibold">${order.totalAmount?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          <div className="border-t" style={{ borderColor: 'var(--border-color)' }}>
            <p style={{ color: 'var(--text-primary)' }} className="font-semibold mt-4 mb-3">Menu Items</p>
            {loading ? (
              <p style={{ color: 'var(--text-secondary)' }} className="text-center py-4">Loading items...</p>
            ) : items.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }} className="text-center py-4">No items found</p>
            ) : (
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }} className="p-3 rounded border flex justify-between items-center">
                    <div>
                      <p style={{ color: 'var(--text-primary)' }} className="font-semibold">{item.name}</p>
                      <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p style={{ color: 'var(--text-secondary)' }} className="text-sm">${item.price?.toFixed(2) || '0.00'}</p>
                      <p style={{ color: '#28a745' }} className="font-semibold">${item.total?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg font-semibold mt-6"
            style={{ backgroundColor: 'var(--primary-red)', color: 'white' }}
          >
            Close
          </button>
        </CardContent>
      </Card>
    </div>
  )
}

export default OrderDetailsModal
