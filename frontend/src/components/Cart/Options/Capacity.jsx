import React from "react"

class Capacity extends React.Component {
  handleClick = (value) => {
    if (this.props.disabled) {
      return
    }

    this.props.onCapacityChange(value)
  }

  render() {
    const { capacities, disabled } = this.props

    const availableCapacities = capacities?.availableCapacities || []
   
    const selectedCapacity = capacities?.capacity || (availableCapacities[0]?.value || "")

    if (!availableCapacities.length) {
      return null
    }

    return (
      <>
        <p className="text-[16px] font-semibold text-[#1D1F22] mb-2">Capacity:</p>

        <div className="flex flex-wrap gap-3">
          {availableCapacities.map((option) => {
            const isSelected = selectedCapacity === option.value
            const optionId = option.id || option.value

            return (
              <div
                key={option.value}
                data-testid={`product-attribute-capacity-${optionId}`}
                onClick={!disabled ? () => this.handleClick(option.value) : undefined}
                className={`
                  min-w-[60px] h-8 px-2 flex items-center justify-center border-2 rounded-sm text-sm font-medium
                  ${disabled
                    ? "pointer-events-none cursor-default"
                    : isSelected
                    ? "bg-[#1D1F22] text-white scale-105 shadow-md cursor-pointer"
                    : "bg-white text-[#1D1F22] border-black hover:border-[#5ECE7B] hover:scale-105 cursor-pointer"
                  }
                  ${isSelected ? "bg-[#1D1F22] text-white" : "bg-white text-[#1D1F22] border-black"}
                `}
              >
                {option.value}
              </div>
            )
          })}
        </div>
      </>
    )
  }
}

export default Capacity
