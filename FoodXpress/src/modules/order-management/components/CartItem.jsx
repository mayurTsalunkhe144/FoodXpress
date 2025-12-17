import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      onRemove(item.cartItemId);
    } else {
      onUpdateQuantity(item.cartItemId, newQuantity);
    }
  };

  return (
    <div className="cart-item card p-md m-sm">
      <div className="item-info">
        <h4 className="text-lg font-semibold">{item.menuItemName}</h4>
        <p className="text-sm text-muted">from {item.restaurantName}</p>
        <p className="text-base font-medium">₹{item.unitPrice}</p>
      </div>
      
      <div className="item-controls">
        <div className="quantity-controls">
          <button 
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="btn btn-secondary"
          >
            -
          </button>
          <span className="quantity">{item.quantity}</span>
          <button 
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="btn btn-secondary"
          >
            +
          </button>
        </div>
        
        <div className="item-total">
          <span className="text-lg font-bold">₹{item.lineTotal}</span>
        </div>
        
        <button 
          onClick={() => onRemove(item.cartItemId)}
          className="btn btn-cancel"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;