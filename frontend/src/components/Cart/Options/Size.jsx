import React from "react";

class Size extends React.Component {
  render() {
    const { sizes, onSizeChange } = this.props;
    const availableSizes = sizes?.availableSizes || [];
    const selectedSize = sizes?.size || "";

    if (!availableSizes.length) {
      return null;
    }

    return (
      <>
        <p className="mb-2">Size:</p>
        <div className="flex space-x-3">
          {availableSizes.map((sizeOption) => {
            const isSelected = selectedSize === sizeOption.value;

            return (
              <div
                key={sizeOption.value}
                onClick={() => onSizeChange(sizeOption.value)}
                className={`h-8 min-w-[40px] px-2 flex items-center justify-center border-2 rounded-sm text-sm font-medium cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? "bg-[#1D1F22] text-white border-[#5ECE7B] scale-105"
                    : "bg-white text-black border-gray-300 hover:border-gray-500"
                }`}
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
