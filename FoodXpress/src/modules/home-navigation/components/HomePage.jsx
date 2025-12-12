import React from "react";
import FeaturedCategories from "./FeaturedCategories";
import PopularDishes from "./PopularDishes";
import HowItWorks from "./HowItWorks";
import TopRestaurants from "./TopRestaurants";
import Testimonials from "./Testimonials";

const HomePage = () => {
  return (
    <main>
      <FeaturedCategories />
      <PopularDishes />
      <HowItWorks />
      <TopRestaurants />
      <Testimonials />
    </main>
  );
};

export default HomePage;