import React from "react";

class Color extends React.Component {
  render() {
    const { colors, onColorChange } = this.props;
    const availableColors = colors?.availableColors || [];
    const selectedColor = colors?.color || "";

    if (!availableColors.length) return null;

    return (
      <>
        <p className="text-[16px] font-semibold text-[#1D1F22] mb-2">Color:</p>
        <div className="flex flex-wrap gap-4">
          {availableColors.map((colorOption) => {
            const isSelected = selectedColor === colorOption.value;

            return (
              <div
                key={colorOption.value}
                onClick={() => onColorChange(colorOption.value)}
                className={`relative h-8 w-8 cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? "border-[2px] border-[#5ECE7B] p-[2px]"
                    : "border-[2px] border-transparent hover:border-gray-400"
                }`}
              >
                <div
                  className="h-full w-full"
                  style={{
                    backgroundColor: colorOption.value,
                  }}
                ></div>
                {isSelected && (
                  <div className="absolute inset-[1px] border-[1px] border-white pointer-events-none"></div>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default Color;
