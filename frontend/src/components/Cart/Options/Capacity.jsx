import React from "react";

class Capacity extends React.Component {
  render() {
    if (!this.props.capacities || !this.props.capacities.capacity) {
      return null;
    }

    const { availableCapacities, capacity: selectedCapacity } =
      this.props.capacities;

    const handleCapacityChange = (capacityValue) => {
      if (this.props.onCapacityChange) {
        this.props.onCapacityChange(capacityValue);
      }
    };

    return (
      <>
        <p className="mb-2">Capacity:</p>
        <div className="flex space-x-3">
          {availableCapacities.map((capacityOption) => {
            const isSelected = selectedCapacity === capacityOption.displayValue;

            return (
              <div
                key={capacityOption.displayValue}
                onClick={() =>
                  handleCapacityChange(capacityOption.displayValue)
                }
                className={`h-8 min-w-[60px] px-2 flex items-center justify-center border-2 rounded-sm text-sm font-medium cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? "bg-[#1D1F22] text-white border-[#5ECE7B] scale-105"
                    : "bg-white text-black border-gray-300 hover:border-gray-500"
                }`}
              >
                {capacityOption.displayValue}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default Capacity;
