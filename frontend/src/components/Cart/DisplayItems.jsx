import React from "react";
import QuantityController from "./QuantityController.jsx";
import Size from "./Options/Size.jsx";
import Color from "./Options/Colors.jsx";
import Capacity from "./Options/Capacity.jsx";

class DisplayItems extends React.Component {
  
  renderAttribute = (item, attr) => {
    const attrNameLower = attr.name?.toLowerCase() || '';
    
  
    if (attrNameLower.includes('size')) {
      return (
        <Size
          key={attr.id}
          sizes={{
            availableSizes: attr.items,
            size: item.size,
          }}
          disabled={true}
          onSizeChange={() => {}}
        />
      );
    }
    
    if (attrNameLower.includes('color')) {
      return (
        <Color
          key={attr.id}
          colors={{
            availableColors: attr.items,
            color: item.color,
          }}
          disabled={true}
          onColorChange={() => {}}
        />
      );
    }
    
    if (attrNameLower.includes('capacity')) {
      return (
        <Capacity
          key={attr.id}
          capacities={{
            availableCapacities: attr.items,
            capacity: item.capacity,
          }}
          disabled={true}
          onCapacityChange={() => {}}
        />
      );
    }
    
    if (!attr.items?.length) return null;
    
    return (
      <div key={attr.id}>
        <p className="text-[14px] font-semibold text-[#1D1F22] mb-1 mt-2">{attr.name}:</p>
        <div className="flex flex-wrap gap-1">
          {attr.items.map((attrItem) => (
            <div
              key={attrItem.value}
              className="min-w-[4px] h-6 px-2 flex items-center justify-center border text-xs font-medium bg-white text-[#1D1F22] border-black opacity-40 pointer-events-none"
            >
              {attrItem.displayValue}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  render() {
    
    return (
      <div className="m-4 mt-8 max-h-[500px] space-y-10 no-scrollbar overflow-y-auto">
        {this.props.cartItems.map((item) => {
       
          return (
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

              {item.availableSizes && item.availableSizes.length > 0 && (
                <Size
                  sizes={item}
                  disabled={true}
                  onSizeChange={() => {}}
                />
              )}

              {item.availableColors && item.availableColors.length > 0 && (
                <Color
                  colors={item}
                  disabled={true}
                  onColorChange={() => {}}
                />
              )}

              {item.availableCapacities && item.availableCapacities.length > 0 && (
                <Capacity
                  capacities={item}
                  disabled={true}
                  onCapacityChange={() => {}}
                />
              )}

              {item.otherAttributes && item.otherAttributes.length > 0 && item.otherAttributes.map((attr) => {
                if (!attr.selectedValue) return null;
                
                return (
                  <div key={attr.id}>
                    <p className="text-[14px] font-semibold text-[#1D1F22] mb-1 mt-2">{attr.name}:</p>
                    <div className="flex flex-wrap gap-1">
                      {attr.items.map((attrItem) => {
                        const isSelected = attrItem.value === attr.selectedValue;
                        return (
                          <div
                            key={attrItem.value}
                            className={`
                              min-w-[4px] h-6 px-2 flex items-center justify-center border text-xs font-medium pointer-events-none
                              ${isSelected ? "bg-[#1D1F22] text-white" : "bg-white text-[#1D1F22] border-black"}
                            `}
                          >
                            {attrItem.value}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
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
          );
        })}
      </div>
    );
  }
}

export default DisplayItems;