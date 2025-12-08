import React from "react";
import QuantityController from "./QuantityController.jsx";
import Size from "./Options/Size.jsx";
import Color from "./Options/Colors.jsx";
import Capacity from "./Options/Capacity.jsx";

class DisplayItems extends React.Component {
  
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
                disabled={true}
                onSizeChange={() => {}}
              />
              <Color
                colors={item}
                disabled={true}
                onColorChange={() => {}}
              />
              <Capacity
                capacities={item}
                disabled={true}
                onCapacityChange={() => {}}
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