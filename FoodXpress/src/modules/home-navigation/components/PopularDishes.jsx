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
          <div key={dish.menuItemId} className="dish-card">
            <div className="dish-image">
              <img src={dish.imageUrl || '/NavLogo.png'} alt={dish.name} />
            </div>
            
            <div className="dish-info">
              <h3>{dish.name}</h3>
              <p className="dish-restaurant">{dish.category?.restaurant?.name || 'Restaurant'}</p>
              <p className="dish-description">{dish.description || 'No description available'}</p>
              <div className="dish-footer">
                <span className="dish-price">${dish.price}</span>
                <button 
                  className={`add-btn ${addedItems.has(dish.menuItemId) ? 'added' : ''} ${loadingItems.has(dish.menuItemId) ? 'loading' : ''}`}
                  onClick={() => handleAddToCart(dish.menuItemId)}
                  disabled={loadingItems.has(dish.menuItemId) || addedItems.has(dish.menuItemId) || !dish.isAvailable}
                >
                  {!dish.isAvailable ? 'Unavailable' : addedItems.has(dish.menuItemId) ? 'Added' : loadingItems.has(dish.menuItemId) ? 'Adding...' : 'Add to Cart'}
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