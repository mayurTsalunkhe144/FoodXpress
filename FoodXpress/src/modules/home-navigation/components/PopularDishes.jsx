import React, { useState, useEffect } from "react";
import "../styles/PopularDishes.css";
import ApiService from "../services/apiService";
import cartService from "../services/cartService";
import { Loader } from "../../../shared";
import LoginModal from "./LoginModal";

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

const getFoodEmoji = (name) => {
  const lowerName = name.toLowerCase();
  for (const [key, emoji] of Object.entries(foodEmojis)) {
    if (lowerName.includes(key)) return emoji;
  }
  return "🍽️";
};

const PopularDishes = () => {
  const [popularDishes, setPopularDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [addedItems, setAddedItems] = useState(new Set());
  const [loadingItems, setLoadingItems] = useState(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchPopularDishes = async () => {
      try {
        const dishes = await ApiService.fetchPopularMenuItems();
        console.log('Fetched dishes:', dishes);
        dishes.forEach(d => console.log(`${d.name}: ${d.imageUrl}`));
        setPopularDishes(dishes);
      } catch (error) {
        console.error('Error loading popular dishes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularDishes();
  }, []);

  const handleAddToCart = async (dish) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    setLoadingItems(prev => new Set([...prev, dish.menuItemId]));
    
    try {
      await cartService.addItem({
        menuItemId: dish.menuItemId,
        quantity: 1,
        price: dish.price
      });
      
      setAddedItems(prev => new Set([...prev, dish.menuItemId]));
      console.log(`Added ${dish.name} to cart`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(dish.menuItemId);
        return newSet;
      });
    }
  };

  const handleImageError = (dishId) => {
    console.log(`Image failed to load for dish ${dishId}`);
    setImageErrors(prev => ({...prev, [dishId]: true}));
  };

  return (
    <>
      <section className="popular-dishes">
        <h2 className="popular-title">Popular Dishes</h2>
        
        <div className="dishes-grid">
          {loading ? (
            <Loader message="Loading popular dishes..." />
          ) : (
            popularDishes.map((dish) => (
            <div key={dish.menuItemId} className="dish-card">
              <div className="dish-image">
                {dish.imageUrl && !imageErrors[dish.menuItemId] ? (
                  <img 
                    src={dish.imageUrl} 
                    alt={dish.name}
                    crossOrigin="anonymous"
                    onError={() => handleImageError(dish.menuItemId)}
                  />
                ) : (
                  <div className="dish-emoji-placeholder">
                    <span className="dish-emoji">{getFoodEmoji(dish.name)}</span>
                  </div>
                )}
              </div>
              
              <div className="dish-info">
                <h3>{dish.name}</h3>
                <p className="dish-restaurant">{dish.category?.restaurant?.name || 'Restaurant'}</p>
                <p className="dish-description">{dish.description || 'No description available'}</p>
                <div className="dish-footer">
                  <span className="dish-price">${dish.price}</span>
                  <button 
                    className={`add-btn ${addedItems.has(dish.menuItemId) ? 'added' : ''} ${loadingItems.has(dish.menuItemId) ? 'loading' : ''}`}
                    onClick={() => handleAddToCart(dish)}
                    disabled={loadingItems.has(dish.menuItemId) || addedItems.has(dish.menuItemId) || !dish.isAvailable}
                  >
                    {!dish.isAvailable ? 'Unavailable' : addedItems.has(dish.menuItemId) ? 'Added ✓' : loadingItems.has(dish.menuItemId) ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </section>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default PopularDishes;
