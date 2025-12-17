import { useState, useEffect, useRef, useMemo } from 'react'
import { useOrdersApi } from './api/useOrdersApi.js'
import OrderRow from './components/OrderRow.jsx'
import OrderDetailsModal from './components/OrderDetailsModal.jsx'
import PremiumSelect from '../../../components/ui/PremiumSelect.jsx'

function RestaurantOrders() {
  const { getByRestaurant, accept, reject, updateStatus } = useOrdersApi()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('date-recent')
  const [selectedDate, setSelectedDate] = useState('')
  const [orderType, setOrderType] = useState('all')
  const [status, setStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const restaurantId = 2
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (hasLoaded.current) return
    hasLoaded.current = true
    
    loadOrders()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [orderType, selectedDate, status])

  const sortOrders = (ordersToSort, sort) => {
    const sorted = [...ordersToSort]
    switch (sort) {
      case 'date-recent':
        return sorted.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      case 'date-oldest':
        return sorted.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate))
      case 'amount-high':
        return sorted.sort((a, b) => b.totalAmount - a.totalAmount)
      case 'amount-low':
        return sorted.sort((a, b) => a.totalAmount - b.totalAmount)
      default:
        return sorted
    }
  }

  const filterAndSortOrders = useMemo(() => {
    let filtered = orders
    
    if (orderType === 'active') {
      filtered = filtered.filter(o => ['pending', 'confirmed', 'preparing', 'outfordelivery'].includes(o.status?.toLowerCase()))
    } else if (orderType === 'completed') {
      filtered = filtered.filter(o => ['delivered', 'rejected', 'cancelled'].includes(o.status?.toLowerCase()))
    }
    
    if (status !== 'all') {
      filtered = filtered.filter(o => o.status?.toLowerCase() === status.toLowerCase())
    }
    
    if (selectedDate) {
      filtered = filtered.filter(o => new Date(o.orderDate).toISOString().split('T')[0] === selectedDate)
    }
    
    return sortOrders(filtered, sortBy)
  }, [orders, orderType, selectedDate, sortBy, status])

  const loadOrders = async () => {
    try {
      const response = await getByRestaurant(restaurantId)
      let data = response.data?.data || response.data || []
      data = Array.isArray(data) ? data : []
      setOrders(data)
    } catch (error) {
      console.error('Failed to load orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    setCurrentPage(1)
  }

  const handleAccept = async (orderId) => {
    try {
      await accept(orderId)
      await loadOrders()
    } catch (error) {
      console.error('Failed to accept order:', error)
      alert('Failed to accept order')
    }
  }

  const handleReject = async (orderId) => {
    if (!window.confirm('Are you sure you want to reject this order?')) {
      return
    }
    try {
      await reject(orderId)
      await loadOrders()
    } catch (error) {
      console.error('Failed to reject order:', error)
      alert('Failed to reject order')
    }
  }

  const handleUpdateStatus = async (orderId, statusVal) => {
    try {
      await updateStatus(orderId, statusVal)
      await loadOrders()
    } catch (error) {
      console.error('Failed to update order status:', error)
      alert('Failed to update order status')
    }
  }

  const totalPages = Math.ceil(filterAndSortOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filterAndSortOrders.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Orders</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and track all restaurant orders</p>
        </div>
        <button
          onClick={loadOrders}
          disabled={loading}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)',
            opacity: loading ? 0.5 : 1
          }}
          className="p-2 rounded-lg border transition disabled:cursor-not-allowed"
          title="Refresh orders"
        >
          ↻
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <label style={{ color: 'var(--text-primary)' }} className="text-sm font-semibold block mb-2">Sort by</label>
          <PremiumSelect
            value={sortBy}
            onChange={handleSortChange}
            options={[
              { value: 'date-recent', label: 'Most Recent' },
              { value: 'date-oldest', label: 'Oldest' },
              { value: 'amount-high', label: 'Highest Amount' },
              { value: 'amount-low', label: 'Lowest Amount' }
            ]}
          />
        </div>

        <div>
          <label style={{ color: 'var(--text-primary)' }} className="text-sm font-semibold block mb-2">Type</label>
          <PremiumSelect
            value={orderType}
            onChange={(val) => {
              setOrderType(val)
              setCurrentPage(1)
            }}
            options={[
              { value: 'all', label: 'All Orders' },
              { value: 'active', label: 'Active Orders' },
              { value: 'completed', label: 'Completed Orders' }
            ]}
          />
        </div>

        <div>
          <label style={{ color: 'var(--text-primary)' }} className="text-sm font-semibold block mb-2">Status</label>
          <PremiumSelect
            value={status}
            onChange={(val) => {
              setStatus(val)
              setCurrentPage(1)
            }}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'preparing', label: 'Preparing' },
              { value: 'outfordelivery', label: 'Out for Delivery' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'cancelled', label: 'Cancelled' },
              { value: 'rejected', label: 'Rejected' }
            ]}
          />
        </div>

        <div>
          <label style={{ color: 'var(--text-primary)' }} className="text-sm font-semibold block mb-2">Date</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                setCurrentPage(1)
              }}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)'
              }}
              className="flex-1 px-4 py-2 rounded-lg font-semibold border"
            />
            {selectedDate && (
              <button
                onClick={() => {
                  setSelectedDate('')
                  setCurrentPage(1)
                }}
                style={{
                  backgroundColor: 'var(--primary-red)',
                  color: 'white'
                }}
                className="px-3 py-2 rounded-lg font-semibold text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div>
          <label style={{ color: 'var(--text-primary)' }} className="text-sm font-semibold block mb-2">Show</label>
          <PremiumSelect
            value={itemsPerPage.toString()}
            onChange={(val) => {
              setItemsPerPage(Number(val))
              setCurrentPage(1)
            }}
            options={[
              { value: '5', label: '5 per page' },
              { value: '10', label: '10 per page' },
              { value: '20', label: '20 per page' },
              { value: '50', label: '50 per page' }
            ]}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>Loading orders...</div>
      ) : filterAndSortOrders.length === 0 ? (
        <div className="text-center py-12 rounded-lg border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
          No orders found
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedOrders.map((order) => (
              <div key={order.orderId} onClick={() => setSelectedOrder(order)} className="cursor-pointer">
                <OrderRow
                  order={order}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onUpdateStatus={handleUpdateStatus}
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)' }} className="text-sm">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filterAndSortOrders.length)} of {filterAndSortOrders.length} orders
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  style={{
                    backgroundColor: currentPage === 1 ? 'var(--bg-secondary)' : 'var(--primary-red)',
                    color: 'white',
                    opacity: currentPage === 1 ? 0.5 : 1
                  }}
                  className="px-4 py-2 rounded-lg font-semibold transition disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      backgroundColor: currentPage === page ? 'var(--primary-red)' : 'var(--bg-secondary)',
                      color: currentPage === page ? 'white' : 'var(--text-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                    className="px-3 py-2 rounded-lg font-semibold transition border"
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    backgroundColor: currentPage === totalPages ? 'var(--bg-secondary)' : 'var(--primary-red)',
                    color: 'white',
                    opacity: currentPage === totalPages ? 0.5 : 1
                  }}
                  className="px-4 py-2 rounded-lg font-semibold transition disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  )
}

export default RestaurantOrders
