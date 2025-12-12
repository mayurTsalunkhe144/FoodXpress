import React, { useState, useEffect } from "react";
import "../styles/PopularDishes.css";
import ApiService from "../services/apiService";
import { Loader } from "../../../shared";

const PopularDishes = () => {
  const [popularDishes, setPopularDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularDishes = async () => {
      try {
        const dishes = await ApiService.fetchPopularMenuItems();
        setPopularDishes(dishes);
      } catch (error) {
        console.error('Error loading popular dishes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularDishes();
  }, []);
  const [addedItems, setAddedItems] = useState(new Set());
  const [loadingItems, setLoadingItems] = useState(new Set());

  const handleAddToCart = (dishId) => {
    setLoadingItems(prev => new Set([...prev, dishId]));
    
    setTimeout(() => {
      setAddedItems(prev => new Set([...prev, dishId]));
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(dishId);
        return newSet;
      });
    }, 500);
  };

  return (
    <section className="popular-dishes">
      <h2 className="popular-title">Popular Dishes</h2>
      
      <div className="dishes-grid">
        {loading ? (
          <Loader message="Loading popular dishes..." />
        ) : (
          popularDishes.map((dish) => (
          <div key={dish.id} className="dish-card">
            <div className="dish-image">
              <img src={dish.image} alt={dish.name} />
              <div className="dish-rating">
                <span>⭐ {dish.rating}</span>
              </div>
            </div>
            
            <div className="dish-info">
              <h3>{dish.name}</h3>
              <p className="dish-restaurant">{dish.restaurant}</p>
              <p className="dish-description">{dish.description}</p>
              <div className="dish-footer">
                <span className="dish-price">${dish.price}</span>
                <button 
                  className={`add-btn ${addedItems.has(dish.id) ? 'added' : ''} ${loadingItems.has(dish.id) ? 'loading' : ''}`}
                  onClick={() => handleAddToCart(dish.id)}
                  disabled={loadingItems.has(dish.id) || addedItems.has(dish.id)}
                >
                  {addedItems.has(dish.id) ? 'Added' : loadingItems.has(dish.id) ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
          ))
        )}
      </div>
    </section>
  );
};

export default PopularDishes;