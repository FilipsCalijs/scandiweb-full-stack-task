import React from "react";

class MainImage extends React.Component {
  render() {
    const { currentImg, handlePrevImage, handleNextImage, inStock } = this.props;

    return (
      <div className="relative w-[575px] h-[478px] flex justify-center items-center">
      
        <img
          className={`w-full h-full object-contain ${
            !inStock ? "opacity-40" : ""
          }`}
          src={currentImg}
          alt="main-img"
        />

       
        {!inStock && (
          <div className="absolute top-1/2 left-1/2 z-30 transform -translate-x-1/2 -translate-y-1/2 text-[24px] font-semibold text-[#8D8F9A] uppercase">
            OUT OF STOCK
          </div>
        )}

     
        <button
          onClick={handlePrevImage}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[31.7px] h-[31.7px] flex justify-center items-center bg-[#000000BA] z-20"
        >
          <img src="/caretLeft.svg" alt="Previous" />
        </button>

        <button
          onClick={handleNextImage}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[31.7px] h-[31.7px] flex justify-center items-center bg-[#000000BA] z-20"
        >
          <img src="/caretRight.svg" alt="Next" />
        </button>
      </div>
    );
  }
}

export default MainImage;
