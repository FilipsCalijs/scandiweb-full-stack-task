import React from "react";

class Size extends React.Component {
  render() {
    const { sizes, onSizeChange, disabled } = this.props;
    const availableSizes = sizes?.availableSizes || [];
    const selectedSize = sizes?.size || "";
    const attributeName = "size";

    if (!availableSizes.length) return null;

    return (
      <>
        <p className="text-[16px] font-semibold text-[#1D1F22] mb-2">Size:</p>

        <div
          data-testid={`cart-item-attribute-${attributeName}`}
          className="flex flex-wrap gap-2"
        >
          {availableSizes.map((sizeOption) => {
            const isSelected = selectedSize === sizeOption.value;
            const optionKebab = sizeOption.value.toLowerCase().replace(/\s+/g, "-");

            return (
              <div
                key={sizeOption.value}
                data-testid={
                  isSelected
                    ? `cart-item-attribute-${attributeName}-${optionKebab}-selected`
                    : `cart-item-attribute-${attributeName}-${optionKebab}`
                }
                onClick={!disabled ? () => onSizeChange(sizeOption.value) : undefined}
                className={`
                  min-w-[4px] h-8 px-2 flex items-center justify-center border-2 text-sm font-medium
                  ${
                    disabled
                      ? "opacity-40 pointer-events-none cursor-default"
                      : isSelected
                      ? "bg-[#1D1F22] text-white scale-105 shadow-md cursor-pointer"
                      : "bg-white text-[#1D1F22] border-black hover:border-[#5ECE7B] hover:scale-105 cursor-pointer"
                  }
                `}
              >
                {sizeOption.value}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default Size;
