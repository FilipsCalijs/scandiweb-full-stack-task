import React from "react";

class TextAttribute extends React.Component {
  render() {
    const { attribute, selectedValue, onValueChange, disabled } = this.props;

    if (!attribute?.items?.length) {
      return null;
    }

    return (
      <>
        <p className="text-[16px] font-semibold text-[#1D1F22] mb-2 mt-2">
          {attribute.name}:
        </p>

        <div className="flex flex-wrap gap-2">
          {attribute.items.map((item) => {
            const isSelected = selectedValue === item.value;
            const optionId = item.id || item.value;

            return (
              <div
                key={item.value}
                data-testid={`product-attribute-${attribute.id}-${optionId}`}
                onClick={!disabled ? () => onValueChange(item.value) : undefined}
                className={`
                  min-w-[4px] h-8 px-2 flex items-center justify-center border-2 text-sm font-medium
                  ${
                    disabled
                      ? "pointer-events-none cursor-default"
                      : isSelected
                      ? "bg-[#1D1F22] text-white scale-105 shadow-md cursor-pointer"
                      : "bg-white text-[#1D1F22] border-black hover:border-[#5ECE7B] hover:scale-105 cursor-pointer"
                  }
                  ${isSelected ? "bg-[#1D1F22] text-white" : "bg-white text-[#1D1F22] border-black"}
                `}
              >
                {item.value}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default TextAttribute;
