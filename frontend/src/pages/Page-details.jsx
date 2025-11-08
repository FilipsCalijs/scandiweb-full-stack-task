import React from "react";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import parse from "html-react-parser";

import Header from "../components/Header/Header";
import Gallery from "../components/Gallery";
import Size from "../components/Cart/Options/Size";
import Color from "../components/Cart/Options/Colors";
import Capacity from "../components/Cart/Options/Capacity";
import { addToCart } from "../utils/utils";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

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

class PagDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      currentImg: null,
      selectedSize: "",
      selectedColor: "",
      selectedCapacity: "",
      loading: true,
      error: null,
    };
  }

  async componentDidMount() {
    try {
      const pathParts = window.location.pathname.split("/");
      const productId = pathParts[pathParts.length - 1];

      const { data } = await client.query({
        query: GET_PRODUCT,
        variables: { id: productId },
        fetchPolicy: "no-cache",
      });

      this.setState({
        product: data.product,
        currentImg: data.product.gallery[0],
        loading: false,
      });
    } catch (err) {
      console.error(err);
      this.setState({ error: err.message, loading: false });
    }
  }

  handleSizeChange = (value) => this.setState({ selectedSize: value });
  handleColorChange = (value) => this.setState({ selectedColor: value });
  handleCapacityChange = (value) => this.setState({ selectedCapacity: value });

  handleAddToCart = () => {
    const { product, selectedSize, selectedColor, selectedCapacity } = this.state;

    const findAttribute = (attributes, attributeId) =>
      attributes.find((attr) => attr.id === attributeId)?.items || [];

    const item = {
      id: product.id,
      img: product.gallery[0],
      name: product.name,
      quantity: 1,
      price: product.prices[0].amount,
      currencySymbol: product.prices[0].currency.symbol,
      availableSizes: findAttribute(product.attributes, "Size"),
      availableColors: findAttribute(product.attributes, "Color"),
      availableCapacities: findAttribute(product.attributes, "Capacity"),
      size: selectedSize,
      color: selectedColor,
      capacity: selectedCapacity,
    };

    addToCart(item);
    localStorage.setItem("isCartOpen", JSON.stringify(true));
  };

  handleImgChange = (img) => this.setState({ currentImg: img });
  handlePrevImage = () => {
    const { product, currentImg } = this.state;
    const index = product.gallery.indexOf(currentImg);
    const prevIndex = (index - 1 + product.gallery.length) % product.gallery.length;
    this.handleImgChange(product.gallery[prevIndex]);
  };
  handleNextImage = () => {
    const { product, currentImg } = this.state;
    const index = product.gallery.indexOf(currentImg);
    const nextIndex = (index + 1) % product.gallery.length;
    this.handleImgChange(product.gallery[nextIndex]);
  };

  render() {
    const {
      product,
      currentImg,
      selectedSize,
      selectedColor,
      selectedCapacity,
      loading,
      error,
    } = this.state;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!product) return <p>Product not found</p>;

    const hasSize = product.attributes.some((attr) => attr.id === "Size");
    const hasColor = product.attributes.some((attr) => attr.id === "Color");
    const hasCapacity = product.attributes.some((attr) => attr.id === "Capacity");

    return (
      <>
        <Header activeCategory={product.category} />

        <section className="flex flex-col gap-12 m-[50px] lg:flex-row md:m-[140px] lg:gap-0">
          <Gallery
            data={product}
            currentImg={currentImg}
            handleImgChange={this.handleImgChange}
            handlePrevImage={this.handlePrevImage}
            handleNextImage={this.handleNextImage}
          />

          <div className="lg:ml-[200px]">
            <p className="font-semibold text-3xl">{product.name}</p>

            {hasSize && (
              <Size
                sizes={{
                  availableSizes:
                    product.attributes.find((a) => a.id === "Size")?.items || [],
                  size: selectedSize,
                }}
                onSizeChange={this.handleSizeChange}
              />
            )}

            {hasColor && (
              <Color
                colors={{
                  availableColors:
                    product.attributes.find((a) => a.id === "Color")?.items || [],
                  color: selectedColor,
                }}
                onColorChange={this.handleColorChange}
              />
            )}

            {hasCapacity && (
              <Capacity
                capacities={{
                  availableCapacities:
                    product.attributes.find((a) => a.id === "Capacity")?.items || [],
                  capacity: selectedCapacity,
                }}
                onCapacityChange={this.handleCapacityChange}
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
              onClick={this.handleAddToCart}
              className="bg-[#5ECE7B] font-semibold mt-6 disabled:bg-[#99dbab] w-[292px] h-[43px] text-white uppercase"
            >
              Add To Cart
            </button>

            <div className="lg:pr-[150px] mt-6 max-w-[900px]" data-testid="product-description">
              {parse(product.description || "")}
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default PagDetails;
