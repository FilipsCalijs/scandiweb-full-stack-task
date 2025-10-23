import React from "react";

class Cart extends React.Component {
  render() {
    return (
      <div className="relative">
        <button
          data-testid="cart-btn"
          className="flex justify-center items-center cursor-pointer z-50"
        >
          <img src="/cart.svg" alt="cart" className="w-6 h-6" />
        </button>
      </div>
    );
  }
}

export default Cart;
