import React, { useState, useEffect, useRef } from "react";
import "../styles/Navbar.css";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const searchRef = useRef(null);

  const closeSearch = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowSearch(false);
      setIsClosing(false);
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        closeSearch();
      }
    };

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearch]);

  return (
    <nav className="nav">
      <div className="nav-container">
        {/* LEFT: Logo */}
        <NavLink to="/" className="nav-logo">
          <img src="/NavLogo.png" alt="FoodXpress Logo" className="NavLogo" />
          Food<span className="logo-accent">Xpress</span>
        </NavLink>

        {/* RIGHT SECTION */}
        <div className="nav-right-section">
          {/* Search Icon */}
          <div
            className={`search-icon ${showSearch ? 'hidden' : ''}`}
            onClick={() => showSearch ? closeSearch() : setShowSearch(true)}
          >
          <img src="/NavSearch.png" alt="" className="NavSearch"/>
          </div>

          {/* Small inline search (visible only when clicked) */}
          {showSearch && (
            <div className={`nav-inline-search ${isClosing ? 'closing' : ''}`} ref={searchRef}>
              <input type="text" placeholder="What are you looking for ?" />
              <button>Go</button>
            </div>
          )}

          {/* Nav Links */}
          <ul className="nav-links">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/menu">Menu</NavLink>
            </li>
            <li>
              <NavLink to="/restaurants">Restaurants</NavLink>
            </li>
            <li>
              <NavLink to="/offers">Offers</NavLink>
            </li>
          </ul>

          {/* Cart + Login */}
          <div className="nav-right">
            <NavLink to="/cart" className="nav-cart">
              <img src="/NavCart.png" alt="" className="NavCart"/>
            </NavLink>
            <button className="nav-login">Login</button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="nav-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✖" : "☰"}
          </div>
        </div>
      </div>


      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="nav-mobile">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/restaurants">Restaurants</NavLink>
          <NavLink to="/offers">Offers</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          <button className="nav-login">Login</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;