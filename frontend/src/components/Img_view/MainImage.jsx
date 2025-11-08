import React from "react";

class MainImage extends React.Component {
  render() {
    return (
      <div className="relative">
        <div className="absolute top-1/2 translate-y-[-50%] w-full flex justify-between">
          <button
            onClick={() => this.props.handlePrevImage()}
            className="w-[31.7px] h-[31.7px] flex justify-center items-center bg-[#000000BA]"
          >
            <img src="/caretLeft.svg" alt="" />
          </button>
          <button
            onClick={() => {
              this.props.handleNextImage();
            }}
            className="w-[31.7px] h-[31.7px] flex justify-center items-center bg-[#000000BA]"
          >
            <img src="/caretRight.svg" alt="" />
          </button>
        </div>
        <img
          className="w-[575px] h-[478px] object-contain"
          src={this.props.currentImg}
          alt="main-img"
        />
      </div>
    );
  }
}

export default MainImage;
