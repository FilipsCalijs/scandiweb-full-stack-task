import React from "react";
import { increase, decrease } from "../../utils/utils";

class QuantityController extends React.Component {
  render() {
    const { item } = this.props;

    return (
      <div className="w-6 flex flex-col justify-between items-center">
        
        <button
          data-testid="cart-item-amount-increase"
          className="border-2 flex justify-center items-center border-[#1D1F22] w-6 h-6"
          onClick={() => {
            increase(item.itemID);
          }}
        >
          +
        </button>

        <p data-testid="cart-item-amount">{item.quantity}</p>

        <button
          data-testid="cart-item-amount-decrease"
          className="border-2 flex justify-center items-center border-[#1D1F22] w-6 h-6"
          onClick={() => {
            decrease(item.itemID);
          }}
        >
          -
        </button>

      </div>
    );
  }
}

export default QuantityController;
