import React from "react";

class Color extends React.Component {
  render() {
    const { colors, onColorChange } = this.props;
    const availableColors = colors?.availableColors || [];
    const selectedColor = colors?.color || "";

    if (!availableColors.length) {
      return null;
    }

    return (
      <>
        <p className="mb-2">Color:</p>
        <div className="flex space-x-3">
          {availableColors.map((colorOption) => {
            const isSelected = selectedColor === colorOption.value;

            return (
              <div
                key={colorOption.value}
                onClick={() => onColorChange(colorOption.value)}
                className={`h-6 w-6 rounded-sm cursor-pointer border-2 transition-all duration-150 ${
                  isSelected
                    ? "border-[#5ECE7B] scale-110"
                    : "border-transparent hover:border-gray-400"
                }`}
                style={{
                  backgroundColor: colorOption.value,
                }}
              />
            );
          })}
        </div>
      </>
    );
  }
}

export default Color;
