import React from "react";

class Color extends React.Component {
  render() {
    if (!this.props.colors || !this.props.colors.color) {
      return null;
    }

    const { availableColors, color: selectedColor } = this.props.colors;

    const handleColorChange = (colorValue) => {
      if (this.props.onColorChange) {
        this.props.onColorChange(colorValue);
      }
    };

    return (
      <>
        <p className="mb-2">Color:</p>
        <div className="flex space-x-3">
          {availableColors.map((colorOption) => {
            const isSelected = selectedColor === colorOption.value;

            return (
              <div
                key={colorOption.value}
                onClick={() => handleColorChange(colorOption.value)}
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
