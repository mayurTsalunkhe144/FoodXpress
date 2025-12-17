import { useState, useEffect, useContext } from 'react'
import { useOrdersApi } from './api/useOrdersApi.js'
import { mockOrders } from '../../../lib/mockData.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card.jsx'
import Table from '../../../components/ui/Table.jsx'
import OrderDetailsModal from './components/OrderDetailsModal.jsx'
import PremiumSelect from '../../../components/ui/PremiumSelect.jsx'
import { CacheContext } from '../../../context/CacheContext.jsx'

function AdminOrders() {
  const { getAll } = useOrdersApi()
  const { getCache, setCache, isLoading, setLoading: setCacheLoading } = useContext(CacheContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    const cached = getCache('orders')
    if (cached) {
      setOrders(cached)
      setLoading(false)
    } else if (!isLoading('orders')) {
      setLoading('orders', true)
      loadOrders()
    }
  }, [])

  const loadOrders = async () => {
    try {
      const response = await getAll()
      const data = response.data?.data || response.data || []
      const orderData = Array.isArray(data) ? data : []
      setOrders(orderData)
      setCache('orders', orderData)
    } catch (error) {
      console.error('Failed to load orders:', error)
      setOrders(mockOrders)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status?.toLowerCase() === filter.toLowerCase())

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">Orders</h1>
        <p className="text-slate-400">Monitor all orders in the system</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Orders ({orders.length})</CardTitle>
          <div className="w-48">
            <PremiumSelect
              value={filter}
              onChange={(val) => setFilter(val)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'cancelled', label: 'Cancelled' }
              ]}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading orders...</div>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Order ID</Table.Head>
                  <Table.Head>Customer</Table.Head>
                  <Table.Head>Restaurant</Table.Head>
                  <Table.Head>Amount</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Date</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredOrders.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center py-8">No orders found</Table.Cell>
                  </Table.Row>
                ) : (
                  filteredOrders.map((order) => (
                    <Table.Row 
                      key={order.orderId || order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="cursor-pointer"
                    >
                      <Table.Cell className="font-medium">{order.orderId || order.id}</Table.Cell>
                      <Table.Cell>{order.customerName || '-'}</Table.Cell>
                      <Table.Cell>{order.restaurantName || '-'}</Table.Cell>
                      <Table.Cell>${(order.totalAmount || 0).toFixed(2)}</Table.Cell>
                      <Table.Cell>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status?.toLowerCase() === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          order.status?.toLowerCase() === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                          order.status?.toLowerCase() === 'delivered' ? 'bg-green-500/20 text-green-400' :
                          order.status?.toLowerCase() === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {order.status || 'pending'}
                        </span>
                      </Table.Cell>
                      <Table.Cell>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : new Date().toLocaleDateString()}</Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}

export default AdminOrders
