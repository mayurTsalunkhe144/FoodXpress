import React, { useState, useEffect } from "react";
import "./Restaurants.css";
import { ApiService } from "../../modules/home-navigation";
import { Loader } from "../../shared";

const Restaurants = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

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

    fetchRestaurants();
  }, []);

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
                  <div key={item.menuItemId} className="menu-item">
                    <div className="item-image">
                      <img src={item.imageUrl || '/NavLogo.png'} alt={item.name} />
                    </div>
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p className="item-description">{item.description || 'No description'}</p>
                      <div className="item-details">
                        <span className="price">${item.price}</span>
                        <span className={`availability ${item.isAvailable ? 'available' : 'unavailable'}`}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <button className="add-btn" disabled={!item.isAvailable}>
                        {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
                      </button>
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
                <img src='/NavLogo.png' alt={restaurant.name} />
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
    </div>
  );
};

export default Restaurants;