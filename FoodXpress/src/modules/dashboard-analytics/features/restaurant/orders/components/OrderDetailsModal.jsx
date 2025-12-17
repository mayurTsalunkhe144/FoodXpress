import { useState, useEffect } from 'react'
import Modal from '../../../../components/ui/Modal.jsx'
import api from '../../../../lib/axios.js'

function OrderDetailsModal({ order, onClose }) {
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrderItems()
  }, [order])

  const loadOrderItems = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/admin/restaurants/orders/${order.orderId || order.id}/items`)
      const data = response.data?.data || response.data || []
      setOrderItems(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load order items:', error)
      setOrderItems([])
    } finally {
      setLoading(false)
    }
  }

  const totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <Modal isOpen={true} onClose={onClose} title={`Order #${order.orderId || order.id}`} size="lg">
      {/* Customer Info */}
      <div style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }} className="rounded-lg p-4 mb-6 border">
        <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-2">Customer Information</h3>
        <p style={{ color: 'var(--text-primary)' }}><span style={{ color: 'var(--text-secondary)' }}>Name:</span> {order.customerName || '-'}</p>
        <p style={{ color: 'var(--text-primary)' }}><span style={{ color: 'var(--text-secondary)' }}>Status:</span> 
          <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
            order.status?.toLowerCase() === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
            order.status?.toLowerCase() === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
            order.status?.toLowerCase() === 'preparing' ? 'bg-purple-500/20 text-purple-400' :
            order.status?.toLowerCase() === 'outfordelivery' ? 'bg-orange-500/20 text-orange-400' :
            order.status?.toLowerCase() === 'delivered' ? 'bg-green-500/20 text-green-400' :
            order.status?.toLowerCase() === 'cancelled' ? 'bg-red-500/20 text-red-400' :
            'bg-slate-500/20 text-slate-400'
          }`}>
            {order.status || 'pending'}
          </span>
        </p>
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-3">Order Items</h3>
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }} className="text-center py-4">Loading items...</p>
        ) : orderItems.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }} className="text-center py-4">No items found</p>
        ) : (
          <div className="space-y-2">
            {orderItems.map((item, idx) => (
              <div key={idx} style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }} className="rounded-lg p-3 flex justify-between items-center border">
                <div className="flex-1">
                  <p style={{ color: 'var(--text-primary)' }} className="font-medium">{item.name || 'Item'}</p>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p style={{ color: 'var(--primary-red)' }} className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm">${item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total */}
      <div style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }} className="rounded-lg p-4 border">
        <div className="flex justify-between items-center">
          <span style={{ color: 'var(--text-primary)' }} className="text-lg font-semibold">Total Amount:</span>
          <span style={{ color: 'var(--primary-red)' }} className="text-2xl font-bold">${(order.totalAmount || totalPrice).toFixed(2)}</span>
        </div>
      </div>
    </Modal>
  )
}

export default OrderDetailsModal
