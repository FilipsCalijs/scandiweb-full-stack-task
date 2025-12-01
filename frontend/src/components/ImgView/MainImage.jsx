import React from "react";

class MainImage extends React.Component {
  render() {
    const { currentImg, handlePrevImage, handleNextImage } = this.props;

    return (
      <div className="relative w-full max-w-[575px] h-[300px] sm:h-[400px] md:h-[478px] flex justify-center items-center mx-auto">
        <img className="w-full h-full object-contain" src={currentImg} alt="main-img" />

        <button
          onClick={handlePrevImage}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-[31.7px] sm:h-[31.7px] flex justify-center items-center bg-[#000000BA] z-20"
        >
          <img src="/caret-left-white.svg" alt="Previous" className="w-8 h-8 sm:w-5 sm:h-5" />
        </button>

        <button
  onClick={handleNextImage}
  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-[31.7px] sm:h-[31.7px] flex justify-center items-center bg-[#000000BA] z-20"
>
  <img src="/caret-right-white.svg" alt="Next" className="w-8 h-8 sm:w-5 sm:h-5" />
</button>

      </div>
    );
  }
}

export default MainImage;
