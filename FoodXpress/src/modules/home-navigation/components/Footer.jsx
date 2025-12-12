import React from "react";
import "../styles/Footer.css";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <h2 className="footer-logo">FoodXpress</h2>
          <p className="footer-desc">
            Delivering delicious meals from your favorite restaurants right to
            your doorstep.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Browse Menu</li>
            <li>Top Restaurants</li>
            <li>Offers</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className="footer-help">
          <h3>Support</h3>
          <ul>
            <li>FAQs</li>
            <li>Help Center</li>
            <li>Account</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <FaFacebookF className="icon" />
            <FaInstagram className="icon" />
            <FaXTwitter className="icon" />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} FoodXpress. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;