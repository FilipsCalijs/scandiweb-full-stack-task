import React from "react";
import ImgCarousel from "./Img_view/ImgCarousel";
import MainImage from "./Img_view/MainImage";


class Gallery extends React.Component {
  render() {
    return (
      <div className="flex space-x-12" data-testid="product-gallery">
        <ImgCarousel
          images={this.props.data.gallery}
          handleImgChange={this.props.handleImgChange}
        />
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
