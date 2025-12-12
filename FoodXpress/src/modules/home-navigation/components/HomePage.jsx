import React from "react";
import "../styles/HomePage.css";
import FeaturedCategories from "./FeaturedCategories";
import PopularDishes from "./PopularDishes";
import HowItWorks from "./HowItWorks";
import TopRestaurants from "./TopRestaurants";
import Testimonials from "./Testimonials";
import Footer from "./Footer";

const HomePage = () => {
  return (
    <div className="home-page">
      <main className="home-content">
        <FeaturedCategories />
        <PopularDishes />
        <HowItWorks />
        <TopRestaurants />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;