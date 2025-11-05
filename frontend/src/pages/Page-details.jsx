import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";

import Header from "../components/Header/Header";
import Gallery from "../components/Gallery";
import Size from "../components/Cart/Options/Size";
import Colors from "../components/Cart/Options/Colors";
import Capacity from "../components/Cart/Options/Capacity";
import { addToCart } from "../utils/utils";

const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      inStock
      gallery
      description
      category
      attributes {
        id
        name
        type
        items {
          displayValue
          value
          id
        }
      }
      prices {
        currency {
          label
          symbol
        }
        amount
      }
    }
  }
`;

export default function PageDetails() {
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { id },
    fetchPolicy: "no-cache",
  });

  const [currentImg, setCurrentImg] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product = data.product;

  if (!currentImg) setCurrentImg(product.gallery[0]);

  const hasSize = product.attributes.some((attr) => attr.id === "Size");
  const hasColor = product.attributes.some((attr) => attr.id === "Color");
  const hasCapacity = product.attributes.some((attr) => attr.id === "Capacity");

  const handleAddToCart = () => {
    const findAttribute = (attributes, attributeId) =>
      attributes.find((attr) => attr.id === attributeId)?.items || [];

    const item = {
      id: product.id,
      img: product.gallery[0],
      name: product.name,
      quantity: 1,
      price: product.prices[0].amount,
      currencySymbol: product.prices[0].currency.symbol,
      ...(hasSize && { size: selectedSize }),
      ...(hasColor && { color: selectedColor }),
      ...(hasCapacity && { capacity: selectedCapacity }),
      ...(hasSize && { availableSizes: findAttribute(product.attributes, "Size") }),
      ...(hasColor && { availableColors: findAttribute(product.attributes, "Color") }),
      ...(hasCapacity && { availableCapacities: findAttribute(product.attributes, "Capacity") }),
    };

    addToCart(item);
    localStorage.setItem("isCartOpen", JSON.stringify(true));
  };

  return (
    <>
      <Header activeCategory={product.category} />
      <section className="flex flex-col gap-12 m-[50px] lg:flex-row md:m-[140px] lg:gap-0">
        <Gallery
          data={product}
          currentImg={currentImg}
          handleImgChange={setCurrentImg}
        />

        <div className="lg:ml-[200px]">
          <p className="font-semibold text-3xl">{product.name}</p>

          {hasSize && (
            <Size
              data={product}
              selectedSize={selectedSize}
              handleSizeChange={setSelectedSize}
            />
          )}

          {hasColor && (
            <Colors
              data={product}
              selectedColor={selectedColor}
              handleColorChange={setSelectedColor}
            />
          )}

          {hasCapacity && (
            <Capacity
              data={product}
              selectedCapacity={selectedCapacity}
              handleCapacityChange={setSelectedCapacity}
            />
          )}

          <p className="uppercase mt-4 text-lg font-bold">Price:</p>
          <p className="uppercase mt-4 text-2xl font-bold">
            {product.prices[0].currency.symbol}
            {product.prices[0].amount}
          </p>

          <button
            data-testid="add-to-cart"
            disabled={
              !product.inStock ||
              (hasSize && !selectedSize) ||
              (hasColor && !selectedColor) ||
              (hasCapacity && !selectedCapacity)
            }
            onClick={handleAddToCart}
            className="bg-[#5ECE7B] font-semibold mt-6 disabled:bg-[#99dbab] w-[292px] h-[43px] text-white uppercase"
          >
            Add To Cart
          </button>

          <div
            className="lg:pr-[150px] mt-6 max-w-[900px]"
            data-testid="product-description"
          >
            {parse(product.description || "")}
          </div>
        </div>
      </section>
    </>
  );
}
