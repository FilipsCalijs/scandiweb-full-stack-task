import React from "react";

class Size extends React.Component {
  render() {
    const { sizes, onSizeChange } = this.props;
    const availableSizes = sizes?.availableSizes || [];
    const selectedSize = sizes?.size || "";

    if (!availableSizes.length) return null;

    return (
      <>
        <p className="text-[16px] font-semibold text-[#1D1F22] mb-2">Size:</p>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((sizeOption) => {
            const isSelected = selectedSize === sizeOption.value;
            return (
              <div
                key={sizeOption.value}
                onClick={() => onSizeChange(sizeOption.value)}
                className={`min-w-[4px] h-8 px-2 flex items-center justify-center border-2 text-sm font-medium cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? "bg-[#1D1F22] text-white  scale-105 shadow-md"
                    : "bg-white text-[#1D1F22] border-black-100 hover:border-[#5ECE7B] hover:scale-105"
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
