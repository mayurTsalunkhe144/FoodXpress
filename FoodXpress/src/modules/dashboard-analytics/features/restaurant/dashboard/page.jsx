import { useState, useEffect, useRef } from 'react'
import { useDashboardApi } from './api/useDashboardApi.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import StatCard from '../../../components/ui/StatCard.jsx'
import SalesLineChart from '../../../components/charts/LineChart.jsx'
import OrdersBarChart from '../../../components/charts/BarChart.jsx'
import HorizontalBarChart from '../../../components/charts/HorizontalBarChart.jsx'
import CircularProgress from '../../../components/charts/CircularProgress.jsx'
import ProgressBars from '../../../components/charts/ProgressBars.jsx'
import { getUserFromStorage } from '../../../utils/auth.js'

function RestaurantDashboard() {
  const { getDashboard } = useDashboardApi()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const [showFallbackToast, setShowFallbackToast] = useState(false)
  const user = getUserFromStorage()
  const restaurantIdFromStorage = localStorage.getItem('restaurantId')
  const restaurantId = restaurantIdFromStorage ? parseInt(restaurantIdFromStorage) : (user?.userId || 2)
  const hasLoaded = useRef(false)
  
  // Show toast if using fallback
  useEffect(() => {
    if (!user) {
      setShowFallbackToast(true)
      const timer = setTimeout(() => setShowFallbackToast(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [user])

  useEffect(() => {
    if (hasLoaded.current) return
    hasLoaded.current = true
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const response = await getDashboard(restaurantId)
      const data = response.data?.data || response.data || {}
      
      const chartData = data.dailySalesChart ? data.dailySalesChart.map(item => ({
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: item.totalSales || 0
      })) : []

      const barChartData = data.dailySalesChart ? data.dailySalesChart.map(item => ({
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: item.totalOrders || 0
      })) : []

      const topItemsData = data.topItems ? data.topItems.map(item => ({
        name: item.itemName,
        value: item.quantitySold
      })) : []

      setDashboardData({
        ...data,
        chartData,
        barChartData,
        topItemsData
      })
    } catch (error) {
      console.error('Failed to load dashboard:', error)
      setDashboardData({})
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</div>
  }

  return (
    <div className="space-y-8 pb-8">
      {showFallbackToast && (
        <div className="fixed top-20 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          ⚠️ Using demo data - Please login for real restaurant data
        </div>
      )}
      
      <div>
        <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Restaurant Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your restaurant performance and analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Orders" 
          value={dashboardData?.todayOrders || 0} 
          icon="📦"
          color="from-cyan-500 to-blue-500"
        />
        <StatCard 
          title="Today's Revenue" 
          value={`$${(dashboardData?.todayRevenue || 0).toFixed(2)}`} 
          icon="💰"
          color="from-green-500 to-emerald-500"
        />
        <StatCard 
          title="Monthly Orders" 
          value={dashboardData?.monthlyOrders || 0} 
          icon="📊"
          color="from-purple-500 to-pink-500"
        />
        <StatCard 
          title="Avg Rating" 
          value={(dashboardData?.averageRating || 0).toFixed(1)} 
          icon="⭐"
          color="from-yellow-500 to-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <SalesLineChart data={dashboardData?.chartData || []} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Completion</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-80">
            <CircularProgress value={85} label="Completed" color="#22D3EE" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Weekly Orders</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <OrdersBarChart data={dashboardData?.barChartData || []} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex flex-col justify-center">
            <ProgressBars data={[
              { label: 'Completed', value: dashboardData?.completedOrders || 0 },
              { label: 'Pending', value: dashboardData?.pendingOrders || 0 },
              { label: 'Cancelled', value: dashboardData?.cancelledOrders || 0 }
            ]} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <HorizontalBarChart data={dashboardData?.topItemsData || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="flex flex-col items-center justify-center">
                <div className="text-4xl font-bold" style={{ color: 'var(--primary-red)' }}>{dashboardData?.todayOrders || 0}</div>
                <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>Today Orders</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-4xl font-bold" style={{ color: 'var(--primary-red)' }}>{dashboardData?.totalReviews || 0}</div>
                <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>Total Reviews</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-4xl font-bold" style={{ color: 'var(--primary-red)' }}>{dashboardData?.cancelledOrders || 0}</div>
                <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>Cancelled</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-4xl font-bold" style={{ color: '#28a745' }}>${(dashboardData?.monthlyRevenue || 0).toFixed(0)}</div>
                <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>Monthly Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RestaurantDashboard
