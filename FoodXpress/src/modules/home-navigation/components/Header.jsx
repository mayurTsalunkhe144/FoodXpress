import React, { useEffect, useState } from "react";
import "../styles/Header.css";

const banners = [
  {
    id: 1,
    image: "/banner1.jpg",
    title: "Delicious Food Delivered",
    subtitle: "Fresh meals from your favorite restaurants.",
  },
  {
    id: 2,
    image: "/banner2.jpg",
    title: "Hot Deals Everyday",
    subtitle: "Save big on exclusive offers nearby.",
  },
  {
    id: 3,
    image: "/banner3.jpg",
    title: "Premium Restaurants",
    subtitle: "Taste the best meals cooked by top chefs.",
  },
];

const Header = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="header">
      <div className="header-slider">
        
        {banners.map((banner, i) => (
          <div
            key={banner.id}
            className={`header-slide ${i === index ? "active" : ""}`}
          >
            <img src={banner.image} alt="banner" />

            <div className="header-text">
              <h2>{banner.title}</h2>
              <p>{banner.subtitle}</p>
            </div>
          </div>
        ))}

        <div className="header-dots">
          {banners.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            ></span>
          ))}
        </div>

      </div>
    </header>
  );
};

export default Header;