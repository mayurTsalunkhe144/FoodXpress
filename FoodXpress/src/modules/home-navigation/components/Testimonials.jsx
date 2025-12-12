import React, { useState, useEffect } from "react";
import "../styles/Testimonials.css";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Food Blogger",
      location: "New York",
      rating: 5,
      text: "Absolutely incredible service! The food arrived hot and fresh, exactly as ordered. The variety of restaurants is amazing and the delivery was faster than expected.",
      avatar: "👩💼"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Software Engineer",
      location: "San Francisco",
      rating: 5,
      text: "Best food delivery app I've ever used. The interface is intuitive, tracking is real-time, and the quality is consistently excellent. Highly recommend!",
      avatar: "👨💻"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Marketing Director",
      location: "Los Angeles",
      rating: 5,
      text: "Game changer for busy professionals! Quick ordering, reliable delivery, and amazing customer service. The app has become essential for my daily routine.",
      avatar: "👩💼"
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Chef",
      location: "Chicago",
      rating: 5,
      text: "As a chef, I'm very particular about food quality. This platform maintains restaurant standards perfectly during delivery. Impressive logistics and care.",
      avatar: "👨🍳"
    },
    {
      id: 5,
      name: "Lisa Park",
      role: "Student",
      location: "Boston",
      rating: 5,
      text: "Perfect for college life! Affordable options, student discounts, and late-night delivery. The app is user-friendly and payment is seamless.",
      avatar: "👩🎓"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="testimonials">
      <div className="testimonials-background">
        <div className="testimonials-content">
          <h2 className="testimonials-title">What Our Customers Say</h2>
          <p className="testimonials-subtitle">Real experiences from real people</p>
          
          <div className="testimonials-carousel">
            <div className="testimonial-card">
              <div className="quote-icon">"</div>
              <div className="testimonial-content">
                <div className="stars">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p className="testimonial-text">{testimonials[currentIndex].text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonials[currentIndex].avatar}</div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonials[currentIndex].name}</h4>
                    <p className="author-role">{testimonials[currentIndex].role}</p>
                    <p className="author-location">📍 {testimonials[currentIndex].location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="testimonials-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;