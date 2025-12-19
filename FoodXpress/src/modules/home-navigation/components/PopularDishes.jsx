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

    setAddedItems(prev => new Set([...prev, dish.menuItemId]));
    
    try {
      await cartService.addItem({
        menuItemId: dish.menuItemId,
        quantity: 1,
        price: dish.price
      });
      
      console.log(`Added ${dish.name} to cart`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setAddedItems(prev => {
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
            <div key={dish.menuItemId} className="food-card">
              <div className="popular-badge">
                <span className="badge-text">🔥 Popular</span>
              </div>
              <div className="food-image">
                <div className="food-placeholder">
                  <span>{getFoodEmoji(dish.name)}</span>
                </div>
              </div>
              <div className="food-content">
                <h3 className="food-name">{dish.name}</h3>
                <p className="food-restaurant">{dish.category?.restaurant?.name || 'Restaurant'}</p>
                <p className="food-desc">{dish.description || 'Delicious food item'}</p>
                <div className="food-bottom">
                  <span className="food-price">${dish.price}</span>
                  <button 
                    className={`cart-btn ${addedItems.has(dish.menuItemId) ? 'added' : ''}`}
                    onClick={() => handleAddToCart(dish)}
                    disabled={addedItems.has(dish.menuItemId) || !dish.isAvailable}
                  >
                    {addedItems.has(dish.menuItemId) ? 'Added' : 'Add to Cart'}
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
