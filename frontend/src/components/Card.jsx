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

  if (!Array.isArray(attributes) || attributes.length === 0) {
    addToCart(baseItem);
    return;
  }

  const productForCart = {
    ...baseItem,
    size: "",
    color: "",
    capacity: "",
    availableSizes: [],
    availableColors: [],
    availableCapacities: [],
    otherAttributes: [],
  };

  attributes.forEach((attr) => {
    if (!attr || !attr.items || attr.items.length === 0) return;

    const attrName = attr.name || "";
    const attrNameLower = attrName.toLowerCase();

    const firstItem = attr.items[0];

    if (attrNameLower.includes("size")) {
      productForCart.size = firstItem.value;
      productForCart.availableSizes = attr.items;
      return;
    }

    if (attrNameLower.includes("color")) {
      productForCart.color = firstItem.value;
      productForCart.availableColors = attr.items;
      return;
    }

    if (attrNameLower.includes("capacity")) {
      productForCart.capacity = firstItem.displayValue || firstItem.value;
      productForCart.availableCapacities = attr.items;
      return;
    }

    productForCart.otherAttributes.push({
      id: attr.id,
      name: attr.name,
      selectedValue: firstItem.value,
      items: attr.items,
    });
  });

  addToCart(productForCart);
};


  render() {
    const { data } = this.props;
    const { inStock, gallery, name, prices, category } = data;

    const isOut = !inStock;

    return (
      <div
        className="relative flex flex-col justify-center items-center group w-[386px] h-[444px] customShadow"
        data-testid={`product-${name.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {isOut && <div className="out-of-stock-label">OUT OF STOCK</div>}

        {!isOut && (
          <button
            onClick={this.handleCartClick}
            className="quick-shop-btn absolute hidden group-hover:flex w-[52px] h-[52px] top-[304px] left-[287px] z-10 bg-[#5ECE7B] rounded-full justify-center items-center"
          >
            <img src="cart.svg" alt="Add to cart" />
          </button>
        )}

        <a
          href={`/${category}/${data.id}`}
          className={isOut ? "out-of-stock" : ""}
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
            {prices?.[0]?.amount.toFixed(2)}
          </p>
        </div>
      </div>
    );
  }
}

export default Card;
