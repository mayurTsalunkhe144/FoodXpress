export const mockRestaurants = [
  { id: 1, name: 'Pizza Palace', email: 'pizza@example.com', phone: '555-0101', status: 'accepted', createdAt: '2024-01-15' },
  { id: 2, name: 'Burger Barn', email: 'burger@example.com', phone: '555-0102', status: 'pending', createdAt: '2024-01-20' },
  { id: 3, name: 'Sushi Supreme', email: 'sushi@example.com', phone: '555-0103', status: 'rejected', createdAt: '2024-01-10' },
  { id: 4, name: 'Taco Fiesta', email: 'taco@example.com', phone: '555-0104', status: 'accepted', createdAt: '2024-01-18' },
  { id: 5, name: 'Pasta Paradise', email: 'pasta@example.com', phone: '555-0105', status: 'pending', createdAt: '2024-01-22' },
]

export const mockUsers = [
  { id: 1, name: 'John Admin', email: 'admin@example.com', phone: '555-1001', role: 'admin', createdAt: '2023-12-01' },
  { id: 2, name: 'Sarah Restaurant', email: 'owner@example.com', phone: '555-1002', role: 'restaurant', createdAt: '2024-01-05' },
  { id: 3, name: 'Mike Customer', email: 'customer@example.com', phone: '555-1003', role: 'customer', createdAt: '2024-01-10' },
  { id: 4, name: 'Emma Restaurant', email: 'emma@example.com', phone: '555-1004', role: 'restaurant', createdAt: '2024-01-12' },
  { id: 5, name: 'Lisa Customer', email: 'lisa@example.com', phone: '555-1005', role: 'customer', createdAt: '2024-01-15' },
]

export const mockMenuItems = [
  { id: 1, name: 'Margherita Pizza', restaurantName: 'Pizza Palace', category: 'Pizza', price: 12.99, status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Pepperoni Pizza', restaurantName: 'Pizza Palace', category: 'Pizza', price: 14.99, status: 'active', createdAt: '2024-01-15' },
  { id: 3, name: 'Classic Burger', restaurantName: 'Burger Barn', category: 'Burgers', price: 9.99, status: 'active', createdAt: '2024-01-20' },
  { id: 4, name: 'Cheese Burger', restaurantName: 'Burger Barn', category: 'Burgers', price: 10.99, status: 'inactive', createdAt: '2024-01-20' },
  { id: 5, name: 'California Roll', restaurantName: 'Sushi Supreme', category: 'Sushi', price: 8.99, status: 'active', createdAt: '2024-01-10' },
]

export const mockCategories = [
  { id: 1, name: 'Pizza', description: 'Delicious pizzas', itemCount: 2, status: 'active', createdAt: '2024-01-01' },
  { id: 2, name: 'Burgers', description: 'Juicy burgers', itemCount: 2, status: 'active', createdAt: '2024-01-01' },
  { id: 3, name: 'Sushi', description: 'Fresh sushi', itemCount: 1, status: 'active', createdAt: '2024-01-01' },
  { id: 4, name: 'Desserts', description: 'Sweet treats', itemCount: 0, status: 'inactive', createdAt: '2024-01-05' },
]

export const mockOrders = [
  { id: 1, orderId: 'ORD-001', customerName: 'John Doe', restaurantName: 'Pizza Palace', totalAmount: 35.97, status: 'delivered', createdAt: '2024-01-20' },
  { id: 2, orderId: 'ORD-002', customerName: 'Jane Smith', restaurantName: 'Burger Barn', totalAmount: 28.50, status: 'confirmed', createdAt: '2024-01-21' },
  { id: 3, orderId: 'ORD-003', customerName: 'Bob Johnson', restaurantName: 'Sushi Supreme', totalAmount: 45.00, status: 'pending', createdAt: '2024-01-22' },
  { id: 4, orderId: 'ORD-004', customerName: 'Alice Brown', restaurantName: 'Pizza Palace', totalAmount: 22.50, status: 'cancelled', createdAt: '2024-01-22' },
  { id: 5, orderId: 'ORD-005', customerName: 'Charlie Wilson', restaurantName: 'Taco Fiesta', totalAmount: 31.25, status: 'delivered', createdAt: '2024-01-21' },
]

export const mockAnalytics = {
  totalRevenue: 15420.50,
  totalOrders: 342,
  activeRestaurants: 4,
  totalUsers: 156,
  avgOrderValue: 45.06,
  conversionRate: 3.2,
  satisfaction: 4.6,
  revenueTrend: [
    { date: '2024-01-16', totalRevenue: 1200 },
    { date: '2024-01-17', totalRevenue: 1450 },
    { date: '2024-01-18', totalRevenue: 1800 },
    { date: '2024-01-19', totalRevenue: 1600 },
    { date: '2024-01-20', totalRevenue: 2100 },
    { date: '2024-01-21', totalRevenue: 2300 },
    { date: '2024-01-22', totalRevenue: 2570 },
  ],
  topRestaurants: [
    { restaurantName: 'Pizza Palace', orderCount: 85 },
    { restaurantName: 'Burger Barn', orderCount: 72 },
    { restaurantName: 'Sushi Supreme', orderCount: 65 },
    { restaurantName: 'Taco Fiesta', orderCount: 58 },
  ],
}
