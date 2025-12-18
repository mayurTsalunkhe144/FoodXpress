import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TopRestaurants.css";
import ApiService from "../services/apiService";
import { Loader } from "../../../shared";

const restaurantEmojis = {
  "biryani house": "🍚", "biryani": "🍚", "rice": "🍚", "hyderabadi": "🍚",
  "spicy treats": "🌶️", "spicy": "🌶️", "hot": "🌶️", "chili": "🌶️", "pepper": "🌶️",
  "pizza": "🍕", "pizzeria": "🍕", "burger": "🍔", "grill": "🔥", "bbq": "🍖",
  "chinese": "🥢", "italian": "🍝", "mexican": "🌮", "indian": "🍛", "thai": "🍜",
  "japanese": "🍣", "sushi": "🍣", "korean": "🍲", "cafe": "☕", "coffee": "☕",
  "bakery": "🥖", "deli": "🥪", "bistro": "🍽️", "steakhouse": "🥩", "seafood": "🦐",
  "taco": "🌮", "noodle": "🍜", "ramen": "🍜", "pho": "🍜", "curry": "🍛",
  "sandwich": "🥪", "sub": "🥪", "wrap": "🌯", "salad": "🥗", "healthy": "🥗",
  "fast": "🍟", "quick": "🍟", "express": "🍟", "drive": "🍟", "takeout": "🍟",
  "fine": "🍽️", "dining": "🍽️", "restaurant": "🍽️", "eatery": "🍽️", "kitchen": "🍳"
};

const getRestaurantEmoji = (name) => {
  const lowerName = name.toLowerCase();
  for (const [key, emoji] of Object.entries(restaurantEmojis)) {
    if (lowerName.includes(key)) return emoji;
  }
  return "🍽️";
};

const TopRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await ApiService.fetchRestaurants();
        setRestaurants(data.slice(0, 6)); // Show top 6 restaurants
      } catch (error) {
        console.error('Error loading restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleViewMenu = (restaurantId) => {
    navigate(`/restaurants?restaurantId=${restaurantId}`);
  };

  return (
    <section className="top-restaurants">
      <h2 className="restaurants-title">Top Restaurants</h2>
      
      <div className="restaurants-container">
        {loading ? (
          <Loader message="Loading restaurants..." />
        ) : (
          restaurants.map((restaurant) => (
            <div key={restaurant.restaurantId} className="restaurant-card">
              <div className="restaurant-image">
                <span className="food-emoji">{getRestaurantEmoji(restaurant.name)}</span>
              </div>
              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <p className="description">{restaurant.description || 'No description available'}</p>
                <p className="address">{restaurant.address || 'Address not available'}</p>
                <div className="restaurant-details">
                  <span className="status">Status: {restaurant.status}</span>
                  <span className="created">Since: {new Date(restaurant.createdAt).getFullYear()}</span>
                </div>
                <button 
                  className="view-menu-btn"
                  onClick={() => handleViewMenu(restaurant.restaurantId)}
                >
                  View Menu
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default TopRestaurants;
