import React from "react";
import ImgCarousel from "./Img_view/ImgCarousel";
import MainImage from "./Img_view/MainImage";

class Gallery extends React.Component {
  render() {
    return (
      <div
        className="flex flex-col md:flex-row md:space-x-12 items-center md:items-start"
        data-testid="product-gallery"
      >
        <div className="hidden md:block">
          <ImgCarousel
            images={this.props.data.gallery}
            handleImgChange={this.props.handleImgChange}
          />
        </div>

        <MainImage
          currentImg={this.props.currentImg}
          handlePrevImage={this.props.handlePrevImage}
          handleNextImage={this.props.handleNextImage}
        />
      </div>
    );
  }
}

export default Gallery;
