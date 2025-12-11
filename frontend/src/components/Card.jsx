import React from "react";
import { addToCart } from "../utils/utils";

class Card extends React.Component {
  handleCartClick = () => {
    const { data } = this.props;
    const { attributes, prices, gallery, name, id, category } = data;

    const priceData = prices?.[0] || {};
    const currencySymbol = priceData.currency?.symbol || "$";

    const baseItem = {
      id,
      name,
      img: gallery?.[0],
      price: Number(priceData.amount.toFixed(2)),
      quantity: 1,
      currencySymbol,
    };

    if (!Array.isArray(attributes) || attributes.length === 0) {
      addToCart(baseItem);
      return;
    }

  
    let sizeAttr = null;
    let colorAttr = null;
    let capacityAttr = null;
    let otherAttributesList = [];

   
    attributes.forEach((attr) => {
        if (!attr || !attr.items || attr.items.length === 0) return;

        const attrNameLower = String(attr.name || "").toLowerCase();
        const attrIdLower = String(attr.id || "").toLowerCase();
        
        if (attrNameLower.includes("size") || attrIdLower === "size") {
            sizeAttr = attr;
            return;
        }

        if (attrNameLower.includes("color") || attrIdLower === "color") {
            colorAttr = attr;
            return;
        }

        if (attrNameLower.includes("capacity") || attrIdLower === "capacity") {
            capacityAttr = attr;
            return;
        }

        otherAttributesList.push({
            id: attr.id,
            name: attr.name,
            type: attr.type,
            items: attr.items,
            selectedValue: attr.items[0].value, 
        });
    });

   
    const productForCart = {
        ...baseItem,
        category: category || "",
        
      
        size: sizeAttr ? sizeAttr.items[0].value : "",
        color: colorAttr ? colorAttr.items[0].value : "",
        capacity: capacityAttr ? (capacityAttr.items[0].value) : "",

        
        availableSizes: sizeAttr?.items || [],
        availableColors: colorAttr?.items || [],
        availableCapacities: capacityAttr?.items || [],
        
        
        sizeAttributeName: sizeAttr?.name || "", 
        colorAttributeName: colorAttr?.name || "",
        capacityAttributeName: capacityAttr?.name || "",
        
        otherAttributes: otherAttributesList,
    };

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