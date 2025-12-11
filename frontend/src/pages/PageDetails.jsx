import React from "react";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import parse from "html-react-parser";

import Header from "../components/Header/Header";
import Gallery from "../components/Gallery";
import Size from "../components/Cart/Options/Size";
import Color from "../components/Cart/Options/Colors";
import Capacity from "../components/Cart/Options/Capacity";
import TextAttribute from "../components/Cart/Options/TextAttribute";
import { addToCart } from "../utils/utils";

const isProduction = window.location.hostname !== 'localhost';

const graphqlUri = isProduction 
  ? 'https://tesk-task.xo.je/backend/public//index.php' 
  : 'http://localhost:8000/index.php';

console.log('🔗 PageDetails GraphQL URI:', graphqlUri);
console.log('🌍 PageDetails Environment:', isProduction ? 'PRODUCTION' : 'LOCALHOST');

const client = new ApolloClient({
  uri: graphqlUri,
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

class PageDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      product: null,
      currentImg: null,
      selectedSize: "",
      selectedColor: "",
      selectedCapacity: "",
      selectedOtherAttributes: {},
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

      console.log('📦 Product loaded:', data.product.name);
      console.log('🎨 All attributes:', data.product.attributes);
      
      data.product.attributes.forEach(attr => {
        console.log(`\n${attr.name} (${attr.type}):`);
        attr.items.forEach(item => {
          console.log(`  - ${item.displayValue}: ${item.value}`);
        });
      });

      this.setState({
        product: data.product,
        currentImg: data.product.gallery[0],
        loading: false,
      });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  }

  handleSizeChange = (value) => {
    this.setState({ selectedSize: value });
  };

  handleColorChange = (value) => {
    this.setState({ selectedColor: value });
  };

  handleCapacityChange = (value) => {
    this.setState({ selectedCapacity: value });
  };

  handleOtherAttributeChange = (attributeId, value) => {
    this.setState(prevState => ({
      selectedOtherAttributes: {
        ...prevState.selectedOtherAttributes,
        [attributeId]: value
      }
    }));
  };

  handleAddToCart = () => {
    const { product, selectedSize, selectedColor, selectedCapacity, selectedOtherAttributes } = this.state;

    const sizeAttr = product.attributes.find(a => a.name.toLowerCase().includes('size'));
    const colorAttr = product.attributes.find(a => a.name.toLowerCase().includes('color'));
    const capacityAttr = product.attributes.find(a => a.name.toLowerCase().includes('capacity'));
    
    const otherAttributes = product.attributes.filter(a => {
      const name = a.name.toLowerCase();
      return !name.includes('size') && !name.includes('color') && !name.includes('capacity');
    });

    const otherAttributesWithValues = otherAttributes.map(attr => ({
      ...attr,
      selectedValue: selectedOtherAttributes[attr.id] || ""
    }));

    const item = {
      id: product.id,
      img: product.gallery[0],
      name: product.name,
      quantity: 1,
      price: Number(product.prices[0].amount.toFixed(2)),
      currencySymbol: product.prices[0].currency.symbol,
      availableSizes: sizeAttr?.items || [],
      availableColors: colorAttr?.items || [],
      availableCapacities: capacityAttr?.items || [],
      size: selectedSize,
      color: selectedColor,
      capacity: selectedCapacity,
      otherAttributes: otherAttributesWithValues,
    };

    addToCart(item);
    localStorage.setItem("isCartOpen", JSON.stringify(true));
  };

  handleImgChange = (img) => {
    this.setState({ currentImg: img });
  };

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

    if (loading) return null;

    if (error) {
      return <p>Error: {error}</p>;
    }

    if (!product) {
      return <p>Product not found</p>;
    }

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

            {product.attributes.map((attr) => {
              const attrNameLower = attr.name.toLowerCase();
              
              if (attrNameLower.includes('size')) {
                return (
                  <div key={attr.id} data-testid={`product-attribute-${attr.id}`}>
                    <Size
                      sizes={{
                        availableSizes: attr.items,
                        size: selectedSize,
                      }}
                      onSizeChange={this.handleSizeChange}
                    />
                  </div>
                );
              }
              
              if (attrNameLower.includes('color')) {
                return (
                  <div key={attr.id} data-testid={`product-attribute-${attr.id}`}>
                    <Color
                      colors={{
                        availableColors: attr.items,
                        color: selectedColor,
                      }}
                      onColorChange={this.handleColorChange}
                    />
                  </div>
                );
              }
              
              if (attrNameLower.includes('capacity')) {
                return (
                  <div key={attr.id} data-testid={`product-attribute-${attr.id}`}>
                    <Capacity
                      capacities={{
                        availableCapacities: attr.items,
                        capacity: selectedCapacity,
                      }}
                      onCapacityChange={this.handleCapacityChange}
                    />
                  </div>
                );
              }
              
           
              return (
                <div key={attr.id} data-testid={`product-attribute-${attr.id}`}>
                  <TextAttribute
                    attribute={attr}
                    selectedValue={this.state.selectedOtherAttributes[attr.id] || ""}
                    onValueChange={(value) => this.handleOtherAttributeChange(attr.id, value)}
                    disabled={false}
                  />
                </div>
              );
            })}

            <p className="uppercase mt-4 text-lg font-bold">Price:</p>
            <p className="uppercase mt-4 text-2xl font-bold">
              {product.prices[0].currency.symbol}
              {product.prices[0].amount.toFixed(2)}
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
}

export default PageDetails;
