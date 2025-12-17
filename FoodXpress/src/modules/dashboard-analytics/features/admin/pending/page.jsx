import { useState, useEffect, useContext } from 'react'
import { usePendingRestaurantsApi } from './api/usePendingRestaurantsApi.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card.jsx'
import PendingTable from './components/PendingTable.jsx'
import { CacheContext } from '../../../context/CacheContext.jsx'

function AdminPending() {
  const { getPending } = usePendingRestaurantsApi()
  const { getCache, setCache } = useContext(CacheContext)
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = getCache('pending')
    if (cached) {
      setRestaurants(cached)
      setLoading(false)
    } else {
      loadPending()
    }
  }, [])

  const loadPending = async () => {
    try {
      setLoading(true)
      const response = await getPending()
      const data = response.data || []
      setRestaurants(data)
      setCache('pending', data)
    } catch (error) {
      console.error('Failed to load pending restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">Pending Restaurants</h1>
        <p className="text-slate-400">Review and approve pending restaurant applications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading pending restaurants...</div>
          ) : (
            <PendingTable restaurants={restaurants} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminPending
