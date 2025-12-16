import React, { useState, useEffect } from "react";
import "../styles/FeaturedCategories.css";
import ApiService from "../services/apiService";
import { Loader } from "../../../shared";

const categoryImages = {
  "Pizza": "/Pizza.png",
  "Burgers": "/Burger.png",
  "Desserts": "/Dessert.png",
  "Healthy Meals": "/HealthyMeals.png",
  "Drinks": "/Drinks.png",
  "South Indian": "/South.png",
};

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ApiService.fetchCategories();
        const categoriesWithImages = data.map((category, index) => ({
          id: index + 1,
          name: typeof category === 'string' ? category : category.name,
          image: categoryImages[typeof category === 'string' ? category : category.name] || "/NavLogo.png"
        }));
        setCategories(categoriesWithImages);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const duplicatedCategories = [...categories, ...categories];

  return (
    <section className="categories">
      <h2 className="categories-title">Featured Categories</h2>

      <div className="categories-slider">
        <div className="categories-track">
          {loading ? (
            <Loader message="Loading categories..." />
          ) : (
            duplicatedCategories.map((cat, index) => (
              <div key={`${cat.id}-${index}`} className="category-card">
                <div className="category-icon">
                  <img src={cat.image} alt={cat.name} />
                </div>
                <p>{cat.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;