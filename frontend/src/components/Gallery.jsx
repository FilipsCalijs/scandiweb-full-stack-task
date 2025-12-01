import React from "react";
import ImgCarousel from "./ImgView/ImgCarousel";
import MainImage from "./ImgView/MainImage";

class Gallery extends React.Component {
  render() {
    const {
      data,
      currentImg,
      handleImgChange,
      handlePrevImage,
      handleNextImage,
    } = this.props;

    return (
      <div
        className="flex flex-col md:flex-row md:space-x-12 items-center md:items-start"
        data-testid="product-gallery"
      >

        <div className="hidden md:block w-[100px] flex-shrink-0">
          <ImgCarousel
            images={data.gallery}
            handleImgChange={handleImgChange}
          />
        </div>

        <div className="flex-1 max-w-[600px]">
          <MainImage
            currentImg={currentImg}
            handlePrevImage={handlePrevImage}
            handleNextImage={handleNextImage}
          />
        </div>

      </div>
    );
  }
}

export default Gallery;
