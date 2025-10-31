import React from "react";

class Card extends React.Component {
  render() {
    const { data } = this.props;

    return (
      <div
        className={`${
          data.inStock ? "" : "opacity-50"
        } w-[386px] h-[444px] group relative flex flex-col justify-center items-center customShadow`}
      >
        <a
          data-testid={`product-${data.name
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
          href={`/${data.category}/${data.id}`}
        >
          <img
            className="w-[354px] h-[330px] object-contain"
            src={data.gallery[0]}
            alt={data.name}
          />
        </a>
        <div className="w-[354px] h-[58px] mt-[24px]">
          <p className="text-[18px] font-light">{data.name}</p>
          <p className="text-[18px]">
            {data.prices[0].currency.symbol}
            {data.prices[0].amount}
          </p>
        </div>
      </div>
    );
  }
}

export default Card;
