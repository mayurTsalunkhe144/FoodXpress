import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth.jsx";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

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
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showSearch || showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearch, showProfileMenu]);

  const handleLoginClick = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/');
  };

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

          {/* Cart + Login/Profile */}
          <div className="nav-right">
            <NavLink to="/cart" className="nav-cart">
              <img src="/NavCart.png" alt="" className="NavCart"/>
            </NavLink>
            
            {isAuthenticated ? (
              <div className="profile-menu" ref={profileRef}>
                <button 
                  className="profile-btn"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  👤 {user?.fullName}
                </button>
                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <div className="profile-info">
                      <p className="profile-name">{user?.fullName}</p>
                      <p className="profile-email">{user?.email}</p>
                    </div>
                    <button 
                      className="profile-info-btn"
                      onClick={() => {
                        navigate('/user-management');
                        setShowProfileMenu(false);
                      }}
                    >
                      Profile Info
                    </button>
                    <button 
                      className="profile-logout"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="nav-login" onClick={handleLoginClick}>
                Login
              </button>
            )}
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
          {isAuthenticated ? (
            <button className="nav-login" onClick={handleLogout}>
              Logout ({user?.fullName})
            </button>
          ) : (
            <button className="nav-login" onClick={handleLoginClick}>
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
