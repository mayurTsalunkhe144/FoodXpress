import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginModal.css";

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate("/auth");
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={onClose}>×</button>
        <h2>Login Required</h2>
        <p>Please login to add items to your cart</p>
        <div className="login-modal-buttons">
          <button className="login-modal-btn login-btn" onClick={handleLogin}>
            Login
          </button>
          <button className="login-modal-btn cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
