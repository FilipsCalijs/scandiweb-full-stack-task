import React from "react"

class Capacity extends React.Component {
  handleClick = (value) => {
    const { onCapacityChange } = this.props
    onCapacityChange(value)
  }

  render() {
    const { capacities } = this.props
    const availableCapacities = capacities?.availableCapacities || []
    const selectedCapacity = capacities?.capacity || ""

    if (!availableCapacities.length) return null

    return (
      <>
        <p className="text-[16px] font-semibold text-[#1D1F22] mb-2">
          Capacity:
        </p>
        <div className="flex flex-wrap gap-3">
          {availableCapacities.map((option) => {
            const isSelected = selectedCapacity === option.displayValue

            return (
              <div
                key={option.displayValue}
                onClick={() => this.handleClick(option.displayValue)}
                className={`min-w-[60px] h-8 px-2 flex items-center justify-center border-2 rounded-sm text-sm font-medium cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? "bg-[#1D1F22] text-white scale-105 shadow-md"
                    : "bg-white text-[#1D1F22] border-black hover:border-[#5ECE7B] hover:scale-105"
                }`}
              >
                {option.displayValue}
              </div>
            )
          })}
        </div>
      </>
    )
  }
}

export default Capacity
