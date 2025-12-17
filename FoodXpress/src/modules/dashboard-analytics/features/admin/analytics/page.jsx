import { useState, useEffect, useContext } from 'react'
import { useAnalyticsApi } from './api/useAnalyticsApi.js'
import { analyticsData } from '../../../lib/analyticsData.js'
import { CacheContext } from '../../../context/CacheContext.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card.jsx'
import StatCard from '../../../components/ui/StatCard.jsx'
import SalesLineChart from '../../../components/charts/LineChart.jsx'
import OrdersBarChart from '../../../components/charts/BarChart.jsx'
import HorizontalBarChart from '../../../components/charts/HorizontalBarChart.jsx'

function AdminAnalytics() {
  const { getDashboard } = useAnalyticsApi()
  const { getCache, setCache } = useContext(CacheContext)
  const [data, setData] = useState(analyticsData)
  const [userStats, setUserStats] = useState({ totalUsers: 3420, customers: 2850, restaurants: 450, admins: 120 })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7days')

  useEffect(() => {
    const cached = getCache('analytics')
    if (cached) {
      setData(cached.data)
      setUserStats(cached.userStats)
      setLoading(false)
    } else {
      loadAnalytics()
    }
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const response = await getDashboard()
      const apiData = response.data?.data || response.data
      
      let newData = analyticsData
      if (apiData && apiData.totalRestaurants) {
        newData = {
          overview: {
            totalRevenue: apiData.totalRevenue || 0,
            totalOrders: apiData.totalOrders || 0,
            totalRestaurants: apiData.totalRestaurants || 0,
            totalUsers: apiData.totalUsers || 0,
            activeOrders: apiData.activeOrders || 0,
            averageOrderValue: apiData.avgOrderValue || 0,
            conversionRate: apiData.conversionRate || 0,
            customerSatisfaction: apiData.satisfaction || 0
          },
          revenueTrend: apiData.revenueTrend || analyticsData.revenueTrend,
          topRestaurants: apiData.topRestaurants || analyticsData.topRestaurants,
          orderStatus: analyticsData.orderStatus,
          cuisineDistribution: analyticsData.cuisineDistribution,
          userMetrics: {
            totalCustomers: apiData.totalUsers || 0,
            newCustomers: apiData.newCustomers || 0,
            returningCustomers: (apiData.totalUsers || 0) - (apiData.newCustomers || 0),
            activeToday: apiData.activeToday || 0,
            averageOrdersPerUser: (apiData.totalOrders || 0) / (apiData.totalUsers || 1)
          },
          paymentMethods: analyticsData.paymentMethods,
          peakHours: analyticsData.peakHours,
          topItems: analyticsData.topItems
        }
      }
      setData(newData)

      let stats = { totalUsers: 3420, customers: 2850, restaurants: 450, admins: 120 }
      try {
        const userResponse = await fetch('http://localhost:5000/api/admin/users/all')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          if (userData.data) {
            stats = userData.data
          }
        }
      } catch (err) {
        console.error('Failed to fetch users:', err)
      }
      setUserStats(stats)
      setCache('analytics', { data: newData, userStats: stats })
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setData(analyticsData)
    } finally {
      setLoading(false)
    }
  }

  const chartData = data.revenueTrend.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.revenue
  }))

  const ordersChartData = data.revenueTrend.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.orders
  }))

  const topRestaurantsData = data.topRestaurants.map(item => ({
    name: item.name,
    value: item.orders
  }))

  const peakHoursData = data.peakHours.map(item => ({
    name: item.hour,
    value: item.orders
  }))

  const topItemsData = data.topItems.map(item => ({
    name: item.name,
    value: item.orders
  }))

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Loading analytics...</div>
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">Analytics</h1>
          <p className="text-slate-400">Comprehensive system analytics and insights</p>
        </div>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${(data.overview.totalRevenue / 1000).toFixed(1)}K`} 
          icon="💰"
          color="from-green-500 to-emerald-500"
        />
        <StatCard 
          title="Total Orders" 
          value={data.overview.totalOrders} 
          icon="📦"
          color="from-blue-500 to-cyan-500"
        />
        <StatCard 
          title="Active Restaurants" 
          value={data.overview.totalRestaurants} 
          icon="🏪"
          color="from-purple-500 to-pink-500"
        />
        <StatCard 
          title="Total Users" 
          value={userStats.totalUsers} 
          icon="👥"
          color="from-yellow-500 to-orange-500"
        />
      </div>

      {/* Revenue and Orders Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <SalesLineChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Daily Orders</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <OrdersBarChart data={ordersChartData} />
          </CardContent>
        </Card>
      </div>

      {/* Top Restaurants and Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Restaurants</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <HorizontalBarChart data={topRestaurantsData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Order Hours</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <OrdersBarChart data={peakHoursData} />
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Average Order Value</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-4xl font-bold text-cyan-400">${data.overview.averageOrderValue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-4xl font-bold text-green-400">{data.overview.conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-4xl font-bold text-purple-400">{data.overview.customerSatisfaction.toFixed(1)}/5</div>
          </CardContent>
        </Card>
      </div>

      {/* User Breakdown by Role */}
      <Card>
        <CardHeader>
          <CardTitle>Users by Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-800 rounded-lg">
              <div className="text-3xl font-bold text-green-400">{userStats.customers || 0}</div>
              <div className="text-sm text-slate-400 mt-2">Customers</div>
            </div>
            <div className="text-center p-4 bg-slate-800 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">{userStats.restaurants || 0}</div>
              <div className="text-sm text-slate-400 mt-2">Restaurants</div>
            </div>
            <div className="text-center p-4 bg-slate-800 rounded-lg">
              <div className="text-3xl font-bold text-purple-400">{userStats.admins || 0}</div>
              <div className="text-sm text-slate-400 mt-2">Admins</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.orderStatus.map((item) => (
              <div key={item.status}>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300">{item.status}</span>
                  <span className="text-cyan-400 font-semibold">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cuisine Distribution and Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cuisine Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.cuisineDistribution.map((item) => (
                <div key={item.cuisine} className="flex justify-between items-center">
                  <span className="text-slate-300">{item.cuisine}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-cyan-400 text-sm font-semibold w-12 text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.paymentMethods.map((item) => (
                <div key={item.method} className="flex justify-between items-center">
                  <span className="text-slate-300">{item.method}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-cyan-400 text-sm font-semibold w-12 text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Menu Items */}
      <Card>
        <CardHeader>
          <CardTitle>Top Menu Items</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <HorizontalBarChart data={topItemsData} />
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminAnalytics
