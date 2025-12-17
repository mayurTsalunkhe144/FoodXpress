function OrderRow({ order, onAccept, onReject, onUpdateStatus }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { bg: '#ffc107', text: '#000', label: '⏳ Pending' }
      case 'confirmed':
        return { bg: '#17a2b8', text: '#fff', label: '✓ Confirmed' }
      case 'preparing':
        return { bg: '#9c27b0', text: '#fff', label: '👨🍳 Preparing' }
      case 'outfordelivery':
        return { bg: '#ff9800', text: '#fff', label: '🚚 Out for Delivery' }
      case 'delivered':
        return { bg: '#28a745', text: '#fff', label: '✓ Delivered' }
      case 'cancelled':
        return { bg: '#dc3545', text: '#fff', label: '✕ Cancelled' }
      default:
        return { bg: 'var(--bg-secondary)', text: 'var(--text-primary)', label: 'Unknown' }
    }
  }

  const statusInfo = getStatusColor(order.status)

  const getActionButtons = () => {
    const buttons = []
    const status = order.status?.toLowerCase()
    
    if (status === 'pending') {
      buttons.push(
        <button
          key="accept"
          onClick={() => onAccept(order.orderId)}
          className="px-4 py-2 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#28a745' }}
        >
          ✓ Accept
        </button>
      )
      buttons.push(
        <button
          key="reject"
          onClick={() => onReject(order.orderId)}
          className="px-4 py-2 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#dc3545' }}
        >
          ✕ Reject
        </button>
      )
    } else if (status === 'confirmed') {
      buttons.push(
        <button
          key="prepare"
          onClick={() => onUpdateStatus(order.orderId, 'Preparing')}
          className="px-4 py-2 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#17a2b8' }}
        >
          👨🍳 Prepare
        </button>
      )
    } else if (status === 'preparing') {
      buttons.push(
        <button
          key="ready"
          onClick={() => onUpdateStatus(order.orderId, 'OutForDelivery')}
          className="px-4 py-2 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#ff9800' }}
        >
          📦 Ready
        </button>
      )
    } else if (status === 'outfordelivery') {
      buttons.push(
        <button
          key="delivered"
          onClick={() => onUpdateStatus(order.orderId, 'Delivered')}
          className="px-4 py-2 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#9c27b0' }}
        >
          ✓ Delivered
        </button>
      )
    }
    
    return buttons
  }

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-secondary)', 
      borderColor: 'var(--border-color)',
      color: 'var(--text-primary)'
    }} className="rounded-xl border p-6 mb-4 hover:shadow-lg transition-all duration-300 shadow">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        <div>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Order ID</p>
          <p className="text-lg font-bold" style={{ color: 'var(--primary-red)' }}>#{order.orderId}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Customer</p>
          <p className="text-sm font-semibold">{order.customerName}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Amount</p>
          <p className="text-lg font-bold" style={{ color: '#28a745' }}>${order.totalAmount?.toFixed(2) || '0.00'}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Status</p>
          <span className="inline-block px-4 py-2 rounded-lg font-bold text-sm" style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}>
            {statusInfo.label}
          </span>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Date</p>
          <p className="text-sm">{formatDate(order.orderDate)}</p>
        </div>
      </div>

      <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderTopColor: 'var(--border-color)' }}>
        {getActionButtons()}
      </div>
    </div>
  )
}

export default OrderRow
