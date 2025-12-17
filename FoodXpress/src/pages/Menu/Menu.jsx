import React, { useState, useEffect } from "react";
import "./Menu.css";
import { ApiService } from "../../modules/home-navigation";
import { Loader } from "../../shared";

const getMenuItemEmoji = (name) => {
  const lowerName = name.toLowerCase();
  const emojiMap = {
    "pizza": "🍕", "burger": "🍔", "pasta": "🍝", "noodles": "🍜", "rice": "🍚",
    "soup": "🍲", "salad": "🥗", "sandwich": "🥪", "wrap": "🌯", "taco": "🌮",
    "chicken": "🍗", "beef": "🥩", "fish": "🐟", "cake": "🍰", "coffee": "☕"
  };
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (lowerName.includes(key)) return emoji;
  }
  return "🍽️";
};

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, menuData] = await Promise.all([
          ApiService.fetchCategories(),
          ApiService.fetchMenuItems()
        ]);
        
        const categoryNames = categoriesData.map(cat => cat.name || cat);
        setCategories(["All", ...categoryNames]);
        setMenuItems(menuData);
      } catch (error) {
        console.error('Error loading menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = selectedCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category?.name === selectedCategory || item.category === selectedCategory);

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({...prev, [itemId]: true}));
  };

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Discover delicious food from various cuisines</p>
      </div>

      <div className="menu-categories">
        {categories.map((category, index) => (
          <button
            key={`category-${index}`}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {loading ? (
          <Loader message="Loading menu items..." />
        ) : (
          filteredItems.map(item => (
            <div key={item.menuItemId || item.id} className="menu-item">
              <div className="item-image">
                {item.imageUrl && !imageErrors[item.menuItemId || item.id] ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    onError={() => handleImageError(item.menuItemId || item.id)}
                  />
                ) : (
                  <span className="menu-emoji">{getMenuItemEmoji(item.name)}</span>
                )}
              </div>
              <div className="item-info">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <p className="restaurant-name">{item.category?.restaurant?.name || item.restaurant?.name}</p>
                <div className="item-details">
                  <span className="price">${item.price}</span>
                </div>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Menu;
