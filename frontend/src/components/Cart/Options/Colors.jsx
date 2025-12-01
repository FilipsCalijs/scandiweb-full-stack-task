import React from "react";

class Color extends React.Component {
  render() {
    const { colors, onColorChange, disabled } = this.props;

    const availableColors = colors?.availableColors || [];
    const selectedColor = colors?.color || "";
    const attributeName = "color";

    if (!availableColors.length) {
      return null;
    }

    return (
      <>
        <p className="text-[16px] font-semibold text-[#1D1F22] mb-2">Color:</p>

        <div
          data-testid={`product-attribute-${attributeName}-container`}
          className="flex flex-wrap gap-4"
        >
          {availableColors.map((colorOption) => {
            const isSelected = selectedColor === colorOption.value;
            const optionKebab = colorOption.value.toLowerCase().replace(/\s+/g, "-");
            const optionId = colorOption.id || colorOption.value;

            return (
              <div
                key={colorOption.value}
                data-testid={`product-attribute-color-${optionId}`}
                onClick={!disabled ? () => onColorChange(colorOption.value) : undefined}
                className={`relative h-8 w-8 transition-all duration-150
                  ${
                    disabled
                      ? "opacity-40 pointer-events-none cursor-default"
                      : isSelected
                      ? "border-[2px] border-[#5ECE7B] p-[2px] cursor-pointer"
                      : "border-[2px] border-transparent hover:border-gray-400 cursor-pointer"
                  }
                `}
              >
                <div
                  className="h-full w-full"
                  style={{ backgroundColor: colorOption.value }}
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
