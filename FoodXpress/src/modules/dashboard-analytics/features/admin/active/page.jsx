import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActiveRestaurantsApi } from './api/useActiveRestaurantsApi.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card.jsx'
import Table from '../../../components/ui/Table.jsx'
import Badge from '../../../components/ui/Badge.jsx'
import { CacheContext } from '../../../context/CacheContext.jsx'

function AdminActive() {
  const { getActive } = useActiveRestaurantsApi()
  const { getCache, setCache } = useContext(CacheContext)
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])
  const [filteredRestaurants, setFilteredRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const cached = getCache('active')
    if (cached) {
      setRestaurants(cached)
      setFilteredRestaurants(cached)
      setLoading(false)
    } else {
      loadActive()
    }
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = restaurants.filter(
        (r) =>
          r.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.cuisineType.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredRestaurants(filtered)
    } else {
      setFilteredRestaurants(restaurants)
    }
  }, [searchTerm, restaurants])

  const loadActive = async () => {
    try {
      setLoading(true)
      const response = await getActive()
      const data = response.data || []
      setRestaurants(data)
      setFilteredRestaurants(data)
      setCache('active', data)
    } catch (error) {
      console.error('Failed to load active restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">Active Restaurants</h1>
        <p className="text-slate-400">View all active restaurants on the platform</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Restaurants</CardTitle>
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition text-sm w-64"
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading active restaurants...</div>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Restaurant Name</Table.Head>
                  <Table.Head>Email</Table.Head>
                  <Table.Head>Phone</Table.Head>
                  <Table.Head>Cuisine Type</Table.Head>
                  <Table.Head>Status</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredRestaurants.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center py-8 text-slate-400">
                      {searchTerm ? 'No restaurants found' : 'No active restaurants'}
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  filteredRestaurants.map((restaurant) => (
                    <Table.Row
                      key={restaurant.restaurantId}
                      onClick={() => navigate(`/dashboard/admin/restaurant/${restaurant.restaurantId}`)}
                      className="cursor-pointer"
                    >
                      <Table.Cell className="font-medium">{restaurant.restaurantName}</Table.Cell>
                      <Table.Cell>{restaurant.email}</Table.Cell>
                      <Table.Cell>{restaurant.phone}</Table.Cell>
                      <Table.Cell>{restaurant.cuisineType}</Table.Cell>
                      <Table.Cell>
                        <Badge variant="success">{restaurant.status}</Badge>
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

export default AdminActive
