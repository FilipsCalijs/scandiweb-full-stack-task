import React from "react";

class ImgCarousel extends React.Component {
  render() {
    return (
      <div className="space-y-8 max-h-[478px] overflow-y-auto no-scrollbar">
        {this.props.images.map((img, key) => (
          <img
            onClick={() => this.props.handleImgChange(img)}
            key={key}
            className="cursor-pointer object-contain w-20 h-20"
            src={img}
            alt={`gallery-img-${key}`}
          />
        ))}
      </div>
    );
  }
}

export default ImgCarousel;
