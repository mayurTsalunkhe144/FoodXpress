import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRejectedRestaurantsApi } from './api/useRejectedRestaurantsApi.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card.jsx'
import Table from '../../../components/ui/Table.jsx'
import Badge from '../../../components/ui/Badge.jsx'
import { CacheContext } from '../../../context/CacheContext.jsx'

function AdminRejected() {
  const { getRejected } = useRejectedRestaurantsApi()
  const { getCache, setCache } = useContext(CacheContext)
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = getCache('rejected')
    if (cached) {
      setRestaurants(cached)
      setLoading(false)
    } else {
      loadRejected()
    }
  }, [])

  const loadRejected = async () => {
    try {
      setLoading(true)
      const response = await getRejected()
      const data = response.data || []
      setRestaurants(data)
      setCache('rejected', data)
    } catch (error) {
      console.error('Failed to load rejected restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">Rejected Restaurants</h1>
        <p className="text-slate-400">View all rejected restaurant applications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rejected Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading rejected restaurants...</div>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Restaurant Name</Table.Head>
                  <Table.Head>Email</Table.Head>
                  <Table.Head>Phone</Table.Head>
                  <Table.Head>Rejection Reason</Table.Head>
                  <Table.Head>Status</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {restaurants.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center py-8 text-slate-400">
                      No rejected restaurants
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  restaurants.map((restaurant) => (
                    <Table.Row
                      key={restaurant.restaurantId}
                      onClick={() => navigate(`/dashboard/admin/restaurant/${restaurant.restaurantId}`)}
                      className="cursor-pointer"
                    >
                      <Table.Cell className="font-medium">{restaurant.restaurantName}</Table.Cell>
                      <Table.Cell>{restaurant.email}</Table.Cell>
                      <Table.Cell>{restaurant.phone}</Table.Cell>
                      <Table.Cell className="max-w-md text-slate-400">
                        {restaurant.rejectionReason || 'No reason provided'}
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant="danger">{restaurant.status}</Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminRejected
