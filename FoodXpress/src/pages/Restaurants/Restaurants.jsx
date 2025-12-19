import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Restaurants.css";
import { ApiService } from "../../modules/home-navigation";
import { Loader } from "../../shared";
import cartService from "../../modules/home-navigation/services/cartService";
import LoginModal from "../../modules/home-navigation/components/LoginModal";

const getFoodEmoji = (name) => {
  const lowerName = name.toLowerCase();
  const foodEmojis = {
    "pizza": "🍕", "burger": "🍔", "pasta": "🍝", "noodles": "🍜", "rice": "🍚",
    "soup": "🍲", "salad": "🥗", "sandwich": "🥪", "wrap": "🌯", "taco": "🌮",
    "sushi": "🍣", "chicken": "🍗", "beef": "🥩", "fish": "🐟", "shrimp": "🦐",
    "cake": "🍰", "cookie": "🍪", "ice cream": "🍦", "donut": "🍩", "pie": "🥧",
    "coffee": "☕", "tea": "🍵", "juice": "🧃", "smoothie": "🥤", "milkshake": "🥛",
    "bread": "🍞", "croissant": "🥐", "bagel": "🥯", "pancake": "🥞", "waffle": "🧇",
    "egg": "🥚", "bacon": "🥓", "cheese": "🧀", "avocado": "🥑", "tomato": "🍅",
    "fries": "🍟", "hot dog": "🌭", "pretzel": "🥨", "popcorn": "🍿", "chips": "🥔"
  };
  for (const [key, emoji] of Object.entries(foodEmojis)) {
    if (lowerName.includes(key)) return emoji;
  }
  return "🍽️";
};

const getRestaurantEmoji = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('spicy treat')) return '🌶️';
  if (lowerName.includes('healthy point')) return '🥗';
  if (lowerName.includes('biryani house')) return '🍚';
  if (lowerName.includes('pizza')) return '🍕';
  if (lowerName.includes('burger') || lowerName.includes('grill')) return '🍔';
  if (lowerName.includes('chinese') || lowerName.includes('noodle')) return '🥢';
  if (lowerName.includes('indian') || lowerName.includes('curry')) return '🍛';
  if (lowerName.includes('italian') || lowerName.includes('pasta')) return '🍝';
  if (lowerName.includes('mexican') || lowerName.includes('taco')) return '🌮';
  if (lowerName.includes('sushi') || lowerName.includes('japanese')) return '🍣';
  if (lowerName.includes('cafe') || lowerName.includes('coffee')) return '☕';
  if (lowerName.includes('bakery') || lowerName.includes('bread')) return '🥖';
  if (lowerName.includes('bbq') || lowerName.includes('barbecue')) return '🍖';
  return '🏪';
};

const Restaurants = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedItems, setAddedItems] = useState(new Set());
  const [loadingItems, setLoadingItems] = useState(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await ApiService.fetchRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error('Error loading restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    // Check if restaurant was passed from TopRestaurants
    if (location.state?.selectedRestaurant) {
      setSelectedRestaurant(location.state.selectedRestaurant);
      setLoading(false);
    } else {
      fetchRestaurants();
    }
  }, [location.state]);

  const handleRestaurantClick = async (restaurant) => {
    try {
      const fullRestaurant = await ApiService.fetchRestaurant(restaurant.restaurantId);
      setSelectedRestaurant(fullRestaurant);
    } catch (error) {
      console.error('Error loading restaurant details:', error);
    }
  };

  const handleBackClick = () => {
    setSelectedRestaurant(null);
  };

  const handleAddToCart = async (item) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    setAddedItems(prev => new Set([...prev, item.menuItemId]));
    
    try {
      await cartService.addItem({
        menuItemId: item.menuItemId,
        quantity: 1,
        price: item.price
      });
      
      console.log(`Added ${item.name} to cart`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.menuItemId);
        return newSet;
      });
    }
  };

  if (selectedRestaurant) {
    return (
      <div className="restaurant-menu">
        <button className="back-btn" onClick={handleBackClick}>
          ← Back to Restaurants
        </button>
        <div className="restaurant-header">
          <div className="restaurant-icon">
            <img src='/NavLogo.png' alt={selectedRestaurant.name} />
          </div>
          <div className="restaurant-details">
            <h1>{selectedRestaurant.name}</h1>
            <p>📍 {selectedRestaurant.address || 'Address not available'}</p>
            <p>{selectedRestaurant.description || 'No description available'}</p>
            <p>Status: {selectedRestaurant.status}</p>
          </div>
        </div>
        
        <div className="menu-categories">
          <h2>Menu Categories</h2>
          {selectedRestaurant.menuCategories?.map(category => (
            <div key={category.categoryId} className="category-section">
              <h3>{category.name}</h3>
              <div className="menu-grid">
                {category.menuItems?.map(item => (
                  <div key={item.menuItemId} className="food-card">
                    <div className="food-image">
                      <div className="food-placeholder">
                        <span>{getFoodEmoji(item.name)}</span>
                      </div>
                    </div>
                    <div className="food-content">
                      <h3 className="food-name">{item.name}</h3>
                      <p className="food-desc">{item.description || 'Delicious item'}</p>
                      <div className="food-bottom">
                        <span className="food-price">${item.price}</span>
                        <button 
                          className={`cart-btn ${addedItems.has(item.menuItemId) ? 'added' : ''}`}
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.isAvailable || addedItems.has(item.menuItemId)}
                        >
                          {addedItems.has(item.menuItemId) ? 'Added' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                )) || <p>No items in this category</p>}
              </div>
            </div>
          )) || <p>No menu categories available</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="restaurants-page">
      <div className="restaurants-header">
        <h1>Restaurants Near You</h1>
        <p>Choose from our partner restaurants</p>
      </div>

      <div className="restaurants-grid">
        {loading ? (
          <Loader message="Loading restaurants..." />
        ) : (
          restaurants.map(restaurant => (
            <div 
              key={restaurant.restaurantId} 
              className="restaurant-card"
              onClick={() => handleRestaurantClick(restaurant)}
            >
              <div className="restaurant-image">
                <span className="restaurant-emoji">{getRestaurantEmoji(restaurant.name)}</span>
              </div>
              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <p className="description">{restaurant.description || 'No description available'}</p>
                <div className="restaurant-meta">
                  <span className="status">Status: {restaurant.status}</span>
                  <span className="address">{restaurant.address || 'Address not available'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default Restaurants;