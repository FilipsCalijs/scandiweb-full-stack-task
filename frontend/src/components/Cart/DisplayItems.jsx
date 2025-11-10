import React from "react";
import QuantityController from "./QuantityController";
import Size from "./Options/Size";
import Color from "./Options/Colors.jsx";
import Capacity from "./Options/Capacity";

class DisplayItems extends React.Component {
  updateItemInCart = (itemID, updatedFields) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCart = cartItems.map((i) =>
      i.itemID === itemID
        ? {
            ...i,
            ...updatedFields,
            itemID: `${i.id}-${updatedFields.size || i.size || ""}-${updatedFields.color || i.color || ""}-${updatedFields.capacity || i.capacity || ""}-${Date.now()}`,
          }
        : i
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  handleCapacityChange = (itemID, newCapacity) => {
    this.updateItemInCart(itemID, { capacity: newCapacity });
  };

  handleColorChange = (itemID, newColor) => {
    this.updateItemInCart(itemID, { color: newColor });
  };

  handleSizeChange = (itemID, newSize) => {
    this.updateItemInCart(itemID, { size: newSize });
  };

  render() {
    return (
      <div className="m-4 mt-8 max-h-[500px] space-y-10 no-scrollbar overflow-y-auto">
        {this.props.cartItems.map((item) => (
          <div
            key={item.itemID}
            className="flex justify-around"
            data-testid={`cart-item-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="w-[136px]">
              <p className="font-light">{item.name}</p>
              <p className="font-bold">
                {item.currencySymbol}
                {item.price}
              </p>

              <Size
                sizes={item}
                onSizeChange={(newSize) => this.handleSizeChange(item.itemID, newSize)}
              />
              <Color
                colors={item}
                onColorChange={(newColor) => this.handleColorChange(item.itemID, newColor)}
              />
              <Capacity
                capacities={item}
                onCapacityChange={(newCap) => this.handleCapacityChange(item.itemID, newCap)}
              />
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
