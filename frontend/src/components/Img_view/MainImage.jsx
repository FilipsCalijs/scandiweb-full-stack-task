import React from "react";

class MainImage extends React.Component {
  render() {
    const { currentImg, handlePrevImage, handleNextImage, inStock } = this.props;

    return (
      <div className="relative w-[575px] h-[478px] flex justify-center items-center">
      
        <img
          className={`w-full h-full object-contain`}
          src={currentImg}
          alt="main-img"
        />

       

     
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
