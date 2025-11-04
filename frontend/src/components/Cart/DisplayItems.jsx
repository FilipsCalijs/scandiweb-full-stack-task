import React from "react";
import QuantityController from "./QuantityController";
import Size from "./Options/Size";
import Color from "./Options/Colors.jsx";
import Capacity from "./Options/Capacity";

class DisplayItems extends React.Component {
  handleCapacityChange = (itemID, newCapacity) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCart = cartItems.map((i) =>
      i.itemID === itemID ? { ...i, capacity: newCapacity } : i
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  handleColorChange = (itemID, newColor) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCart = cartItems.map((i) =>
      i.itemID === itemID ? { ...i, color: newColor } : i
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  handleSizeChange = (itemID, newSize) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCart = cartItems.map((i) =>
      i.itemID === itemID ? { ...i, size: newSize } : i
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  render() {
    return (
      <div className="m-4 mt-8 max-h-[500px] space-y-10 no-scrollbar overflow-y-auto ">
        {this.props.cartItems.map((item, index) => (
          <div
            data-testid={`cart-item-attribute-${item.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            className="flex justify-around"
            key={index}
          >
            <div className="w-[136px]">
              <div>
                <p className="font-light">{item.name}</p>
                <p className="font-bold">
                  {item.currencySymbol}
                  {item.price}
                </p>

                <Size
                  sizes={item}
                  onSizeChange={(newSize) =>
                    this.handleSizeChange(item.itemID, newSize)
                  }
                />
                <Color
                  colors={item}
                  onColorChange={(newColor) =>
                    this.handleColorChange(item.itemID, newColor)
                  }
                />
                <Capacity
                  capacities={item}
                  onCapacityChange={(newCap) =>
                    this.handleCapacityChange(item.itemID, newCap)
                  }
                />
              </div>
            </div>

            <QuantityController item={item} />

            <div className="flex w-[121px] h-[167px] justify-end">
              <img
                className="w-[121px] h-[167px] object-contain"
                src={item.img}
                alt={item.name}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default DisplayItems;
