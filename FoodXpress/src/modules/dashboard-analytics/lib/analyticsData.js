export const analyticsData = {
  overview: {
    totalRevenue: 125430.50,
    totalOrders: 1250,
    totalRestaurants: 45,
    totalUsers: 3420,
    activeOrders: 87,
    averageOrderValue: 100.34,
    conversionRate: 3.8,
    customerSatisfaction: 4.6
  },
  revenueTrend: [
    { date: '2024-01-15', revenue: 3200, orders: 32 },
    { date: '2024-01-16', revenue: 3800, orders: 38 },
    { date: '2024-01-17', revenue: 4200, orders: 42 },
    { date: '2024-01-18', revenue: 3900, orders: 39 },
    { date: '2024-01-19', revenue: 5100, orders: 51 },
    { date: '2024-01-20', revenue: 5800, orders: 58 },
    { date: '2024-01-21', revenue: 6200, orders: 62 },
    { date: '2024-01-22', revenue: 5900, orders: 59 }
  ],
  topRestaurants: [
    { name: 'Pizza Palace', orders: 285, revenue: 28500, rating: 4.8 },
    { name: 'Burger Barn', orders: 242, revenue: 24200, rating: 4.6 },
    { name: 'Sushi Supreme', orders: 198, revenue: 22800, rating: 4.7 },
    { name: 'Taco Fiesta', orders: 165, revenue: 16500, rating: 4.5 },
    { name: 'Pasta Paradise', orders: 142, revenue: 14200, rating: 4.4 }
  ],
  orderStatus: [
    { status: 'Delivered', count: 1050, percentage: 84 },
    { status: 'Pending', count: 87, percentage: 7 },
    { status: 'Cancelled', count: 63, percentage: 5 },
    { status: 'Failed', count: 50, percentage: 4 }
  ],
  cuisineDistribution: [
    { cuisine: 'Italian', count: 12, percentage: 26.7 },
    { cuisine: 'American', count: 10, percentage: 22.2 },
    { cuisine: 'Asian', count: 8, percentage: 17.8 },
    { cuisine: 'Mexican', count: 7, percentage: 15.6 },
    { cuisine: 'Indian', count: 5, percentage: 11.1 },
    { cuisine: 'Others', count: 3, percentage: 6.7 }
  ],
  userMetrics: {
    totalCustomers: 3420,
    newCustomers: 245,
    returningCustomers: 3175,
    activeToday: 542,
    averageOrdersPerUser: 0.37
  },
  paymentMethods: [
    { method: 'Credit Card', count: 625, percentage: 50 },
    { method: 'Debit Card', count: 312, percentage: 25 },
    { method: 'Digital Wallet', count: 187, percentage: 15 },
    { method: 'Cash', count: 126, percentage: 10 }
  ],
  peakHours: [
    { hour: '11:00', orders: 45 },
    { hour: '12:00', orders: 78 },
    { hour: '13:00', orders: 92 },
    { hour: '14:00', orders: 65 },
    { hour: '18:00', orders: 110 },
    { hour: '19:00', orders: 125 },
    { hour: '20:00', orders: 98 },
    { hour: '21:00', orders: 72 }
  ],
  topItems: [
    { name: 'Margherita Pizza', orders: 245, revenue: 2940 },
    { name: 'Classic Burger', orders: 198, revenue: 1980 },
    { name: 'Caesar Salad', orders: 156, revenue: 1560 },
    { name: 'Sushi Roll', orders: 142, revenue: 2130 },
    { name: 'Tacos', orders: 128, revenue: 1280 }
  ]
}
