import React from "react";
import { addToCart } from "../utils/utils";

class Card extends React.Component {
  handleCartClick = () => {
    const { data } = this.props;
    const { attributes, prices, gallery, name, id } = data;

    const priceData = prices?.[0] || {};
    const currencySymbol = priceData.currency?.symbol || "$";
    const baseItem = {
      id,
      name,
      img: gallery?.[0],
      price: priceData.amount,
      quantity: 1,
      currencySymbol,
    };

    // Если у товара нет атрибутов
    if (!Array.isArray(attributes) || attributes.length === 0) {
      addToCart(baseItem);
      return;
    }

    const getOptions = (attrId) => {
      const attr = attributes.find((a) => a.id === attrId);
      return Array.isArray(attr?.items) ? attr.items : [];
    };

    const [size] = getOptions("Size");
    const [color] = getOptions("Color");
    const [capacity] = getOptions("Capacity");

    const productForCart = {
      ...baseItem,
      ...(size && { size: size.value }),
      ...(color && { color: color.value }),
      ...(capacity && { capacity: capacity.displayValue }),
      availableSizes: getOptions("Size"),
      availableColors: getOptions("Color"),
      availableCapacities: getOptions("Capacity"),
    };

    addToCart(productForCart);
  };

  render() {
    const { data } = this.props;
    const { inStock, gallery, name, prices, category } = data;

    return (
      <div
        className={`${
          inStock ? "" : "out-of-stock"
        } relative flex flex-col justify-center items-center group w-[386px] h-[444px] customShadow`}
      >
        <button
          onClick={this.handleCartClick}
          disabled={!inStock}
          className={`${
            inStock ? "" : "group-hover:hidden"
          } absolute hidden group-hover:flex w-[52px] h-[52px] top-[304px] left-[287px] z-10 bg-[#5ECE7B] rounded-full justify-center items-center`}
        >
          <img src="white-cart.svg" alt="Add to cart" />
        </button>

        <a
          href={`/${category}/${data.id}`}
          data-testid={`product-${name.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <img
            src={gallery?.[0]}
            alt={name}
            className="w-[354px] h-[330px] object-contain"
          />
        </a>

        <div className="w-[354px] h-[58px] mt-[24px]">
          <p className="text-[18px] font-light">{name}</p>
          <p className="text-[18px]">
            {prices?.[0]?.currency?.symbol}
            {prices?.[0]?.amount}
          </p>
        </div>
      </div>
    );
  }
}

export default Card;
