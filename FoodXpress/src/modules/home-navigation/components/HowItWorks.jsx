import React from "react";
import "../styles/HowItWorks.css";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Add to Cart",
      description: "Browse our menu and add your favorite dishes to cart",
      icon: "🛒"
    },
    {
      id: 2,
      title: "Place Order",
      description: "Review your order and proceed to secure checkout",
      icon: "📋"
    },
    {
      id: 3,
      title: "Get Delivery in Instant",
      description: "Enjoy fresh food delivered right to your doorstep",
      icon: "🚚"
    }
  ];

  return (
    <section className="how-it-works">
      <h2 className="how-title">How It Works</h2>
      
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={step.id} className="step-card">
            <div className="step-number">{step.id}</div>
            <div className="step-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>

          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;