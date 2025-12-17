import React, { useState, useEffect } from "react";
import "../styles/TopRestaurants.css";
import ApiService from "../services/apiService";
import { Loader } from "../../../shared";

const TopRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

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
                <img src='/NavLogo.png' alt={restaurant.name} />
              </div>
              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <p className="description">{restaurant.description || 'No description available'}</p>
                <p className="address">{restaurant.address || 'Address not available'}</p>
                <div className="restaurant-details">
                  <span className="status">Status: {restaurant.status}</span>
                  <span className="created">Since: {new Date(restaurant.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default TopRestaurants;