import { useState, useEffect, useContext } from 'react'
import { useAdminDashboardApi } from './api/useAdminDashboardApi.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card.jsx'
import StatCard from '../../../components/ui/StatCard.jsx'
import SalesLineChart from '../../../components/charts/LineChart.jsx'
import OrdersBarChart from '../../../components/charts/BarChart.jsx'
import HorizontalBarChart from '../../../components/charts/HorizontalBarChart.jsx'
import CircularProgress from '../../../components/charts/CircularProgress.jsx'
import ProgressBars from '../../../components/charts/ProgressBars.jsx'
import { CacheContext } from '../../../context/CacheContext.jsx'

function AdminDashboard() {
  const { getDashboard } = useAdminDashboardApi()
  const { getCache, setCache, isLoading, setLoading: setCacheLoading } = useContext(CacheContext)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    const cached = getCache('dashboard')
    if (cached) {
      setDashboardData(cached)
      setLoading(false)
    } else if (!isLoading('dashboard')) {
      setCacheLoading('dashboard', true)
      loadDashboard()
    }
  }, [])

  const loadDashboard = async () => {
    try {
      const response = await getDashboard()
      const data = response.data?.data || response.data || {}
      
      const chartData = data.revenueTrend ? data.revenueTrend.map(item => ({
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: item.totalRevenue || 0
      })) : []

      const topRestaurantsData = data.topRestaurants ? data.topRestaurants.map(item => ({
        name: item.restaurantName,
        value: item.orderCount
      })) : []

      const dashData = {
        ...data,
        chartData,
        topRestaurantsData
      }
      setDashboardData(dashData)
      setCache('dashboard', dashData)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
      setDashboardData({})
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Loading dashboard...</div>
  }

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's your restaurant overview.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Restaurants" 
          value={dashboardData?.totalRestaurants || 0} 
          icon="🏪"
          color="from-cyan-500 to-blue-500"
        />
        <StatCard 
          title="Pending Approval" 
          value={dashboardData?.pendingCount || 0} 
          icon="⏳"
          color="from-purple-500 to-pink-500"
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${(dashboardData?.totalRevenue || 0).toFixed(2)}`} 
          icon="💰"
          color="from-green-500 to-emerald-500"
        />
        <StatCard 
          title="Active Orders" 
          value={dashboardData?.activeOrders || 0} 
          icon="📦"
          color="from-yellow-500 to-orange-500"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <SalesLineChart data={dashboardData?.chartData || []} />
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-80">
            <CircularProgress value={92} label="Uptime" color="#22D3EE" />
          </CardContent>
        </Card>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Bar Chart */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Daily Orders</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <OrdersBarChart data={dashboardData?.chartData || []} />
            </CardContent>
          </Card>
        </div>

        {/* Progress Bars */}
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex flex-col justify-center">
            <ProgressBars data={[
              { label: 'Active', value: dashboardData?.activeRestaurants || 0 },
              { label: 'Pending', value: dashboardData?.pendingCount || 0 },
              { label: 'Inactive', value: dashboardData?.inactiveRestaurants || 0 }
            ]} />
          </CardContent>
        </Card>
      </div>

      {/* Third Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Restaurants */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Top Performing Restaurants</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <HorizontalBarChart data={dashboardData?.topRestaurantsData || []} />
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-cyan-400">98%</div>
                <div className="text-xs text-slate-400 mt-2">Uptime</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-purple-400">{dashboardData?.totalRestaurants || 0}</div>
                <div className="text-xs text-slate-400 mt-2">Restaurants</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-pink-400">{dashboardData?.activeOrders || 0}</div>
                <div className="text-xs text-slate-400 mt-2">Active Orders</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-green-400">${(dashboardData?.totalRevenue || 0).toFixed(0)}</div>
                <div className="text-xs text-slate-400 mt-2">Total Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
