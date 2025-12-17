import { useState, useEffect } from 'react'
import { useRestaurantsApi } from '../api/useRestaurantsApi.js'

const mockMenuData = {
  1: [
    { id: 1, name: 'Paneer Tikka', price: 250, category: 'Starters' },
    { id: 2, name: 'Samosa', price: 40, category: 'Starters' },
    { id: 3, name: 'Butter Chicken', price: 350, category: 'Main Course' },
    { id: 4, name: 'Biryani', price: 300, category: 'Main Course' },
    { id: 5, name: 'Naan', price: 50, category: 'Bread' }
  ],
  2: [
    { id: 6, name: 'Classic Burger', price: 200, category: 'Burgers' },
    { id: 7, name: 'Cheese Burger', price: 250, category: 'Burgers' },
    { id: 8, name: 'French Fries', price: 100, category: 'Sides' },
    { id: 9, name: 'Coca Cola', price: 50, category: 'Beverages' }
  ],
  3: [
    { id: 10, name: 'Margherita Pizza', price: 300, category: 'Pizzas' },
    { id: 11, name: 'Pepperoni Pizza', price: 350, category: 'Pizzas' },
    { id: 12, name: 'Garlic Bread', price: 120, category: 'Sides' }
  ],
  4: [
    { id: 13, name: 'Spicy Treats Special', price: 280, category: 'Main Course' },
    { id: 14, name: 'Tandoori Chicken', price: 320, category: 'Main Course' },
    { id: 15, name: 'Roti', price: 30, category: 'Bread' }
  ],
  5: [
    { id: 16, name: 'Quinoa Salad', price: 200, category: 'Salads' },
    { id: 17, name: 'Grilled Vegetables', price: 180, category: 'Main Course' },
    { id: 18, name: 'Fresh Juice', price: 80, category: 'Beverages' }
  ]
}

export default function MenuModal({ open, restaurant, onClose }) {
  const { getMenu } = useRestaurantsApi()
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && restaurant) {
      loadMenuItems()
    }
  }, [open, restaurant])

  const loadMenuItems = async () => {
    setLoading(true)
    try {
      console.log('Fetching menu for restaurant:', restaurant.id)
      const response = await getMenu(restaurant.id)
      console.log('Menu response:', response)
      
      const data = response.data?.data || response.data || []
      console.log('Menu data:', data)
      
      if (Array.isArray(data) && data.length > 0) {
        setMenuItems(data)
      } else {
        // Use mock data if API returns empty
        const mockItems = mockMenuData[restaurant.id] || mockMenuData[1]
        setMenuItems(mockItems)
      }
    } catch (error) {
      console.error('Failed to load menu from API:', error)
      // Fallback to mock data
      const mockItems = mockMenuData[restaurant.id] || mockMenuData[1]
      setMenuItems(mockItems)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{restaurant?.name} - Menu</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">✕</button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center text-slate-400">Loading menu...</div>
          ) : menuItems.length === 0 ? (
            <div className="text-center text-slate-400">No menu items found</div>
          ) : (
            <div className="space-y-3">
              {menuItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition">
                  <div className="flex-1">
                    <p className="text-white font-semibold">{item.name}</p>
                    <p className="text-slate-400 text-sm">{item.category}</p>
                  </div>
                  <p className="text-cyan-400 font-bold ml-4">₹{item.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
