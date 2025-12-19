import React, { useState, useEffect } from "react";
import "./Menu.css";
import { ApiService } from "../../modules/home-navigation";
import { Loader } from "../../shared";
import cartService from "../../modules/home-navigation/services/cartService";
import LoginModal from "../../modules/home-navigation/components/LoginModal";

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
  const [addedItems, setAddedItems] = useState(new Set());
  const [loadingItems, setLoadingItems] = useState(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  // Search functionality
  const searchQuery = new URLSearchParams(window.location.search).get('search');
  const searchFilteredItems = searchQuery 
    ? filteredItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.restaurant?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredItems;

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({...prev, [itemId]: true}));
  };

  const handleAddToCart = async (item) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    const itemId = item.menuItemId || item.id;
    setAddedItems(prev => new Set([...prev, itemId]));
    
    try {
      await cartService.addItem({
        menuItemId: itemId,
        quantity: 1,
        price: item.price
      });
      
      console.log(`Added ${item.name} to cart`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
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
        ) : searchQuery && searchFilteredItems.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
            <h3>No results found for "{searchQuery}"</h3>
            <p>Try searching for different food items or restaurants</p>
          </div>
        ) : (
          searchFilteredItems.map(item => (
            <div key={item.menuItemId || item.id} className="food-card">
              <div className="food-image">
                <div className="food-placeholder">
                  <span>{getMenuItemEmoji(item.name)}</span>
                </div>
              </div>
              <div className="food-content">
                <h3 className="food-name">{item.name}</h3>
                <p className="food-restaurant">{item.category?.restaurant?.name || item.restaurant?.name}</p>
                <p className="food-desc">{item.description || 'Delicious menu item'}</p>
                <div className="food-bottom">
                  <span className="food-price">${item.price}</span>
                  <button 
                    className={`cart-btn ${addedItems.has(item.menuItemId || item.id) ? 'added' : ''}`}
                    onClick={() => handleAddToCart(item)}
                    disabled={addedItems.has(item.menuItemId || item.id)}
                  >
                    {addedItems.has(item.menuItemId || item.id) ? 'Added' : 'Add to Cart'}
                  </button>
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

export default Menu;
