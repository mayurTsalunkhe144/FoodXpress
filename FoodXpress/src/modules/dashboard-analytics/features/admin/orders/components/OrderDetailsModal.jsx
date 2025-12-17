import { useState, useEffect } from 'react'
import Modal from '../../../../components/ui/Modal.jsx'

function OrderDetailsModal({ order, onClose }) {
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrderItems()
  }, [order])

  const loadOrderItems = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/orders/${order.orderId || order.id}/items`)
      if (response.ok) {
        const data = await response.json()
        setOrderItems(data.data || [])
      }
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
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <h3 className="text-cyan-400 font-semibold mb-2">Customer Information</h3>
        <p className="text-slate-300"><span className="text-slate-400">Name:</span> {order.customerName || '-'}</p>
        <p className="text-slate-300"><span className="text-slate-400">Restaurant:</span> {order.restaurantName || '-'}</p>
        <p className="text-slate-300"><span className="text-slate-400">Status:</span> 
          <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
            order.status?.toLowerCase() === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
            order.status?.toLowerCase() === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
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
        <h3 className="text-cyan-400 font-semibold mb-3">Order Items</h3>
        {loading ? (
          <p className="text-slate-400 text-center py-4">Loading items...</p>
        ) : orderItems.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No items found</p>
        ) : (
          <div className="space-y-2">
            {orderItems.map((item, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-lg p-3 flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-slate-300 font-medium">{item.itemName || item.name || 'Item'}</p>
                  <p className="text-slate-400 text-sm">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-cyan-400 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-slate-400 text-sm">${item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg p-4 border border-cyan-500/40">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-slate-300">Total Amount:</span>
          <span className="text-2xl font-bold text-cyan-400">${(order.totalAmount || totalPrice).toFixed(2)}</span>
        </div>
      </div>
    </Modal>
  )
}

export default OrderDetailsModal
