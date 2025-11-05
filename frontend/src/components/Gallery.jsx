import React from "react";

function Gallery({ data, currentImg, handleImgChange }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {data.gallery.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={data.name}
            onClick={() => handleImgChange(img)}
            className={`w-20 h-20 object-cover cursor-pointer border-2 ${
              img === currentImg ? "border-[#5ECE7B]" : "border-transparent"
            }`}
          />
        ))}
      </div>
      <img
        src={currentImg}
        alt={data.name}
        className="w-[500px] h-[500px] object-contain"
      />
    </div>
  );
}

export default Gallery;
